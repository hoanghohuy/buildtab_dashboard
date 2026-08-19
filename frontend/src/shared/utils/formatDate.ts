import { format, formatDistanceToNow, differenceInCalendarDays } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format ngày theo DD/MM/YYYY.
 * @param date - Chuỗi ISO hoặc Date object
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd/MM/yyyy');
}

/**
 * Format thời gian tương đối, vd "2 phút trước", "1 giờ trước".
 * @param date - Chuỗi ISO hoặc Date object
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: vi });
}

/**
 * Format countdown dạng "D−42" (số ngày còn lại, âm nếu quá hạn).
 * @param targetDate - Ngày mục tiêu
 */
export function formatCountdown(targetDate: string | Date): string {
  const d = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const diff = differenceInCalendarDays(d, new Date());
  return `D−${diff}`;
}
