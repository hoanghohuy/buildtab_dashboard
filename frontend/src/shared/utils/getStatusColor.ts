import type { TStatusLevel } from '@/shared/types/common.types';

interface IStatusColorSet {
  bg: string;
  text: string;
  glow: string;
  border: string;
}

const STATUS_COLOR_MAP: Record<TStatusLevel, IStatusColorSet> = {
  good: {
    bg: 'rgba(52,211,153,0.15)',
    text: '#34D399',
    glow: '0 0 24px rgba(52,211,153,0.30)',
    border: 'rgba(52,211,153,0.40)',
  },
  normal: {
    bg: 'rgba(100,116,139,0.15)',
    text: '#94A3B8',
    glow: 'none',
    border: 'rgba(100,116,139,0.40)',
  },
  warning: {
    bg: 'rgba(251,191,36,0.15)',
    text: '#FBBF24',
    glow: '0 0 24px rgba(251,191,36,0.30)',
    border: 'rgba(251,191,36,0.40)',
  },
  danger: {
    bg: 'rgba(251,113,133,0.15)',
    text: '#FB7185',
    glow: '0 0 24px rgba(251,113,133,0.35)',
    border: 'rgba(251,113,133,0.40)',
  },
  critical: {
    bg: 'rgba(251,113,133,0.25)',
    text: '#FB7185',
    glow: '0 0 32px rgba(251,113,133,0.50)',
    border: 'rgba(251,113,133,0.60)',
  },
};

/**
 * Lấy bộ màu semantic theo mức trạng thái (§10.2 design tokens).
 * @param status - Mức trạng thái
 */
export function getStatusColor(status: TStatusLevel): IStatusColorSet {
  return STATUS_COLOR_MAP[status];
}
