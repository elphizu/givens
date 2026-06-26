import type { ComponentType, SVGProps } from 'react';

import { type LanguageSupport } from '@codemirror/language';

export interface CopyFieldProps {
  label: string;
  value: string;
  icon?: React.ElementType;
}

export interface ShareDialogProps {
  open: boolean;
  onClose?: () => void;
  shareUrl: string;
  deleteUrl: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StepItem {
  step: number;
  title: string;
  desc: string;
}

export interface ModeItem {
  name: 'classical' | 'quantum';
  crypto: string;
  desc: string;
}

export interface FeatureItem {
  title: string;
  desc: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLinkItem {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export type ExpirationValue = 300 | 3600 | 86400 | 604800 | 2592000 | 0;

export interface ExpirationItem {
  label: string;
  value: ExpirationValue;
}

export interface LanguageItem {
  label: string;
  value: LanguageSupport | null;
}
