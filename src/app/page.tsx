'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';
import { Loader2, Lock, Link as LinkIcon, Copy, Check, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { showToast } = useToast();
  const [targetUrl, setTargetUrl] = useState('');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;

    setLoading(true);
    const slug = generateSlug();

    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          target_url: targetUrl,
          price: parseFloat(price),
          receiver_address: address,
          title: title
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create link');

      setCreatedLink(`${window.location.origin}/${slug}`);
      showToast('Link created successfully!', 'success');
    } catch (err) {
      console.error('Error creating link:', err);
      showToast('Failed to create link. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-black text-white selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl relative z-10 space-y-16 py-12">

        {/* Hero Section */}
        {!isConnected && !createdLink && (
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-50 rounded-full" />
              <div className="relative p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                <Lock className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  BaseLock
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
                The premium way to monetize content on Base.
                <br className="hidden md:block" />
                <span className="text-white font-medium">Secure. Decentralized. Instant.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8">
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-yellow-400" />}
                title="Instant Payments"
                description="Receive USDC or ETH directly to your wallet."
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6 text-green-400" />}
                title="Secure Access"
                description="Content is encrypted and only revealed after payment."
              />
              <FeatureCard
                icon={<Globe className="w-6 h-6 text-blue-400" />}
                title="Global Reach"
                description="Share your link anywhere. Anyone can pay."
              />
            </div>
          </div>
        )}

        {/* Main Interaction Area */}
        <div className="w-full max-w-md mx-auto">
          {!isConnected ? (
            <div className="text-center animate-in fade-in zoom-in duration-500 delay-300">
              <div className="p-[1px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <div className="bg-black/90 backdrop-blur-xl rounded-2xl p-8">
                  <p className="text-gray-300 mb-6">Connect your wallet to start creating locks.</p>
                  {/* ConnectButton is handled by Navbar usually, but if we want a big button here: */}
                  <div className="flex justify-center">
                    {/* We rely on the navbar connect button usually, but let's add a hint arrow or similar if needed. 
                            For now, just text. */}
                  </div>
                </div>
              </div>
            </div>
          ) : createdLink ? (
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white">Link Created!</h3>
                <p className="text-gray-400">Your content is now locked and ready to share.</p>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 group hover:border-white/20 transition-colors">
                <LinkIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                <input
                  readOnly
                  value={createdLink}
                  className="bg-transparent flex-1 text-sm outline-none text-white font-mono"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>

              <Button
                variant="secondary"
                className="w-full py-6 text-lg bg-white text-black hover:bg-gray-200 border-none"
                onClick={() => {
                  setCreatedLink(null);
                  setTargetUrl('');
                  setPrice('');
                  setTitle('');
                }}
              >
                Create Another Lock
              </Button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Create a Lock
                </h2>
                <p className="text-gray-400 mt-2">Set a price for your digital content.</p>
              </div>

              <form onSubmit={handleCreate} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Target URL</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Exclusive Market Report 2024"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Price (USDC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="5.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600 text-white font-mono text-lg"
                      required
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                  </div>
                  <p className="text-xs text-gray-500 text-right">Min 1 USDC • 1% Fee</p>
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={loading}
                  className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-none shadow-lg shadow-purple-900/20"
                >
                  Create Locked Link
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Use Cases Section */}
        {!isConnected && !createdLink && (
          <div className="space-y-12 pt-12 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-200">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white">What can you lock?</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                BaseLock is perfect for creators, developers, and communities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
              <UseCaseCard
                icon="🎓"
                title="Courses"
                description="Sell access to tutorials, video guides, and educational content."
              />
              <UseCaseCard
                icon="🎨"
                title="Digital Art"
                description="Monetize presets, templates, e-books, and design assets."
              />
              <UseCaseCard
                icon="💬"
                title="Community"
                description="Paid invite links for Discord, Telegram, or Slack communities."
              />
              <UseCaseCard
                icon="🔑"
                title="Access Keys"
                description="Sell software licenses, API keys, or passwords securely."
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left">
      <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function UseCaseCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="group p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
