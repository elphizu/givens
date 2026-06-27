'use client';

import { LinkIcon, Trash2 } from 'lucide-react';

import { CopyField } from '@/components/copyfield';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface ShareDialogProps {
  open: boolean;
  onClose?: () => void;
  shareUrl: string;
  deleteUrl: string;
}

const patternDots = Array.from({ length: 520 }, (_, i) => {
  const cols = 40;
  const col = i % cols;
  const row = Math.floor(i / cols);
  const hash = (row * 17 + col * 29 + row * col * 11) % 100;

  if (hash > 54) return null;

  return {
    id: i,
    left: `${(col / (cols - 1)) * 100}%`,
    top: `${row * 8}px`,
    opacity: 0.05 + (hash % 9) * 0.025,
  };
}).filter((dot): dot is { id: number; left: string; top: string; opacity: number } => Boolean(dot));

const cowSayLines = [
  ' ___________________',
  '< Copy link, human! >',
  ' -------------------',
  '        \\   ^__^',
  '         \\  (oo)\\_______',
  '            (__)\\       )\\/\\',
  '                ||----w |',
  '                ||     ||',
];

export function ShareDialog({ open, onClose, shareUrl, deleteUrl }: ShareDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose?.();
      }}
    >
      <DialogContent
        overlayClassName="bg-black/60 backdrop-blur-sm"
        className="w-full max-w-[calc(100%-1.5rem)] gap-0 overflow-visible border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-md"
      >
        <DialogTitle className="sr-only">Share Dialog</DialogTitle>

        <div className="w-full rounded-2xl border-2 border-foreground/20 bg-background p-1">
          <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-card p-6 shadow-xl">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
              style={{
                maskImage:
                  'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.65) 60%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.65) 60%, transparent 100%)',
              }}
            >
              {patternDots.map((dot) => (
                <div
                  key={dot.id}
                  className="absolute size-1.25 rounded-[1.5px] bg-foreground"
                  style={{
                    left: dot.left,
                    top: dot.top,
                    opacity: dot.opacity,
                  }}
                />
              ))}
            </div>

            <div className="relative mb-4 flex items-center justify-between">
              <DialogTitle className="font-heading text-lg font-medium text-foreground">
                Share paste
              </DialogTitle>
            </div>

            <div className="relative flex justify-center rounded-lg bg-background p-5">
              <svg className="absolute inset-0 size-full text-border" preserveAspectRatio="none">
                <rect
                  width="100%"
                  height="100%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="6 14"
                  strokeDashoffset="0"
                  strokeLinecap="square"
                  rx="8"
                  ry="8"
                />
              </svg>

              <div className="relative">
                <pre className="relative z-10 flex h-56 w-56 items-center justify-center overflow-hidden p-3 text-[13px] leading-tight text-foreground">
                  {cowSayLines.join('\n')}
                </pre>
              </div>
            </div>

            <p className="relative my-5 px-2 text-center text-xs text-muted-foreground">
              The cow has spoken. Copy the share link below.
            </p>

            <CopyField label="Share URL" value={shareUrl} icon={LinkIcon} />

            <CopyField
              label="Delete URL (save this — shown once)"
              value={deleteUrl}
              icon={Trash2}
            />

            <p className="relative mt-4 text-center text-xs text-muted-foreground">
              The decryption key is in the share URL fragment (#). The server never sees it.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
