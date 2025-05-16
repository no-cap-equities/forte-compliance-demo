import { useState, useEffect } from 'react';
import { initiateKYCVerification, type KYCResponse } from '../lib/api';

interface SiweDataProps {
  message: string;
  signature: string;
  address: string;
}

interface KYCVerificationProps {
  walletAddress: string;
  level?: number;
  onComplete?: () => void;
  siweData?: SiweDataProps;
}

// Add type for the window object to include the Forte widget
declare global {
  interface Window {
    initFortePaymentsWidget?: (config: {
      containerId: string;
      data: any;
    }) => void;
  }
}

export const KYCVerification = ({
  walletAddress,
  level = 3,
  onComplete,
  siweData
}: KYCVerificationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [widgetData, setWidgetData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress || !siweData) return;

    const initiateVerification = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setErrorDetails(null);
        
        const widgetDataResponse = await initiateKYCVerification(
          walletAddress,
          level,
          siweData
        );

        // Validate the response data
        if (!widgetDataResponse || typeof widgetDataResponse !== 'object') {
          throw new Error('Invalid widget data received from server');
        }

        // Log the data for debugging
        console.log('Widget data received:', widgetDataResponse);

        setWidgetData(widgetDataResponse);

        // Initialize widget if widget data is available
        if (widgetDataResponse) {
          initializeWidget(widgetDataResponse);
        }
      } catch (err: any) {
        console.error('Error in KYC verification flow:', err);
        setError(err.message || 'Failed to initialize KYC verification');
        setErrorDetails(
          typeof err === 'object' ?
            JSON.stringify(err, Object.getOwnPropertyNames(err), 2) :
            String(err)
        );
      } finally {
        setIsLoading(false);
      }
    };

    initiateVerification();
  }, [walletAddress, level, siweData]);

  const initializeWidget = (widgetData: any) => {
    const container = document.getElementById('forte-kyc-widget');
    if (!container) {
      console.error('Widget container not found');
      return;
    }

    // Clear any existing content
    container.innerHTML = '';

    // Validate widget data before initialization
    try {
      // Ensure the data is properly structured
      if (!widgetData || typeof widgetData !== 'object') {
        throw new Error('Invalid widget data structure');
      }

      // Log the data being passed to the widget
      console.log('Initializing widget with data:', widgetData);

      // Initialize the widget using the Forte SDK
      const initWidget = () => {
        if (window.initFortePaymentsWidget) {
          try {
            window.initFortePaymentsWidget({
              containerId: 'forte-kyc-widget',
              data: widgetData
            });

            // Add event listener for widget events
            window.addEventListener('forte-widget-event', (event: any) => {
              console.log('Forte widget event:', event.detail);
              
              // Handle different widget events
              switch (event.detail.type) {
                case 'verification_complete':
                  if (onComplete) {
                    onComplete();
                  }
                  break;
                case 'verification_error':
                  setError(event.detail.message || 'Verification failed');
                  break;
                default:
                  console.log('Unhandled widget event:', event.detail);
              }
            });
          } catch (initError) {
            console.error('Error initializing widget:', initError);
            setError('Failed to initialize verification widget');
            setErrorDetails(initError instanceof Error ? initError.message : String(initError));
          }
        } else {
          // If widget is not loaded yet, retry after a short delay
          setTimeout(initWidget, 100);
        }
      };

      initWidget();
    } catch (error) {
      console.error('Error in widget initialization:', error);
      setError('Failed to initialize verification widget');
      setErrorDetails(error instanceof Error ? error.message : String(error));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Initializing KYC verification...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-600 font-medium mb-2">Verification Error</h3>
        <p className="text-red-500 mb-2">{error}</p>

        {errorDetails && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-red-600 mb-1">Error Details</h4>
            <pre className="bg-red-100 p-2 rounded text-xs overflow-auto max-h-40">{errorDetails}</pre>
          </div>
        )}

        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">KYC Verification</h2>
          <p className="text-gray-600 mt-1">Complete verification to access Level {level} features</p>
        </div>

        <div id="forte-kyc-widget" className="p-6">
          {!widgetData && (
            <div className="flex flex-col items-center justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading verification widget...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 