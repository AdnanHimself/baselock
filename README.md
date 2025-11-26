# BaseLock 🔒

**Monetize your links on Base L2.**

BaseLock allows you to create token-gated links that can only be unlocked by paying a specific amount of ETH. Built for the Base ecosystem.

![BaseLock UI](https://github.com/AdnanHimself/baselock/assets/placeholder/ui-preview.png)

## Features

- **Create Locked Links**: Easily generate a short link for your secret content (Dropbox, Google Drive, etc.).
- **Set Your Price**: Define how much ETH users need to pay to access the content.
- **Crypto Payments**: Seamless integration with RainbowKit and Wagmi for wallet connection and payments.
- **Base L2 Native**: Optimized for low fees and fast transactions on the Base network.
- **Polished UI**: Modern, flat design with a "Base Blue" aesthetic.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Web3**: [RainbowKit](https://www.rainbowkit.com/), [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/)
- **Database**: [Supabase](https://supabase.com/)
- **Smart Contract**: Solidity (Base Mainnet)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AdnanHimself/baselock.git
    cd baselock
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file and add your Supabase credentials and WalletConnect Project ID:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open in Browser:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## Smart Contract

The current MVP uses a simple payment router contract on Base.

- **Contract Address**: `0x9F219810226679bFb75698a0e4fFf03E59341672`
- **Network**: Base Mainnet

## Disclaimer

⚠️ **MVP Status**: This is a Proof of Concept. The current implementation performs client-side verification of payments. For high-value content, a server-side verification mechanism (API route) is recommended to prevent bypassing the lock.
