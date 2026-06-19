import React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, message, action, className, ...props }: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center min-h-[200px] bg-zinc-900/50 border border-zinc-800/50 rounded-2xl border-dashed",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="text-zinc-600 mb-4 p-4 bg-zinc-800/50 rounded-full">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      {message && (
        <p className="text-zinc-400 mb-6 max-w-md">{message}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}
