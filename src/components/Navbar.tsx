'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { twMerge } from 'tailwind-merge';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAccount } from 'wagmi';

export function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isConnected } = useAccount();

    useEffect(() => {
        setMounted(true);
    }, []);

    const tabs = [
        { name: 'Create Link', href: '/' },
        { name: 'My Links', href: '/my-links' },
        { name: 'How it works', href: '/how-it-works' },
        { name: 'Feedback', href: '/feedback' },
    ];

    return (
        <nav className="w-full border-b border-border bg-background transition-colors duration-300">
            <div className="px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                        BaseLock
                    </Link>

                    <div className={`hidden md:flex items-center gap-1 overflow-hidden transition-all duration-500 ease-in-out ${isConnected ? 'max-w-[500px] opacity-100' : 'max-w-0 opacity-0'}`}>
                        {tabs.map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={twMerge(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                                    pathname === tab.href
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                            >
                                {tab.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}
                    <ConnectButton showBalance={false} />
                </div>
            </div>
        </nav>
    );
}
