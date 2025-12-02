import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '@/lib/supabase';
import UnlockClient from './UnlockClient';

type Props = {
    params: Promise<{ shortId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { shortId } = await params;

    // Fetch data from Supabase
    const { data: link } = await supabase
        .from('links')
        .select('title, price')
        .eq('id', shortId)
        .single();

    if (!link) {
        return {
            title: 'Link Not Found',
        };
    }

    const ogUrl = new URL('https://justunlock.link/api/og');
    ogUrl.searchParams.set('title', link.title);
    ogUrl.searchParams.set('price', link.price);

    return {
        title: `${link.title} | JustUnlock`,
        description: `Unlock this content for ${link.price} USDC on Base. Powered by JustUnlock.`,
        openGraph: {
            title: link.title,
            description: `Unlock this content for ${link.price} USDC on Base. Powered by JustUnlock.`,
            images: [
                {
                    url: ogUrl.toString(),
                    width: 1200,
                    height: 630,
                    alt: link.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: link.title,
            description: `Unlock this content for ${link.price} USDC on Base.`,
            images: [ogUrl.toString()],
        },
    };
}

export default function Page() {
    return <UnlockClient />;
}
