import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { CryptoDemo } from '@/components/crypto-demo';

import { features } from '@/data';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-6 overflow-hidden px-4 py-24 text-center">
        <div
          className="pointer-events-none absolute inset-0 -z-10
      bg-[linear-gradient(color-mix(in_srgb,var(--foreground)_12%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--foreground)_12%,transparent)_1px,transparent_1px)]
      bg-size-[28px_28px]
      mask-[linear-gradient(to_bottom,black,transparent)]
      [webkit-mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Zero-knowledge pastebin
        </h1>

        <p className="max-w-2xl text-lg text-muted-foreground">
          Share encrypted text with end-to-end encryption. The server never sees your content or
          your decryption key.
        </p>

        <div className="flex gap-3">
          <Link href="/new">
            <Button size="lg">Create paste</Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg">
              How it works
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-24">
        <h2 className="text-center font-heading text-2xl font-semibold text-foreground">
          See it in action
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          A realistic look at what Nobins stores and what stays in the share link
        </p>

        <CryptoDemo />
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-6 text-card-foreground"
            >
              <h3 className="font-heading font-medium text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
