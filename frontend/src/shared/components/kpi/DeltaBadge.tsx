import type { ReactElement } from 'react';

import type { IDeltaValue, TTrendDirection } from '@/shared/types/common.types';

export interface IDeltaBadgeProps {
  delta: IDeltaValue;
}

function getArrow(direction: TTrendDirection): string {
  if (direction === 'up') return '▲';
  if (direction === 'down') return '▼';
  return '→';
}

/**
 * Badge hiển thị delta + mũi tên xu hướng.
 */
export function DeltaBadge({ delta }: IDeltaBadgeProps): ReactElement {
  const arrow = getArrow(delta.direction);
  const sign = delta.direction === 'down' ? '-' : delta.direction === 'up' ? '+' : '';
  const magnitude = Math.abs(delta.value);
  const formatted = Number.isInteger(magnitude) ? magnitude.toString() : magnitude.toFixed(2).replace(/\.00$/, '');

  const isPositive = delta.isPositive;
  const toneClasses = isPositive ? 'text-success' : 'text-danger';
  const bgClasses = isPositive ? 'bg-success/15' : 'bg-danger/15';
  const borderClasses = isPositive ? 'border-success/40' : 'border-danger/40';

  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-caption font-semibold',
        bgClasses,
        borderClasses,
        toneClasses,
      ].join(' ')}
      title={`${delta.comparedTo}`}
    >
      <span aria-hidden="true">{arrow}</span>
      <span aria-label={`Delta ${sign}${formatted}`}>{`${sign}${formatted}`}</span>
    </span>
  );
}

