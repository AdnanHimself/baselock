import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background py-8 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-6">
                    <Link href="/" className="hover:text-primary transition-colors">Create Link</Link>
                    <Link href="/my-links" className="hover:text-primary transition-colors">My Links</Link>
                    <Link href="/how-it-works" className="hover:text-primary transition-colors">FAQ</Link>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter</a>
                </div>
                <span>Built on Base 🔵</span>
            </div>
        </footer>
    );
}
