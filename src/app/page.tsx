'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';
import { Loader2, Lock, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

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
      const { error } = await supabase
        .from('links')
        .insert({
          id: slug,
          target_url: targetUrl,
          price: parseFloat(price),
          receiver_address: address,
          title: title || 'Unlock Content',
          token_address: '0x0000000000000000000000000000000000000000', // ETH for now
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

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
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">BaseLock</h1>
          <p className="text-neutral-400">Monetize your links on Base L2.</p>
        </div>

        {!isConnected ? (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        ) : createdLink ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-semibold text-green-400">Link Created!</h3>
              <p className="text-sm text-neutral-400">Share this link to start earning.</p>
            </div>

            <div className="flex items-center gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <LinkIcon className="w-4 h-4 text-neutral-500" />
              <input
                readOnly
                value={createdLink}
                className="bg-transparent flex-1 text-sm outline-none text-neutral-300"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-neutral-400" />}
              </button>
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                setCreatedLink(null);
                setTargetUrl('');
                setPrice('');
                setTitle('');
              }}
            >
              Create Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Target URL</label>
              <input
                type="url"
                required
                placeholder="https://dropbox.com/..."
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
              <p className="text-xs text-neutral-500">The secret content users pay to see.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Title (Public)</label>
              <input
                type="text"
                required
                placeholder="Exclusive 4K Wallpaper Pack"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Price (ETH)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.000001"
                  required
                  placeholder="0.001"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
                <span className="absolute right-4 top-3.5 text-sm text-neutral-500 font-medium">ETH</span>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              disabled={loading}
            >
              Create Locked Link
            </Button>
          </form>
        )}

        <div className="flex justify-center">
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </main>
  );
}
