'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { Chain } from 'wagmi/chains';

const baseWithFallbacks: Chain = {
    ...base,
    rpcUrls: {
        ...base.rpcUrls,
        default: {
            http: [
                'https://mainnet.base.org',
                'https://base.publicnode.com',
                'https://1rpc.io/base',
                'https://base.meowrpc.com',
            ],
        },
    },
};

export const config = getDefaultConfig({
    appName: 'BaseLock',
    projectId: 'YOUR_PROJECT_ID', // User needs to replace this later
    chains: [baseWithFallbacks, baseSepolia],
    ssr: true,
});
