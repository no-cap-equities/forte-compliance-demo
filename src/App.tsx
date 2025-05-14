import { useState } from 'react'
import { WagmiProvider } from './lib/wagmi'
import { WalletConnect } from './components/WalletConnect'
import { LevelSelector } from './components/LevelSelector'
import { KYCVerification } from './components/KYCVerification'
import { useWallet } from './hooks/useWallet'
import { useSiwe } from './hooks/useSiwe'

function AppContent() {
  const { address, isConnected } = useWallet();
  const { signIn, isLoading, error: siweError } = useSiwe();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showSigningPrompt, setShowSigningPrompt] = useState(false);
  const [siweData, setSiweData] = useState<any | undefined>(undefined);
  const [signatureError, setSignatureError] = useState<string | null>(null);

  const handleStartVerification = async () => {
    setSignatureError(null);
    setShowSigningPrompt(true);
  };

  const handleProceedWithVerification = async () => {
    if (!address) {
      setSignatureError("Wallet address not available");
      return;
    }
    
    try {
      setSignatureError(null);
      
      const result = await signIn(address);
      
      if (result.success && result.signature && result.siweMessage) {
        setSiweData({
          message: result.siweMessage,
          signature: result.signature,
          address
        });
        setShowSigningPrompt(false);
        setIsVerifying(true);
      } else if (result.message) {
        setSignatureError(result.message);
      } else if (siweError) {
        setSignatureError(siweError.message);
      }
    } catch (error: any) {
      console.error('Error signing message:', error);
      setSignatureError(error.message || 'Failed to sign message');
    }
  };

  const handleVerificationComplete = () => {
    setIsVerifying(false);
    setIsVerified(true);
    setSiweData(undefined); // Clear SIWE data after verification is complete
  };

  const handleCancelSigning = () => {
    setShowSigningPrompt(false);
    setSignatureError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Forte Compliance Demo</h1>
          </div>
          <WalletConnect />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isConnected ? (
          <div className="bg-white shadow rounded-lg p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-8">
              To use the Forte Compliance verification service, please connect your wallet first.
            </p>
            <div className="flex justify-center">
              <WalletConnect />
            </div>
          </div>
        ) : isVerifying ? (
          <KYCVerification 
            walletAddress={address || ''} 
            level={selectedLevel} 
            onComplete={handleVerificationComplete}
            siweData={siweData}
          />
        ) : isVerified ? (
          <div className="bg-white shadow rounded-lg p-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Verification Complete!</h2>
              <p className="text-gray-600 mt-2">
                You have successfully completed Level {selectedLevel} verification.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Verification Details</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Wallet Address:</span>
                <span className="font-mono">{address?.slice(0, 10)}...{address?.slice(-8)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Verification Level:</span>
                <span className="font-medium">{selectedLevel}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Verified</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setIsVerified(false);
                  setSelectedLevel(1);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Start New Verification
              </button>
            </div>
          </div>
        ) : showSigningPrompt ? (
          <div className="bg-white shadow rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Message to Proceed</h2>
            <p className="text-gray-600 mb-8">
              To verify your wallet ownership, please sign a message using your wallet. This signature will be used to authenticate your KYC verification request.
            </p>
            
            {(signatureError || (siweError && siweError.message)) && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
                <p className="text-red-600 font-medium mb-1">Error</p>
                <p className="text-red-600">{signatureError || (siweError && siweError.message)}</p>
                <div className="mt-2">
                  <p className="text-sm text-red-500">
                    Please make sure your wallet is connected to the correct network (Base Sepolia).
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={handleCancelSigning}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedWithVerification}
                disabled={isLoading}
                className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Signing...
                  </div>
                ) : (
                  'Sign & Continue'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">KYC Verification</h2>
            <p className="text-gray-600 mb-8">
              Select the level of verification you want to complete with Forte Compliance.
            </p>
            
            <LevelSelector 
              selectedLevel={selectedLevel} 
              onSelectLevel={setSelectedLevel} 
            />
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleStartVerification}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Start Verification
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Powered by Forte Compliance • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <WagmiProvider>
      <AppContent />
    </WagmiProvider>
  )
}

export default App
