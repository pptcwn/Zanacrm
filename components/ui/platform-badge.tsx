import { cn } from '@/lib/utils';

type Platform = 'tiktok' | 'shopee' | 'facebook' | 'lazada';

const config: Record<Platform, { label: string; dot: string; text: string }> = {
  tiktok: { label: 'TikTok', dot: 'bg-[var(--tiktok)]', text: 'text-[var(--tiktok)]' },
  shopee: { label: 'Shopee', dot: 'bg-[var(--shopee)]', text: 'text-[var(--shopee)]' },
  facebook: { label: 'Facebook', dot: 'bg-[var(--facebook)]', text: 'text-[var(--facebook)]' },
  lazada: { label: 'Lazada', dot: 'bg-[var(--lazada)]', text: 'text-[var(--lazada)]' },
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
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium',
        item.text,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', item.dot)} aria-hidden="true" />
      {item.label}
    </span>
  );
}
