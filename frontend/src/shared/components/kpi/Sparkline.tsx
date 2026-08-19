import type { ReactElement } from 'react';

export interface ISparklineProps {
  values: number[];
  /**
   * Màu stroke cho đường sparkline.
   * Không dùng ECharts để giữ bundle nhỏ và tránh phụ thuộc chart primitives.
   */
  stroke?: string;
}

function toFixedNumber(value: number): string {
  // Giữ đủ số chữ số để nhìn rõ nhưng không quá dài.
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.00$/, '');
}

/**
 * Sparkline mini dạng SVG (fallback không dùng ECharts).
 */
export function Sparkline({ values, stroke = '#22D3EE' }: ISparklineProps): ReactElement {
  if (!values.length) {
    return (
      <svg aria-hidden="true" width="100%" height="20" viewBox="0 0 100 20">
        <rect x="0" y="0" width="100" height="20" fill="none" />
      </svg>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const w = 120;
  const h = 20;
  const pad = 2;
  const usableW = w - pad * 2;
  const usableH = h - pad * 2;

  const points = values.map((v, i) => {
    const x = pad + (usableW * i) / Math.max(1, values.length - 1);
    const y = pad + (usableH * (max - v)) / span;
    return { x, y };
  });

  const polyline = points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

  const first = toFixedNumber(values[0]);
  const last = toFixedNumber(values[values.length - 1]);

  return (
    <svg
      aria-label={`Sparkline: ${first} -> ${last}`}
      width="100%"
      height="28"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={polyline}
      />
    </svg>
  );
}

