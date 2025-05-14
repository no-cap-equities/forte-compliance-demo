import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import type { SiweData } from '../types/siwe';

export const useSiwe = () => {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const createSiweMessage = async (nonce: string, domain: string, uri: string) => {
    if (!address || !chainId) return null;
    
    const message = new SiweMessage({
      domain,
      address,
      statement: 'Sign in with Ethereum to Forte KYC Verification',
      uri,
      version: '1',
      chainId,
      nonce
    });
    
    return message.prepareMessage();
  };
  
  const signMessage = async (): Promise<SiweData | null> => {
    try {
      setIsSigningMessage(true);
      setError(null);
      
      if (!address || !chainId) {
        throw new Error('Wallet not connected');
      }
      
      // Create a random nonce
      const nonce = Math.floor(Math.random() * 1000000).toString();
      const domain = window.location.host;
      const uri = window.location.origin;
      
      // Create the SIWE message
      const message = await createSiweMessage(nonce, domain, uri);
      if (!message) throw new Error('Failed to create message');
      
      // Sign the message
      const signature = await signMessageAsync({ message });
      
      // Return the full data needed for verification
      return {
        message,
        signature,
        nonce,
        address
      };
    } catch (err: any) {
      console.error('Error signing message:', err);
      setError(err.message || 'Failed to sign message');
      return null;
    } finally {
      setIsSigningMessage(false);
    }
  };
  
  return {
    signMessage,
    isSigningMessage,
    error
  };
}; 