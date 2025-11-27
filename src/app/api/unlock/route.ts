import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, parseAbiItem, decodeEventLog, keccak256, toBytes, parseUnits, verifyMessage } from 'viem';
import { base } from 'viem/chains';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Initialize Viem Public Client for Base Mainnet
const publicClient = createPublicClient({
    chain: base,
    transport: http()
});

// TODO: Update this after deploying V2
const CONTRACT_ADDRESS = '0x5CB532D8799b36a6E5dfa1663b6cFDDdDB431405';

export async function POST(req: NextRequest) {
    try {
        const { linkId, txHash, userAddress, signature } = await req.json();

        if (!linkId || !txHash || !userAddress || !signature) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 0. Verify Signature
        const message = `Unlock content for link: ${linkId}`;
        const isValidSignature = await verifyMessage({
            address: userAddress,
            message: message,
            signature: signature,
        });

        if (!isValidSignature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // 1. Fetch Link Price and Receiver from Database
        const { data: link, error: linkError } = await supabaseAdmin
            .from('links')
            .select('price, receiver_address')
            .eq('id', linkId)
            .single();

        if (linkError || !link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        // 2. Verify Transaction on-chain
        const transaction = await publicClient.getTransactionReceipt({
            hash: txHash
        });

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        if (transaction.status !== 'success') {
            return NextResponse.json({ error: 'Transaction failed' }, { status: 400 });
        }

        // 3. Verify Event Logs
        // Event: Paid(address indexed payer, address indexed receiver, string indexed linkId, uint256 amount, address token)
        const paidEventAbi = parseAbiItem('event Paid(address indexed payer, address indexed receiver, string indexed linkId, uint256 amount, address token)');

        let paymentVerified = false;

        for (const log of transaction.logs) {
            // Check against V2 Contract Address (case insensitive)
            // Note: If using placeholder, this check will fail unless we skip it for testing or user updates it.
            // For now, we assume user updates it.
            if (log.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()) {
                try {
                    const decodedLog = decodeEventLog({
                        abi: [paidEventAbi],
                        data: log.data,
                        topics: log.topics
                    });

                    if (decodedLog.eventName === 'Paid') {
                        const args = decodedLog.args;

                        // Verify Link ID
                        const expectedLinkIdHash = keccak256(toBytes(linkId));
                        if (args.linkId !== expectedLinkIdHash) {
                            continue;
                        }

                        // Verify Receiver (Prevent Payment Diversion)
                        if (args.receiver.toLowerCase() !== link.receiver_address.toLowerCase()) {
                            console.error(`Invalid receiver. Paid to: ${args.receiver}, Expected: ${link.receiver_address}`);
                            continue;
                        }

                        // Verify Token and Amount
                        const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
                        const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

                        if (args.token.toLowerCase() === USDC_ADDRESS.toLowerCase()) {
                            // USDC Payment
                            const requiredAmount = parseUnits(link.price.toString(), 6);
                            if (args.amount < requiredAmount) {
                                console.error(`Insufficient USDC payment. Paid: ${args.amount}, Required: ${requiredAmount}`);
                                continue;
                            }
                        } else if (args.token === ZERO_ADDRESS) {
                            // ETH Payment (Native)
                            // Hardcoded rate: 1 USDC = 0.0003 ETH
                            const ethRate = 0.0003;
                            const priceVal = parseFloat(link.price.toString());
                            const requiredETH = parseUnits((priceVal * ethRate).toFixed(18), 18);

                            // 1% tolerance
                            const tolerance = (requiredETH * BigInt(99)) / BigInt(100);

                            if (args.amount < tolerance) {
                                console.error(`Insufficient ETH payment. Paid: ${args.amount}, Required: ~${requiredETH}`);
                                continue;
                            }
                        } else {
                            console.error(`Invalid token. Paid with: ${args.token}`);
                            continue;
                        }

                        // Verify Payer
                        if (args.payer.toLowerCase() !== userAddress.toLowerCase()) {
                            continue;
                        }

                        paymentVerified = true;
                        break;
                    }
                } catch (e) {
                    // Log decoding failed or didn't match, continue to next log
                    continue;
                }
            }
        }

        if (!paymentVerified) {
            return NextResponse.json({ error: 'Invalid payment: Verification failed' }, { status: 400 });
        }

        // 4. Retrieve Secret Content
        const { data: secret, error: secretError } = await supabaseAdmin
            .from('secrets')
            .select('target_url')
            .eq('link_id', linkId)
            .single();

        if (secretError || !secret) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, targetUrl: secret.target_url });

    } catch (error) {
        console.error('Unlock API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
