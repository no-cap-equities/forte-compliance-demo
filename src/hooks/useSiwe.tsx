// import { useState } from 'react';
// import { useAccount, useSignMessage } from 'wagmi';
// import { SiweMessage } from 'siwe';
// import type { SiweData } from '../types/siwe';

// export const useSiwe = () => {
//   const { address, chainId } = useAccount();
//   const { signMessageAsync } = useSignMessage();
//   const [isSigningMessage, setIsSigningMessage] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const signMessage = async (): Promise<SiweData | null> => {
//     try {
//       setIsSigningMessage(true);
//       setError(null);

//       if (!address || !chainId) {
//         throw new Error('Wallet not connected');
//       }

//       // Generate a simple nonce
//       const nonce = Math.random().toString(36).substring(2, 10);

//       // Create a simple message that doesn't rely on the SiweMessage class
//       const domain = window.location.host;
//       const origin = window.location.origin;

//       const message = `${domain} wants you to sign in with your Ethereum account:
// ${address}

// I accept the Terms of Service: ${origin}/tos
// URI: ${origin}
// Version: 1
// Chain ID: ${chainId}
// Nonce: ${nonce}
// Issued At: ${new Date().toISOString()}`;

//       // Sign the message
//       const signature = await signMessageAsync({ message });

//       // Return the full data needed for verification
//       return {
//         message,
//         signature,
//         nonce,
//         address
//       };
//     } catch (err: any) {
//       console.error('Error signing message:', err);
//       setError(err.message || 'Failed to sign message');
//       return null;
//     } finally {
//       setIsSigningMessage(false);
//     }
//   };

//   return {
//     signMessage,
//     isSigningMessage,
//     error
//   };
// }; 

'use client';

import { useState } from 'react';
import { useSignMessage } from 'wagmi';
import { prepareSiweMessage } from '../lib/siwe';

interface UseSiweResult {
  signIn: (address: string) => Promise<{ 
    success: boolean; 
    message?: string; 
    signature?: string; 
    siweMessage?: string;
  }>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook to handle SIWE signing process
 */
export function useSiwe(): UseSiweResult {
  const [error, setError] = useState<Error | null>(null);
  const { signMessageAsync, isPending } = useSignMessage();

  /**
   * Signs a message using the user's wallet
   */
  const signIn = async (address: string) => {
    try {
      setError(null);
      
      // Create and prepare the SIWE message
      const { message, preparedMessage } = prepareSiweMessage(address);
      
      // Request signature from the wallet
      const signature = await signMessageAsync({ 
        message: preparedMessage,
      });
      
      return {
        success: true,
        signature,
        siweMessage: message.toMessage(),
      };
    } catch (err) {
      console.error('Error during SIWE signing:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign message';
      setError(new Error(errorMessage));
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  return {
    signIn,
    isLoading: isPending,
    error,
  };
} 