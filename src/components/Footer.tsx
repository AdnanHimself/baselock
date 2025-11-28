export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background py-8 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-6">
                    <a href="/" className="hover:text-foreground transition-colors">Create Link</a>
                    <a href="/my-links" className="hover:text-foreground transition-colors">My Links</a>
                    <a href="/how-it-works" className="hover:text-foreground transition-colors">FAQ</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
                </div>
                <span>Built on Base 🔵</span>
            </div>
        </footer>
    );
}
