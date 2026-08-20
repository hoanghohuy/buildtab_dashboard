export interface IGridLayoutConfig {
  /** Chiều cao header (px) */
  headerHeight: number;
  /** Padding ngoài quanh vùng lưới (px) */
  outsidePadding: number;
  /** Khoảng cách giữa các cột/hàng (px) */
  gutter: number;
  /** Số cột */
  cols: number;
  /** Số hàng */
  rows: number;
  /** Chiều cao hàng (px) - xấp xỉ theo thiết kế @1920×1080 */
  rowHeight: number;
}

/**
 * Cấu hình lưới dashboard.
 *
 * Chiều cao hàng thực tế: CSS `--dash-grid-rows` (minmax, cho phép trang cuộn).
 */
export const GRID_LAYOUT: IGridLayoutConfig = {
  headerHeight: 72,
  outsidePadding: 16,
  gutter: 14,
  cols: 12,
  rows: 9,
  rowHeight: 96,
};

export type IGridPosition = {
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
};
