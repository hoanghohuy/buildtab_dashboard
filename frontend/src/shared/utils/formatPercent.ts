/**
 * Format phần trăm theo chuẩn VN (dấu , thập phân).
 * @param value - Giá trị phần trăm (vd 62.4)
 * @param decimals - Số chữ số thập phân, mặc định 1
 * @returns Chuỗi đã format, vd "62,4%"
 */
export function formatPercent(value: number, decimals: number = 1): string {
  const fixed = value.toFixed(decimals);
  return `${fixed.replace('.', ',')}%`;
}
