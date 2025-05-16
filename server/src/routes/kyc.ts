import { Router, Request, Response } from 'express';
import axios from 'axios';
import { FORTE_API, FORTE_CREDENTIALS } from './config';

const router = Router();

interface SiweData {
  message: string;
  signature: string;
  address: string;
}

interface KYCRequest {
  walletAddress: string;
  level?: number;
  siweData?: SiweData;
}

// Get OAuth2 access token
async function getAccessToken(): Promise<string> {
  try {
    const response = await axios.post(
      `${FORTE_API.BASE_URL}${FORTE_API.AUTH_ENDPOINT}`,
      {
        client_id: FORTE_CREDENTIALS.CLIENT_ID,
        client_secret: FORTE_CREDENTIALS.CLIENT_SECRET
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.data.access_token;
  } catch (error: any) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw new Error('Failed to obtain access token');
  }
}

// Initiate KYC verification
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { walletAddress, level = 3, siweData } = req.body as KYCRequest;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Get access token
    const accessToken = await getAccessToken();

    const payload: any = {
      action: {
        type: "OCC_RULES_ENGINE_V2",
        level
      },
      customer: {
        external_id: walletAddress,
        wallet: {
          blockchain: "base_sepolia",
          address: walletAddress
        },
      }
    };

    // Add SIWE data if available
    if (siweData) {
      payload.customer.wallet.siwe = {
        message: siweData.message,
        signature: siweData.signature
      };
    }

    const response = await axios.post(
      `${FORTE_API.BASE_URL}${FORTE_API.KYC_ENDPOINT}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error('Error initiating KYC verification:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to initiate KYC verification',
      details: error.response?.data || error.message
    });
  }
});

export const kycRouter = router; 