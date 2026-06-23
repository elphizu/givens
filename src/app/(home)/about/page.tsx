import type { Metadata } from 'next';

import { modes, steps } from '@/data';

export const metadata: Metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
        How Nobins works
      </h1>
      <p className="mt-4 text-muted-foreground">
        Nobins is a zero-knowledge pastebin. Encryption and decryption happen entirely in your
        browser. The server only stores ciphertext — it can never read your content.
      </p>

      <h2 className="mt-12 font-heading text-xl font-medium text-foreground">The flow</h2>
      <div className="mt-6 flex flex-col gap-4">
        {steps.map((s) => (
          <div key={s.step} className="flex gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {s.step}
            </div>
            <div>
              <h3 className="font-medium text-foreground">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-heading text-xl font-medium text-foreground">Security modes</h2>
      <div className="mt-6 flex flex-col gap-4">
        {modes.map((m) => (
          <div key={m.name} className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium text-foreground">{m.name}</h3>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{m.crypto}</p>
            <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-heading text-xl font-medium text-foreground">Threat model</h2>
      <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
        <li>Server compromise: attacker gets ciphertext only, no keys.</li>
        <li>Network interception: TLS + client-side encryption, double protection.</li>
        <li>Quantum attacks: optional ML-KEM-1024 layer resists Shor&apos;s algorithm.</li>
        <li>
          Link sharing: anyone with the link can decrypt. Use burn-after-read for one-time access.
        </li>
      </ul>
    </div>
  );
}
