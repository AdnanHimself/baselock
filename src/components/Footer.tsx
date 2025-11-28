import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background py-8 mt-auto transition-colors duration-300">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} BaseLock. All rights reserved.
                </div>
                <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                        How it Works
                    </Link>
                    <Link href="/feedback" className="hover:text-foreground transition-colors">
                        Feedback
                    </Link>
                    <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                        Built on Base
                    </a>
                </div>
            </div>
        </footer>
    );
}
