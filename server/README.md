# Forte Compliance Backend Server

This is the backend server for the Forte compliance verification system. It handles authentication and KYC verification requests securely.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Forte API Configuration
FORTE_API_BASE_URL=https://api.forte.com
FORTE_API_AUTH_ENDPOINT=/oauth/token
FORTE_API_KYC_ENDPOINT=/v1/kyc/verify
FORTE_CLIENT_ID=your_client_id
FORTE_CLIENT_SECRET=your_client_secret

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### POST /api/auth/token
Get an OAuth2 access token from Forte.

Response:
```json
{
  "data": {
    "access": "string",
    "expires_in": number,
    "token_type": "string"
  }
}
```

### KYC Verification

#### POST /api/kyc/verify
Initiate KYC verification for a wallet address.

Request body:
```json
{
  "walletAddress": "string",
  "level": number,
  "siweData": {
    "message": "string",
    "signature": "string",
    "address": "string"
  }
}
```

Headers:
- `Authorization: Bearer <access_token>`

Response:
```json
{
  "data": {
    "flow": "string",
    "error_code": "string | null",
    "widget_data": "string"
  }
}
```

## Security

- The server uses Helmet for security headers
- CORS is configured to only allow requests from specified origins
- Environment variables are used for sensitive configuration
- Error messages are sanitized in production

## Development

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm start`: Start production server 