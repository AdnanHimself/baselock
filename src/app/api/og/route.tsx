import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Dynamic params
        const title = searchParams.get('title')?.slice(0, 100) || 'Unlock Content';
        const price = searchParams.get('price') || '0';
        const type = searchParams.get('type') || 'Content'; // 'Link', 'File', etc.

        // Load logo (optional, using text for reliability first, or fetch absolute URL if deployed)
        // For now, we'll use a clean typographic design with the brand colors.

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#000000', // Dark background
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        color: 'white',
                        fontFamily: 'sans-serif',
                        padding: '40px',
                        position: 'relative',
                    }}
                >
                    {/* Decorative Elements */}
                    <div style={{
                        position: 'absolute',
                        top: '-100px',
                        left: '-100px',
                        width: '300px',
                        height: '300px',
                        background: '#1652F0', // Base Blue
                        filter: 'blur(100px)',
                        opacity: 0.4,
                        borderRadius: '50%',
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-100px',
                        right: '-100px',
                        width: '300px',
                        height: '300px',
                        background: '#F59E0B', // Amber
                        filter: 'blur(100px)',
                        opacity: 0.3,
                        borderRadius: '50%',
                    }} />

                    {/* Card Content */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        zIndex: 10,
                        border: '2px solid rgba(255,255,255,0.1)',
                        borderRadius: '30px',
                        padding: '40px 60px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        maxWidth: '90%',
                    }}>
                        {/* Lock Icon / Brand */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '20px',
                            fontSize: '24px',
                            fontWeight: 600,
                            color: '#1652F0',
                        }}>
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            JustUnlock
                        </div>

                        {/* Title */}
                        <div style={{
                            fontSize: '60px',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: '20px',
                            background: 'linear-gradient(to bottom right, #fff, #ccc)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        }}>
                            {title}
                        </div>

                        {/* Price Tag */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#1652F0',
                            color: 'white',
                            padding: '10px 30px',
                            borderRadius: '50px',
                            fontSize: '32px',
                            fontWeight: 700,
                            marginTop: '10px',
                            boxShadow: '0 4px 20px rgba(22, 82, 240, 0.4)',
                        }}>
                            Unlock for {price} USDC
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
