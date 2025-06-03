// components/ui/Heading.tsx
import { ReactNode } from 'react';
import clsx from 'clsx';

type HeadingVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle'
  | 'subtitle2'
  | 'caption'
  | 'caption2'
  | 'body'
  | 'body2';

interface HeadingProps {
  variant: HeadingVariant;
  children: ReactNode;
  className?: string;
}

const baseStyles: Record<HeadingVariant, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-semibold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-medium',
  h5: 'text-lg font-medium',
  h6: 'text-base font-medium',
  subtitle: 'text-sm text-gray-700',
  subtitle2: 'text-sm text-gray-700 font-medium',
  caption: 'text-sm text-gray-500',
  caption2: 'text-xs text-gray-500 font-medium',
  body: 'text-sm',
  body2: 'text-xs',
};

export const Heading = ({ variant, children, className }: HeadingProps) => {
  const Tag = variant.startsWith('h') ? (variant as keyof JSX.IntrinsicElements) : 'p';
  return (
    <Tag className={clsx(baseStyles[variant], className)}>
      {children}
    </Tag>
  );
};
