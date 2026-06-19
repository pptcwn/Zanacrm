import { cn } from '@/lib/utils';

type Platform = 'tiktok' | 'shopee' | 'facebook';

const config: Record<Platform, { label: string; dot: string; text: string }> = {
  tiktok: { label: 'TikTok', dot: 'bg-zinc-100', text: 'text-zinc-200' },
  shopee: { label: 'Shopee', dot: 'bg-orange-500', text: 'text-orange-400' },
  facebook: { label: 'Facebook', dot: 'bg-blue-500', text: 'text-blue-400' },
};

export interface PlatformBadgeProps {
  platform: Platform;
  showLabel?: boolean;
  className?: string;
}

export function PlatformBadge({ platform, showLabel = true, className }: PlatformBadgeProps) {
  const item = config[platform] ?? config.tiktok;

  if (!showLabel) {
    return (
      <span
        className={cn('inline-block h-2.5 w-2.5 rounded-full', item.dot, className)}
        aria-label={item.label}
        role="img"
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-zinc-800/60 px-2.5 py-1 text-xs font-medium',
        item.text,
        className,
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', item.dot)} aria-hidden="true" />
      {item.label}
    </span>
  );
}
