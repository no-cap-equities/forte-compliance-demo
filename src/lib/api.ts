import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface SiweData {
  message: string;
  signature: string;
  address: string;
}

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

// Get OAuth2 access token from our backend
export const getAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post<AccessTokenResponse>(
      `${API_BASE_URL}/auth/token`
    );

    return response.data.data.access;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to obtain access token');
  }
};

// Initiate KYC verification request through our backend
export const initiateKYCVerification = async (
  walletAddress: string,
  level: number = 3,
  siweData?: SiweData
): Promise<string> => {
  try {
    const response = await axios.post<KYCResponse>(
      `${API_BASE_URL}/kyc/verify`,
      {
        walletAddress,
        level,
        // siweData
      }
    );

    return response.data.data.widget_data;
  } catch (error: any) {
    console.error('Error initiating KYC verification:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to initiate KYC verification');
  }
}; 