import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';
import { deletePaste } from '@/pastes/paste.service';

interface DeletePastePageProps {
  params: Promise<{
    pasteId: string;
    burnToken: string;
  }>;
}

export default async function DeletePastePage({ params }: DeletePastePageProps) {
  const { pasteId, burnToken } = await params;
  const deleted = await deletePaste(pasteId, burnToken);
  const status = deleted ? 'DELETED' : 'NOT FOUND';
  const message = deleted
    ? 'Paste deleted. The ciphertext is no longer available.'
    : 'Paste not found or already deleted.';

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
            <span className="ml-2 text-foreground">nobins://d/{pasteId}</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">nobins</span>
        </div>

        <div className="relative flex h-[calc(100vh-180px)] min-h-75 flex-col justify-between border-x border-border bg-(--editor-background) p-4 font-mono text-sm text-(--editor-foreground)">
          <ThemeToggle className="absolute top-3 right-3 bg-background/90 shadow-sm" />
          <div className="space-y-3">
            <p className="text-(--editor-muted)">$ nobins delete paste {pasteId}</p>
            <p>{message}</p>
          </div>
          <Link
            href="/new"
            className="self-end rounded-md border border-border bg-foreground/90 px-3 py-2 text-xs text-background shadow-sm transition-colors hover:bg-muted hover:text-foreground"
          >
            new paste
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-b-lg border border-border bg-foreground/10 px-4 py-1.5">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-primary-background">
            <span className="font-bold">{status}</span>
            <span>delete</span>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-primary-background">
            <span>ciphertext</span>
            <span>{deleted ? 'removed' : 'missing'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
