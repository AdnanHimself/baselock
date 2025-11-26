import { createClient } from '@supabase/supabase-js';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { NextRequest, NextResponse } from 'next/server';

// Init Supabase (Admin context if needed, but anon is fine for read)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Init Viem Client (Connects to Blockchain)
const client = createPublicClient({
    chain: base, // Or baseSepolia if testing there
    transport: http(),
});

const CONTRACT_ADDRESS = '0xB2d3a54378844b17d96D14E5CC000a8Ae5FaEbF8';

export async function GET(req: NextRequest, { params }: { params: { shortId: string } }) {
    const { shortId } = params;
    const payerAddress = req.nextUrl.searchParams.get('payer');

    if (!payerAddress) {
        return NextResponse.json({ error: 'Missing payer address' }, { status: 400 });
    }

    // 1. Get Link Data
    const { data: link, error } = await supabase
        .from('links')
        .select('*')
        .eq('id', shortId)
        .single();

    if (error || !link) {
        return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // 2. Verify Payment on Blockchain
    // We look for the "Paid" event: event Paid(address indexed payer, address indexed receiver, string linkId, uint256 amount, address token);
    try {
        const logs = await client.getLogs({
            address: CONTRACT_ADDRESS,
            event: parseAbiItem('event Paid(address indexed payer, address indexed receiver, string linkId, uint256 amount, address token)'),
            args: {
                payer: payerAddress as `0x${string}`,
                linkId: shortId,
            },
            fromBlock: 'earliest' // In production, you'd optimize this
        });

        if (logs.length === 0) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 402 });
        }

        // 3. Payment Confirmed! Return the secret content.
        // In a real app, you might stream a file here. For MVP, we return the URL or redirect.

        // Option A: Redirect (User sees the URL)
        // return NextResponse.redirect(link.target_url);

        // Option B: JSON Reveal (User sees the URL in UI)
        return NextResponse.json({
            unlocked: true,
            content: link.target_url,
            message: "Payment verified. Access granted."
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
