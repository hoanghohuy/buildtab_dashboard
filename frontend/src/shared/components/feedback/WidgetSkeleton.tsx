import type { ReactElement } from 'react';

/**
 * Skeleton loading cho nội dung widget.
 * (Thiết kế tối giản để không gây nhiễu trên màn TV.)
 */
export function WidgetSkeleton(): ReactElement {
  return (
    <div className="space-y-3" aria-busy="true">
      <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
      <div className="h-4 w-full animate-pulse rounded bg-white/10" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
      <div className="h-4 w-4/6 animate-pulse rounded bg-white/10" />
      <div className="mt-6 h-24 w-full animate-pulse rounded bg-white/5" />
    </div>
  );
}

