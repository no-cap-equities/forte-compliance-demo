import { useWallet } from '../hooks/useWallet';

export const WalletConnect = () => {
  const { address, isConnected, isLoading, error, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-mono">
          {formatAddress(address)}
        </div>
        <button
          onClick={disconnectWallet}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      <button
        onClick={connectWallet}
        disabled={isLoading}
        className={`px-6 py-3 rounded-md font-medium text-white ${
          isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } transition-colors flex items-center justify-center`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Connecting...
          </>
        ) : (
          'Connect Wallet'
        )}
      </button>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
}; 