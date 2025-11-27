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
    <main className="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center p-4 bg-background text-foreground transition-colors">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">BaseLock</h1>
          <p className="text-muted-foreground">Monetize your links on Base L2.</p>
        </div>

        {!isConnected ? (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        ) : createdLink ? (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-semibold text-green-500">Link Created!</h3>
              <p className="text-sm text-muted-foreground">Share this link to start earning.</p>
            </div>

            <div className="flex items-center gap-2 bg-secondary/50 p-3 rounded-xl border border-border">
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
              <input
                readOnly
                value={createdLink}
                className="bg-transparent flex-1 text-sm outline-none text-foreground"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
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
          <form onSubmit={handleCreate} className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-input/10 border border-input rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground text-foreground"
                required
              />
              <p className="text-xs text-muted-foreground">The secret content users pay to see.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                placeholder="e.g. Exclusive Report"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-input/10 border border-input rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price (USDC)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-input/10 border border-input rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground text-foreground"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              </div>
              <p className="text-xs text-muted-foreground">Minimum 0.1 USDC. 1% platform fee applies.</p>
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
