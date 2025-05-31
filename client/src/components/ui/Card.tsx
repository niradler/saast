import { ReactNode } from 'react';
import { cn } from '../../utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, variant = 'default', padding = 'md' }: CardProps) {
  const baseClasses = 'rounded-xl';
  
  const variants = {
    default: 'bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800',
    glass: 'glass-card',
    bordered: 'border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900',
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div className={cn(baseClasses, variants[variant], paddings[padding], className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('text-gray-600 dark:text-gray-300', className)}>
      {children}
    </div>
  );
}