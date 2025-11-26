'use client';

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, Unlock, Download, AlertCircle } from 'lucide-react';
import { parseEther, parseUnits } from 'viem';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

// ABI for BaseLock (Simplified for MVP)
const BASELOCK_ABI = [
    {
        "inputs": [
            { "internalType": "address payable", "name": "receiver", "type": "address" },
            { "internalType": "string", "name": "linkId", "type": "string" }
        ],
        "name": "payEth",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "payer", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" },
            { "indexed": true, "internalType": "string", "name": "linkId", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "indexed": false, "internalType": "address", "name": "token", "type": "address" }
        ],
        "name": "Paid",
        "type": "event"
    }
] as const;

const CONTRACT_ADDRESS = '0x9F219810226679bFb75698a0e4fFf03E59341672';

export default function UnlockPage() {
    const { shortId } = useParams();
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { showToast } = useToast();

    const [linkData, setLinkData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [checkingAccess, setCheckingAccess] = useState(false);

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (shortId) fetchLinkData();
    }, [shortId]);

    useEffect(() => {
        if (isConnected && address && linkData) {
            checkAccess();
        }
    }, [isConnected, address, linkData, isSuccess]);

    const fetchLinkData = async () => {
        try {
            const { data, error } = await supabase
                .from('links')
                .select('*')
                .eq('id', shortId)
                .single();

            if (error) throw error;
            setLinkData(data);
        } catch (err) {
            console.error('Error fetching link:', err);
            showToast('Failed to load link data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const checkAccess = async () => {
        if (!address || !linkData || !publicClient) return;
        setCheckingAccess(true);
        try {
            const logs = await publicClient.getLogs({
                address: CONTRACT_ADDRESS,
                event: {
                    type: 'event',
                    name: 'Paid',
                    inputs: [
                        { indexed: true, name: 'payer', type: 'address' },
                        { indexed: true, name: 'receiver', type: 'address' },
                        { indexed: true, name: 'linkId', type: 'string' },
                        { indexed: false, name: 'amount', type: 'uint256' },
                        { indexed: false, name: 'token', type: 'address' }
                    ]
                },
                args: {
                    payer: address,
                    linkId: shortId as string
                },
                fromBlock: 'earliest'
            });

            if (logs.length > 0) {
                setHasAccess(true);
            }
        } catch (err) {
            console.error('Error checking access:', err);
            // Don't show toast here to avoid spamming if it fails silently
        } finally {
            setCheckingAccess(false);
        }
    };

    const handlePay = () => {
        if (!linkData) return;

        try {
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: BASELOCK_ABI,
                functionName: 'payEth',
                args: [linkData.receiver_address, shortId as string],
                value: parseEther(linkData.price.toString()),
            });
        } catch (err) {
            console.error('Payment error:', err);
            showToast('Payment failed to initiate', 'error');
        }
    };

    if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
    if (!linkData) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Link not found</div>;

    return (
        <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 bg-neutral-900 rounded-full border border-neutral-800">
                        {hasAccess ? <Unlock className="w-8 h-8 text-green-500" /> : <Lock className="w-8 h-8 text-red-500" />}
                    </div>
                    <h1 className="text-3xl font-bold">{linkData.title}</h1>
                    <p className="text-neutral-400">
                        {hasAccess ? "You have access to this content." : `Pay ${linkData.price} ETH to unlock.`}
                    </p>
                </div>

                {!isConnected ? (
                    <div className="flex justify-center">
                        <ConnectButton />
                    </div>
                ) : hasAccess ? (
                    <div className="bg-green-900/20 border border-green-900 rounded-2xl p-6 text-center space-y-4">
                        <p className="text-green-400 font-medium">Payment Verified!</p>
                        <a
                            href={linkData.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Access Content
                        </a>
                    </div>
                ) : (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
                        <div className="flex justify-between items-center text-sm text-neutral-400">
                            <span>Price</span>
                            <span className="text-white font-mono text-lg">{linkData.price} ETH</span>
                        </div>

                        <Button
                            onClick={handlePay}
                            disabled={isPending || isConfirming || checkingAccess}
                            isLoading={isPending || isConfirming || checkingAccess}
                        >
                            {isPending ? 'Confirm in Wallet...' :
                                isConfirming ? 'Processing Transaction...' :
                                    checkingAccess ? 'Checking Access...' :
                                        'Pay to Unlock'}
                        </Button>

                        {isSuccess && !hasAccess && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-yellow-500 text-sm justify-center">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Transaction confirmed, verifying access...</span>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={checkAccess}
                                    isLoading={checkingAccess}
                                    disabled={checkingAccess}
                                >
                                    Verify Access Manually
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
