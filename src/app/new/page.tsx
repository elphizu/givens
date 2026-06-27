'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';

import { ShareDialog } from '@/components/share-dialog';
import { expirations, modes } from '@/data';
import { encryptPasteContent } from '@/lib/encryption';

import { ThemeToggle } from '@/components/theme-toggle';

import { type ModeType, type ExpirationValue } from '@/types';
import {
  bracketMatching,
  indentOnInput,
  foldGutter,
  foldKeymap,
  type LanguageSupport,
} from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { search, searchKeymap } from '@codemirror/search';

import { catppuccinMocha } from '@catppuccin/codemirror';

const langExtensions = {
  javascript,
  html,
  json,
  markdown,
  python,
} as const satisfies Record<string, () => LanguageSupport>;

interface LanguageItem {
  label: string;
  value: LanguageSupport | null;
}

export default function NewPastePage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const [extLang, setExtLang] = useState<LanguageItem | null>(null);
  const [mode, setMode] = useState<ModeType>('open');
  const [ttl, setTtl] = useState<ExpirationValue | null>(3600);
  const [burn, setBurn] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [encrypting, setEncrypting] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [deleteUrl, setDeleteUrl] = useState('');

  const languages: LanguageItem[] = useMemo(
    () => [
      { label: 'plaintext', value: null },
      ...Object.entries(langExtensions).map(([label, createExtension]) => ({
        label,
        value: createExtension(),
      })),
    ],
    [],
  );

  const updateStats = useCallback((view: EditorView) => {
    const text = view.state.doc.toString();
    setCharCount(text.length);
    setLineCount(view.state.doc.lines);
  }, []);

  const handleEncrypt = async () => {
    if (!viewRef.current) return;

    const text = viewRef.current.state.doc.toString();

    if (!text.trim()) return;

    setEncrypting(true);

    try {
      const encrypted = await encryptPasteContent({
        content: text,
        mode,
      });
      const expiresAt =
        ttl === 0
          ? new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + (ttl ?? 3600) * 1000);

      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ciphertext: encrypted.ciphertext,
          expiresAt: expiresAt.toISOString(),
          burnAfterReading: burn,
        }),
      });

      if (!res.ok) throw new Error('Failed to create paste');

      const { pasteId, burnToken, burnKey } = (await res.json()) as {
        pasteId: string;
        burnToken: string;
        burnKey: string | null;
      };
      const fragment = burnKey ? `${encrypted.key}.${burnKey}` : encrypted.key;
      const origin = window.location.origin;

      setShareUrl(`${origin}/p/${pasteId}#${fragment}`);
      setDeleteUrl(`${origin}/d/${pasteId}/${encodeURIComponent(burnToken)}`);
      setShowShare(true);
    } finally {
      setEncrypting(false);
    }
  };

  const handleClose = () => {
    setShowShare(false);
    setShareUrl('');
    setDeleteUrl('');
  };

  const buildExtensions = useCallback(
    (langKey: LanguageItem | null) => [
      lineNumbers(),
      EditorView.lineWrapping,
      foldGutter(),
      history(),
      bracketMatching(),
      indentOnInput(),
      highlightActiveLine(),
      search(),
      ...(langKey?.value ? [langKey.value] : []),
      catppuccinMocha,
      EditorView.theme({
        '&': {
          fontSize: '14px',
          height: '100%',
        },
        '.cm-content': {
          fontFamily: 'var(--font-mono)',
        },
        '.cm-editor': {
          height: '100%',
        },
        '.cm-scroller': {
          overflow: 'auto',
        },
      }),
      keymap.of([...defaultKeymap, ...searchKeymap, ...historyKeymap, ...foldKeymap]),
      EditorView.updateListener.of((u) => {
        if (u.docChanged) updateStats(u.view);
      }),
    ],
    [updateStats],
  );

  useEffect(() => {
    if (!editorRef.current) return;

    const prevDoc = viewRef.current?.state.doc.toString() ?? '';
    viewRef.current?.destroy();

    const state = EditorState.create({
      doc: prevDoc,
      extensions: buildExtensions(extLang),
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;
    updateStats(view);

    return () => {
      view.destroy();
      if (viewRef.current === view) {
        viewRef.current = null;
      }
    };
  }, [buildExtensions, extLang, updateStats]);

  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">
      <div className="absolute right-6 top-18 z-10">
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-between rounded-t-lg border border-border bg-muted px-4 py-2">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="flex gap-1.5">
            <span className="size-3 rounded-full bg-destructive/60" />
            <span className="size-3 rounded-full bg-yellow-500/60" />
            <span className="size-3 rounded-full bg-green-500/60" />
          </span>
          <span className="ml-2 text-foreground">nobins://new</span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">nobins</span>
      </div>

      <div className="h-[calc(100vh-220px)] min-h-75 border-x border-border bg-card">
        <div ref={editorRef} className="h-full" />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-x border-border bg-muted px-4 py-3">
        {/* Language */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">ft:</span>
          <select
            value={extLang?.label ?? ''}
            onChange={(e) =>
              setExtLang(languages.find((lang) => lang.label === e.target.value) || null)
            }
            className="rounded border border-border bg-background px-2 py-0.5 font-mono text-xs text-foreground outline-none"
          >
            {languages.map((lang) => (
              <option key={lang.label} value={lang.label}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">mode:</span>
          <div className="flex rounded border border-border">
            {modes.map((m) => (
              <button
                key={m.name}
                onClick={() => setMode(m.name as typeof mode)}
                className={`px-2 py-0.5 font-mono text-xs transition-colors ${
                  mode === m.name
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">expires:</span>
          <div className="flex rounded border border-border">
            {expirations.map((e) => (
              <button
                key={e.value}
                onClick={() => setTtl(e.value)}
                className={`px-2 py-0.5 font-mono text-xs transition-colors ${
                  ttl === e.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground">
          <input
            type="checkbox"
            checked={burn}
            onChange={(e) => setBurn(e.target.checked)}
            className="size-3 rounded border-border"
          />
          burn-after-read
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-b-lg border border-border bg-foreground/10 px-4 py-1.5">
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-primary-background">
          <span className="font-bold">NORMAL</span>
          <span>{mode}</span>
          <span>{burn ? 'burn' : 'no-burn'}</span>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-primary-background">
          <span>{charCount}B</span>
          <span>{lineCount}L</span>
          <span>{extLang?.label ?? 'plaintext'}</span>
          <span>utf-8</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleEncrypt}
          disabled={encrypting}
          className="rounded-lg bg-primary px-6 py-2 font-mono text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80 disabled:opacity-30"
        >
          {encrypting ? 'encrypting...' : ':w encrypt'}
        </button>
      </div>
      <ShareDialog
        open={showShare}
        onClose={handleClose}
        shareUrl={shareUrl}
        deleteUrl={deleteUrl}
      />
    </div>
  );
}
