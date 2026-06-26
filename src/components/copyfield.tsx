import { useState } from 'react';

import { Check, Copy } from 'lucide-react';

import { type CopyFieldProps } from '@/types';

export function CopyField({ label, value, icon: Icon }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;

    await navigator.clipboard.writeText(value);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div className="space-y-2 mb-2">
      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {label}
      </label>

      <div className="flex h-10 items-center gap-2 rounded-lg border bg-muted/80 px-3">
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        <input
          value={value}
          readOnly
          className="h-8 w-0 min-w-0 flex-1 bg-transparent text-left font-mono text-xs text-foreground outline-none"
        />

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-muted"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
