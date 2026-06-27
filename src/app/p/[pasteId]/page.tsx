'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { Check, Copy } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';
import { decryptPasteContent } from '@/lib/decryption';
import type { ModeType } from '@/types';

interface PasteResponse {
  ciphertext: string;
}

export default function PastePage() {
  const params = useParams<{ pasteId: string }>();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [mode, setMode] = useState<ModeType | null>(null);

  useEffect(() => {
    async function loadPaste() {
      try {
        const fragment = window.location.hash.slice(1);
        const [keyText, burnKey] = fragment.split('.');
        setHasKey(Boolean(fragment));

        if (!keyText) {
          throw new Error('Missing decryption key');
        }

        const pasteUrl = burnKey
          ? `/api/pastes/${params.pasteId}?burnKey=${encodeURIComponent(burnKey)}`
          : `/api/pastes/${params.pasteId}`;
        const response = await fetch(pasteUrl);

        if (!response.ok) {
          throw new Error('Paste not found');
        }

        const paste = (await response.json()) as PasteResponse;

        const decrypted = await decryptPasteContent({
          ciphertext: paste.ciphertext,
          key: keyText,
        });

        setContent(decrypted.content);
        setMode(decrypted.mode);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to open paste');
      } finally {
        setIsLoading(false);
      }
    }

    loadPaste();
  }, [params.pasteId]);

  const displayText = error || (isLoading ? 'decrypting...' : content);
  const charCount = content.length;
  const lineCount = content ? content.split('\n').length : 0;
  const canCopy = Boolean(content) && !error && !isLoading;

  async function handleCopy() {
    if (!canCopy) return;

    await navigator.clipboard.writeText(content);
    setIsCopied(true);

    window.setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  }

  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">
      <div className="relative">
        <div className="flex items-center justify-between rounded-t-lg border border-border bg-muted px-4 py-2">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="flex gap-1.5">
              <span className="size-3 rounded-full bg-destructive/60" />
              <span className="size-3 rounded-full bg-yellow-500/60" />
              <span className="size-3 rounded-full bg-green-500/60" />
            </span>
            <span className="ml-2 text-foreground">nobins://p/{params.pasteId}</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">nobins</span>
        </div>

        <div className="relative h-[calc(100vh-180px)] min-h-75 border-x border-border bg-(--editor-background)">
          <pre className="h-full overflow-auto p-4 font-mono text-sm whitespace-pre-wrap text-(--editor-foreground)">
            {displayText}
          </pre>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <ThemeToggle className="bg-background/90 shadow-sm" />
          </div>
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!canCopy}
              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background/90 text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
              aria-label="Copy paste content"
              title="Copy paste content"
            >
              {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-b-lg border border-border bg-foreground/10 px-4 py-1.5">
          <div className="flex items-center gap-4 font-mono text-xs text-primary-background">
            <span className="font-bold">
              {error ? 'ERROR' : isLoading ? 'LOADING' : 'READONLY'}
            </span>
            <span>{hasKey ? 'key-present' : 'no-key'}</span>
            {mode && <span>{mode}</span>}
          </div>
          <div className="flex items-center gap-4 font-mono text-xs text-primary-background">
            <span>{charCount}B</span>
            <span>{lineCount}L</span>
            <span>plaintext</span>
            <span>utf-8</span>
          </div>
        </div>
      </div>
    </div>
  );
}
