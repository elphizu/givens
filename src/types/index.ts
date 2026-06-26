import type { ComponentType, SVGProps } from 'react';

import { type LanguageSupport } from '@codemirror/language';

export type CopyFieldProps = {
  label: string;
  value: string;
  icon?: React.ElementType;
};

export type ShareDialogProps = {
  open: boolean;
  onClose?: () => void;
  shareUrl: string;
  deleteUrl: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type StepItem = {
  step: number;
  title: string;
  desc: string;
};

export type ModeItem = {
  name: 'classical' | 'quantum';
  crypto: string;
  desc: string;
};

export type FeatureItem = {
  title: string;
  desc: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type SocialLinkItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export type ExpirationValue = 300 | 3600 | 86400 | 604800 | 2592000 | 0;

export type ExpirationItem = {
  label: string;
  value: ExpirationValue;
};

export type LanguageItem = {
  label: string;
  value: LanguageSupport | null;
};
