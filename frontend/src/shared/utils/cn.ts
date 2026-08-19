import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';

/**
 * Merge class names, lọc falsy values.
 * @param inputs - Danh sách class names hoặc conditional objects
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
