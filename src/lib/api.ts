import axios from 'axios';
import { FORTE_API, FORTE_CREDENTIALS } from './config';
import type { SiweData } from '../types/siwe';

interface AccessTokenResponse {
  data: {
    access: string;
    expires_in: number;
    token_type: string;
  };
}

interface KYCResponse {
  data: {
    flow: string;
    error_code: string | null;
    widget_data: string;
  };
}

// Get OAuth2 access token
export const getAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post<AccessTokenResponse>(
      `${FORTE_API.BASE_URL}${FORTE_API.AUTH_ENDPOINT}`,
      {
        client_id: FORTE_CREDENTIALS.CLIENT_ID,
        client_secret: FORTE_CREDENTIALS.CLIENT_SECRET
      }
    );
    
    return response.data.data.access;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to obtain access token');
  }
};

// Initiate KYC verification request
export const initiateKYCVerification = async (
  accessToken: string,
  walletAddress: string,
  level: number = 3,
  siweData?: SiweData
): Promise<string> => {
  try {
    const payload = {
      action: {
        type: "OCC_RULES_ENGINE_V2",
        level
      },
      customer: {
        wallet: {
          blockchain: "base_sepolia",
          address: walletAddress
        },
        external_id: walletAddress
      }
    };

    // Add SIWE data if available
    if (siweData) {
      Object.assign(payload, {
        auth: {
          type: "SIWE",
          data: {
            message: siweData.message,
            signature: siweData.signature,
            nonce: siweData.nonce
          }
        }
      });
    }
    
    const response = await axios.post<KYCResponse>(
      `${FORTE_API.BASE_URL}${FORTE_API.KYC_ENDPOINT}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    
    return response.data.data.widget_data;
  } catch (error) {
    console.error('Error initiating KYC verification:', error);
    throw new Error('Failed to initiate KYC verification');
  }
}; 