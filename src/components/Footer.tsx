import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background py-12 mt-auto transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">JustUnlock</h3>
                        <p className="text-sm text-muted-foreground">
                            The fastest way to monetize any link on Base.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
                            <li><Link href="/feedback" className="hover:text-primary transition-colors">Feedback</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Use Cases</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/use-cases/monetize-telegram-trading-signals" className="hover:text-primary transition-colors">Telegram Signals</Link></li>
                            <li><Link href="/use-cases/sell-notion-templates-on-notion" className="hover:text-primary transition-colors">Notion Templates</Link></li>
                            <li><Link href="/use-cases/monetize-discord-alpha-group" className="hover:text-primary transition-colors">Discord Alpha</Link></li>
                            <li><Link href="/use-cases/sell-source-code-on-github" className="hover:text-primary transition-colors">Sell Code</Link></li>
                            <li><Link href="/use-cases" className="hover:text-primary transition-colors font-medium text-primary">View All Use Cases &rarr;</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} JustUnlock. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                            Built on Base 🔵
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
