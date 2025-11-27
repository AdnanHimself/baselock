export default function HowItWorksPage() {
    return (
        <main className="min-h-screen bg-neutral-950 text-white p-8">
            <div className="max-w-2xl mx-auto space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold">How BaseLock Works</h1>
                    <p className="text-xl text-neutral-400">Monetize your digital content in 3 simple steps.</p>
                </div>

                <div className="grid gap-6">
                    <div className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-110 transition-transform">1</div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">Create a Lock</h3>
                            <p className="text-neutral-400">Paste a link to your secret content (Dropbox, Google Drive, etc.) and set a price in USDC.</p>
                        </div>
                    </div>

                    <div className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-110 transition-transform">2</div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">Share the Link</h3>
                            <p className="text-neutral-400">Send the generated BaseLock link to your audience via Twitter, Discord, or Email.</p>
                        </div>
                    </div>

                    <div className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-110 transition-transform">3</div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">Get Paid</h3>
                            <p className="text-neutral-400">Users pay USDC to unlock the link. The funds (minus 1% fee) are sent directly to your wallet.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
