/** Mức trạng thái chung cho KPI, gói thầu, cảnh báo */
export type TStatusLevel = 'good' | 'normal' | 'warning' | 'danger' | 'critical';

/** Hướng xu hướng so với kỳ trước */
export type TTrendDirection = 'up' | 'down' | 'flat';

/** Giá trị chênh lệch so với kỳ trước */
export interface IDeltaValue {
  value: number;
  isPositive: boolean;
  direction: TTrendDirection;
  /** Nhãn kỳ so sánh, vd "tháng trước", "tuần trước" */
  comparedTo: string;
}

/** Một chỉ số KPI đã tính sẵn từ BFF */
export interface IKpiMetric {
  key: string;
  label: string;
  value: number;
  unit: string;
  /** Chuỗi hiển thị đã format sẵn, vd "62,4%" */
  formatted: string;
  status: TStatusLevel;
  delta?: IDeltaValue;
  /** Dữ liệu sparkline (mảng số) cho trend nhỏ */
  sparkline?: number[];
}
