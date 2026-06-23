import type { Metadata } from 'next';

import { faqs } from '@/data';

export const metadata: Metadata = {
  title: 'FAQ',
};

export default function FAQPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
        Frequently asked questions
      </h1>
      <div className="mt-8 flex flex-col gap-4">
        {faqs.map((item) => (
          <div key={item.q} className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium text-foreground">{item.q}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
