/**
 * Format số tiền theo chuẩn Việt Nam (dấu . phân nghìn, dấu , thập phân).
 * @param value - Giá trị số
 * @param unit - Đơn vị: 'billion' (tỷ) hoặc 'million' (triệu). Mặc định 'billion'.
 * @returns Chuỗi đã format, vd "24.860,5 tỷ"
 */
export function formatCurrency(
  value: number,
  unit: 'billion' | 'million' = 'billion',
): string {
  const suffix = unit === 'billion' ? ' tỷ' : ' triệu';
  const decimals = unit === 'billion' ? 1 : 0;

  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');

  // Dấu . phân cách nghìn
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (decimals > 0 && decPart && decPart !== '0') {
    return `${formatted},${decPart}${suffix}`;
  }

  return `${formatted}${suffix}`;
}
