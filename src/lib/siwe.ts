'use client';

import { SiweMessage } from 'siwe';

/**
 * Creates a SIWE message for the user to sign
 * @param address The user's wallet address
 * @returns A SIWE message object
 */
export function createSiweMessage(address: string, statement: string = 'Sign in with Ethereum to initiate KYC verification.') {
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

// curl -X POST http://localhost:3001/api/kyc/verify \
//   -H "Authorization: Bearer eyJraWQiOiI4WHg0SkxsV280cCtHb3VzREZtUGFhendZU2FEa2pzWmFjeDZMMnEwblhvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxc2dhajI4cjliNXY3YjNwZ21rbTF2dTVjcCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoibm92YXBheVwvd3JpdGUgbm92YXBheVwvcmVhZCIsImF1dGhfdGltZSI6MTc0NzMzODczNCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfMzdLc1J0cDA0IiwiZXhwIjoxNzQ3MzQyMzM0LCJpYXQiOjE3NDczMzg3MzQsInZlcnNpb24iOjIsImp0aSI6IjVlODE2OThmLTJiNWYtNGJmOS04OWE2LTg5Y2U0ODBmYjU2ZiIsImNsaWVudF9pZCI6IjFzZ2FqMjhyOWI1djdiM3BnbWttMXZ1NWNwIn0.AbU9-5arVyytIQar4iWD4eF_YMAu59Pq9XdUXxsPwWIBhOGz1Mf6pgnBN-KVsHb8dhq5EZV1ITt5bf9rL7jPFo3GKC8QRbJmMtdZ0EH9_JffXiZtn1XB7Er82ZMA9poSPhXkoP5DUbUEOMYKnQFtygrGOEL_U6LNLjxfVOQFiP0X6dVf0XqVi-ZQTE9pnBB83gY9RaVn0mNuxfYZmueXbNNNksthFenih_BdzlgWUzwfeZ-6agzIOC3Z4RJ9cwSM4oxqP8oziqafoeEpe5UpI59vOGMgJphNSbfUhnRW_5Yzp0XX1PXcgSoSl3d80pHSgCT5M5oGt45mMiNCnwfiZA" \
//   -H "Content-Type: application/json" \
//   -d '{
//     "walletAddress": "0x1234567890123456789012345678901234567890",
//     "level": 3
//   }'