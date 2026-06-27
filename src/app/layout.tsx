import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import './globals.css';

import { env } from '@/env';

const Iosevka = localFont({
  src: [
    { path: './iosevka-regular.woff2', weight: '400', style: 'normal' },
    { path: './iosevka-bold.woff2', weight: '700', style: 'normal' },
    { path: './iosevka-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-iosevka',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: 'Nobins',
    template: '%s — Nobins',
  },
  description: 'A zero-knowledge pastebin with end-to-end encryption',
  alternates: {
    canonical: '/',
  },
  keywords: ['pastebin', 'encrypted', 'e2e', 'zero-knowledge', 'nobins'],
  authors: [{ name: 'Nobins' }],
  creator: 'Nobins',
  publisher: 'Nobins',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Nobins',
    title: 'Nobins',
    description: 'A zero-knowledge pastebin with end-to-end encryption',
    url: '/',
  },
  twitter: {
    card: 'summary',
    title: 'Nobins',
    description: 'A zero-knowledge pastebin with end-to-end encryption',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${Iosevka.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </NextThemesProvider>
      </body>
    </html>
  );
}
