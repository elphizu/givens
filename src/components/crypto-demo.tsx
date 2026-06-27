'use client';

import * as React from 'react';

const modes = {
  open: {
    label: 'open',
    algo: 'X25519 + HKDF-SHA-256 + XChaCha20-Poly1305',
    input:
      'Incident note\n\nRotated the staging Stripe webhook secret at 2026-06-27 09:30 UTC.\nOwner: platform-oncall\nNext step: remove the old value from Vercel after deploy.',
    ciphertext:
      'nHmAqFKLpYy-OYDOLmKtXkXimNm6J_3zFSEmaJeVOMO4alNftOkuaH_uQc3rmDSaogZUJ1zjuwxC4-b1LLq1ZourlCI3YLBnOgPUD8FODhwVS5McENacaQ',
    envelope: [{ label: 'X25519 public key', value: 'UTPLjkn3AztAWZ8q_T7-kP8O...' }],
    nonces: [{ label: 'content nonce', value: 'aIYNtoq_uPNwCaVLkDaKi3C3Wf8m5CwN' }],
    key: 'allQyNaoUBXeJUVf4dFybjExYHmQ66nBx1uUpqdaZc4Zwll9Vm95cBCiUROOj4K3...',
    keyMeta: '86 chars (88B decoded)',
    shareKey: 'allQyNaoUBXeJUVf4dFy...',
  },
  sealed: {
    label: 'sealed',
    algo: 'ML-KEM-1024 + X25519 + HKDF-SHA-256 + XChaCha20-Poly1305',
    input:
      'Recovery note\n\nStore the offline recovery phrase in the safe deposit envelope.\nDo not paste production credentials into demos.',
    ciphertext:
      '5GEkY3LmgDyVTp1xpGR9QSiiZFHkoqqoxu9NCcLqFIOp7Ej6_4M9WSWBjM4lQ6w5-Qhi5XQG1wEqgypYuRq-uWeah0-CRMtRol3BKAb71HZTlA6DQyvEyiVwNE_14kVGrRyVYfjYs_k',
    envelope: [
      { label: 'ML-KEM ciphertext', value: 'gRT7q3JuOeUjSznvNuzmr3pu...' },
      { label: 'X25519 public key', value: 'cBoKZFxwWnqw5vkRmZAps7LO...' },
    ],
    nonces: [{ label: 'content nonce', value: 'BJCgW1ShvoLncHPO6cmhc18DP1lMa8Uk' }],
    key: 'fuEsrZgvR5ulxelKPVaK44E9Y_NPiiEen5Geqwo_FmeGtotxrDS95ANGZakD3OY-...',
    keyMeta: '4310 chars (~4.3KB decoded)',
    shareKey: 'fuEsrZgvR5ulxelKPVaK...',
  },
} as const;

type ModeKey = keyof typeof modes;

export function CryptoDemo() {
  const [mode, setMode] = React.useState<ModeKey>('open');
  const data = modes[mode];

  return (
    <div className="relative mt-8 overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative flex items-center gap-2 border-b border-border bg-muted/80 px-4 py-2">
        <div className="flex rounded-md border border-border bg-background p-0.5">
          {(Object.keys(modes) as ModeKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                mode === key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {modes[key].label}
            </button>
          ))}
        </div>
        <span className="font-mono text-xs text-muted-foreground">{data.algo}</span>
      </div>

      <div className="relative flex flex-col gap-px bg-border">
        <div className="bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground">Input</label>
          <pre className="mt-2 overflow-x-auto rounded bg-muted/80 p-3 font-mono text-xs text-foreground">
            {data.input}
          </pre>
        </div>

        <div className="bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground">Ciphertext</label>
          <p className="mt-2 overflow-x-auto rounded bg-muted/80 p-3 break-all font-mono text-xs text-foreground">
            {data.ciphertext}
          </p>
        </div>

        <div
          className={`grid gap-px bg-border ${data.envelope.length > 1 ? 'sm:grid-cols-2' : ''}`}
        >
          {data.envelope.map((item) => (
            <div key={item.label} className="bg-card p-4">
              <label className="text-xs font-medium text-muted-foreground">
                Envelope ({item.label})
              </label>
              <p className="mt-2 overflow-x-auto rounded bg-muted/80 p-3 break-all font-mono text-xs text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className={`grid gap-px bg-border ${data.nonces.length > 1 ? 'sm:grid-cols-2' : ''}`}>
          {data.nonces.map((n) => (
            <div key={n.label} className="bg-card p-4">
              <label className="text-xs font-medium text-muted-foreground">{n.label}</label>
              <p className="mt-2 overflow-x-auto rounded bg-muted/80 p-3 break-all font-mono text-xs text-foreground">
                {n.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground">Decryption key</label>
          <p className="mt-2 overflow-x-auto rounded bg-muted/80 p-3 break-all font-mono text-xs text-foreground">
            {data.key}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{data.keyMeta}</p>
        </div>

        <div className="bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground">Share URL</label>
          <p className="mt-2 overflow-x-auto rounded bg-muted/80 p-3 break-all font-mono text-xs text-foreground">
            nobins.com/p/demo<span className="text-primary">#{data.shareKey}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
