import { Metadata } from 'next';
import Link from 'next/link';
import { platforms, contentTypes, generateSeoCombinations, Category } from '@/lib/seo-data';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Search, Zap, ShieldCheck, Lock } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Use Cases - JustUnlock',
    description: 'Explore hundreds of ways to monetize your content with JustUnlock. Sell files, links, and access on any platform with crypto.',
};

export default function UseCasesHub() {
    const combinations = generateSeoCombinations();

    // Group platforms by category
    const categories: { id: Category; name: string; platforms: typeof platforms }[] = [
        { id: 'messaging', name: 'Messaging Apps', platforms: platforms.filter(p => p.categories.includes('messaging')) },
        { id: 'productivity', name: 'Productivity Tools', platforms: platforms.filter(p => p.categories.includes('productivity')) },
        { id: 'cloud', name: 'Cloud Storage', platforms: platforms.filter(p => p.categories.includes('cloud')) },
        { id: 'video', name: 'Video Platforms', platforms: platforms.filter(p => p.categories.includes('video')) },
        { id: 'code', name: 'Code Repositories', platforms: platforms.filter(p => p.categories.includes('code')) },
        { id: 'design', name: 'Design Tools', platforms: platforms.filter(p => p.categories.includes('design')) },
        { id: 'meeting', name: 'Meeting Apps', platforms: platforms.filter(p => p.categories.includes('meeting')) },
        { id: 'music', name: 'Music Platforms', platforms: platforms.filter(p => p.categories.includes('music')) },
        { id: 'education', name: 'Course Platforms', platforms: platforms.filter(p => p.categories.includes('education')) },
    ];

    // Helper to get top 3 use cases for a platform
    const getTopUseCases = (platformId: string) => {
        return combinations
            .filter(c => c.platform.id === platformId)
            .slice(0, 3);
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                            Explore <span className="text-primary">Use Cases</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            Discover how creators, developers, and consultants use JustUnlock to monetize their work on any platform.
                        </p>

                        {/* Search Placeholder (Visual only for now) */}
                        <div className="max-w-md mx-auto relative mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                placeholder="Find your platform (e.g. Notion, Telegram)..."
                                className="w-full pl-10 pr-4 py-3 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 space-y-20">
                    {categories.map((category) => (
                        <div key={category.id} className="space-y-8">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl md:text-3xl font-bold capitalize">{category.name}</h2>
                                <div className="h-px flex-1 bg-border/50" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.platforms.map((platform) => {
                                    const topLinks = getTopUseCases(platform.id);
                                    if (topLinks.length === 0) return null;

                                    return (
                                        <div key={platform.id} className="group bg-secondary/20 hover:bg-secondary/40 border border-border/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold">{platform.name}</h3>
                                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                                            </div>
                                            <ul className="space-y-2">
                                                {topLinks.map((link) => (
                                                    <li key={link.slug}>
                                                        <Link
                                                            href={`/use-cases/${link.slug}`}
                                                            className="text-sm text-muted-foreground hover:text-primary transition-colors block truncate"
                                                        >
                                                            {link.title.replace(` on ${platform.name} with Crypto`, '').replace(`Monetize ${platform.name} `, '')}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-4 pt-4 border-t border-border/30">
                                                <Link
                                                    href={`/use-cases/sell-content-on-${platform.id}`} // Fallback generic link if specific ones fail, or just pick first one
                                                    className="text-xs font-medium text-primary flex items-center gap-1"
                                                >
                                                    View all {platform.name} guides
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-secondary/20">
                <div className="container mx-auto px-4 text-center space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold">Don&apos;t see your platform?</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        JustUnlock works with ANY link or file. You don&apos;t need a specific integration.
                    </p>
                    <Link href="/">
                        <Button size="lg" className="h-16 px-10 text-xl rounded-full gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                            Create Link Now <ArrowRight className="w-6 h-6" />
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
