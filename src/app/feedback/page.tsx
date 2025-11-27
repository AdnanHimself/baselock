export default function FeedbackPage() {
    return (
        <main className="min-h-screen bg-neutral-950 text-white p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Feedback</h1>
                <p className="text-neutral-400">We would love to hear your thoughts! Please reach out to us on Twitter or via Email.</p>

                <div className="grid gap-4">
                    <a href="https://twitter.com" target="_blank" className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-white/10 transition-all group">
                        <h3 className="font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">Twitter / X</h3>
                        <p className="text-sm text-neutral-400">Follow us for updates and DM us your feedback.</p>
                    </a>

                    <a href="mailto:support@baselock.xyz" className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-white/10 transition-all group">
                        <h3 className="font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">Email</h3>
                        <p className="text-sm text-neutral-400">Send us a detailed message about bugs or feature requests.</p>
                    </a>
                </div>
            </div>
        </main>
    );
}
