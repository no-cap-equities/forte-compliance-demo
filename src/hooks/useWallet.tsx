import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export const useWallet = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      connect({ connector: injected() });
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  useEffect(() => {
    // Clean up error state on connection changes
    if (isConnected) {
      setError(null);
    }
  }, [isConnected]);

  return {
    address,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet
  };
}; 