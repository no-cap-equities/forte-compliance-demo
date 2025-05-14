import { useState, useEffect } from 'react';
import { getAccessToken, initiateKYCVerification } from '../lib/api';
import type { SiweData } from '../types/siwe';

interface KYCVerificationProps {
  walletAddress: string;
  level?: number;
  onComplete?: () => void;
  siweData?: SiweData;
}

export const KYCVerification = ({ 
  walletAddress, 
  level = 3, 
  onComplete,
  siweData
}: KYCVerificationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [widgetData, setWidgetData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress || !siweData) return;
    
    const initiateVerification = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Step 1: Get access token
        const accessToken = await getAccessToken();
        
        // Step 2: Initiate KYC verification with SIWE data
        const widgetDataResponse = await initiateKYCVerification(
          accessToken,
          walletAddress,
          level,
          siweData
        );
        
        setWidgetData(widgetDataResponse);
        
        // Initialize widget if widget data is available
        if (widgetDataResponse) {
          initializeWidget(widgetDataResponse);
        }
      } catch (err) {
        console.error('Error in KYC verification flow:', err);
        setError('Failed to initialize KYC verification. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initiateVerification();
  }, [walletAddress, level, siweData]);

  const initializeWidget = (widgetData: string) => {
    // This is a placeholder for the actual widget initialization
    // In a real implementation, you would use the Forte widget SDK
    
    // Simulating widget container setup
    const container = document.getElementById('forte-kyc-widget');
    if (container) {
      container.innerHTML = '<div class="p-4 bg-gray-100 rounded-lg">KYC Widget Placeholder</div>';
      
      // Register event handlers for widget events
      // In a real implementation, you would register actual event handlers
      window.addEventListener('WIDGET_EVENT', handleWidgetEvent);
    }
  };

  const handleWidgetEvent = (event: any) => {
    console.log('Widget event received:', event);
    
    // Handle different widget events
    if (event.type === 'KYC_COMPLETE') {
      // KYC completed successfully
      if (onComplete) {
        onComplete();
      }
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
        <p className="text-red-500">{error}</p>
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