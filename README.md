# Forte Compliance Demo

This is a modern React application that demonstrates the integration of the Forte Compliance SDK for KYC onboarding. The application showcases the complete flow of user verification, including wallet connection, verification level selection, and processing the KYC verification.

## Features

- Connect to Ethereum wallets using Wagmi
- Select verification levels (1-3) with different requirements
- Initiate KYC verification through Forte Compliance SDK
- Process the verification flow with mock widget integration
- Display verification status and results

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- Wagmi for wallet integration
- Vite for development environment
- Axios for API communication
- React Query for data fetching

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MetaMask or another Ethereum wallet browser extension

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/forte-compliance-demo.git
   cd forte-compliance-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:5173

## Usage

1. Connect your wallet using the "Connect Wallet" button
2. Select a verification level based on your requirements
3. Click "Start Verification" to initiate the KYC process
4. Complete the verification steps in the Forte Compliance widget
5. View your verification status and details upon completion

## Important Notes

- This demo uses the Forte Compliance SDK with the provided client credentials
- The verification process is simulated for demonstration purposes
- In a production environment, you would integrate with the actual Forte Compliance widget

## License

MIT
