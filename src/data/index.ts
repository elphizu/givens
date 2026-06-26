import { GithubIcon, TwitterIcon } from '@/components/icons/social';

import type {
  ExpirationItem,
  FaqItem,
  FeatureItem,
  ModeItem,
  NavItem,
  SocialLinkItem,
  StepItem,
} from '@/types';

export const modes: ModeItem[] = [
  {
    name: 'classical',
    crypto: 'X25519 key exchange + XChaCha20-Poly1305',
    desc: 'Fast, proven, and widely adopted. Suitable for everyday use against conventional threats.',
  },
  {
    name: 'quantum',
    crypto: 'ML-KEM-1024 + X25519 + XChaCha20-Poly1305',
    desc: 'Adds a post-quantum layer using ML-KEM-1024. Double encryption hedges against future quantum attacks.',
  },
];

export const features: FeatureItem[] = [
  {
    title: 'Client-side encryption',
    desc: 'Content is encrypted in your browser before it ever touches the server. The server stores only ciphertext.',
  },
  {
    title: 'Key in the URL fragment',
    desc: 'The decryption key lives in the URL fragment (#), which is never sent to the server. No key, no access.',
  },
  {
    title: 'Two security modes',
    desc: 'Classical mode uses X25519 + XChaCha20-Poly1305. Quantum-resistant mode adds ML-KEM-1024 for double encryption.',
  },
  {
    title: 'Auto-expiration & burn-after-read',
    desc: 'Set a TTL or self-destruct on read. Pastes vanish automatically — no traces left behind.',
  },
  {
    title: 'No account required',
    desc: 'Create and share pastes instantly. No email, no signup, no tracking.',
  },
  {
    title: 'Zero-knowledge by design',
    desc: 'The server cannot read your pastes. It only stores encrypted blobs and serves them back on request.',
  },
];

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
];

export const socialLinks: SocialLinkItem[] = [
  { label: 'GitHub', href: 'https://github.com/elphizu/nobins', icon: GithubIcon },
  { label: 'Twitter', href: 'https://twitter.com/elphizu', icon: TwitterIcon },
];

export const expirations: ExpirationItem[] = [
  { label: '5m', value: 300 },
  { label: '1h', value: 3600 },
  { label: '1d', value: 86400 },
  { label: '7d', value: 604800 },
  { label: '30d', value: 2592000 },
  { label: 'never', value: 0 },
];

export const steps: StepItem[] = [
  {
    step: 1,
    title: 'You write or paste content',
    desc: 'Text is entered in the browser. Nothing has been sent yet.',
  },
  {
    step: 2,
    title: 'Browser encrypts client-side',
    desc: 'A symmetric key is generated locally. Content is encrypted with XChaCha20-Poly1305 before upload.',
  },
  {
    step: 3,
    title: 'Ciphertext is stored on the server',
    desc: 'Only the encrypted blob is sent. The decryption key stays in the URL fragment, which the server never receives.',
  },
  {
    step: 4,
    title: 'Recipient decrypts in browser',
    desc: 'Opening the link reconstructs the key from the URL fragment and decrypts the content locally.',
  },
];

export const faqs: FaqItem[] = [
  {
    question: 'Can the server read my pastes?',
    answer:
      'No. Content is encrypted in your browser before upload. The decryption key is stored in the URL fragment, which is never sent to the server.',
  },
  {
    question: 'What is the URL fragment and why does it matter?',
    answer:
      'The part after # in a URL is called the fragment. Browsers never send it to the server. This means the decryption key in the link stays between you and whoever you share it with.',
  },
  {
    question: 'What is the difference between classical and quantum-resistant mode?',
    answer:
      'Classical uses X25519 + XChaCha20-Poly1305. Quantum-resistant adds ML-KEM-1024, a post-quantum algorithm, to hedge against future quantum computers that could break classical key exchange.',
  },
  {
    question: 'What is burn-after-read?',
    answer:
      'The paste is permanently deleted from the server the moment it is read. Use this for one-time sharing where the recipient should not be able to reopen the link.',
  },
  {
    question: 'Do I need an account?',
    answer: 'No. Nobins works without registration. Create and share pastes instantly.',
  },
  {
    question: 'What happens when a paste expires?',
    answer:
      'Expired pastes are deleted automatically. The server runs cleanup on read and via a scheduled job. Once deleted, the ciphertext is gone permanently.',
  },
  {
    question: 'Is there a file size limit?',
    answer: 'Current limit is 10MB per paste. Binary files are base64-encoded before encryption.',
  },
  {
    question: 'Can I password-protect a paste?',
    answer:
      'Planned. The decryption key will be wrapped with a password-derived key (PBKDF2). Not yet implemented.',
  },
];
