'use client';

import { SiweMessage } from 'siwe';

/**
 * Creates a SIWE message for the user to sign
 * @param address The user's wallet address
 * @returns A SIWE message object
 */
export function createSiweMessage(address: string, statement: string = 'Sign in with Ethereum to authenticate and register for the airdrop. Confirming accepts the terms and conditions of the K9 DAO program.') {
  const domain = window.location.host;
  const origin = window.location.origin;
  
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: 1, // Ethereum mainnet
    nonce: generateNonce(),
  });
  
  return message;
}

/**
 * Generates a random nonce for the SIWE message
 * @returns A random string to be used as a nonce
 */
function generateNonce(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Prepares a SIWE message for signing
 * @param address The user's wallet address
 * @returns An object containing the message and its prepared string representation
 */
export function prepareSiweMessage(address: string) {
  const message = createSiweMessage(address);
  return {
    message,
    preparedMessage: message.prepareMessage(),
  };
} 