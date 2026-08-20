/**
 * Đọc cờ boolean từ Vite env (`true`/`1`/`on` hoặc `false`/`0`/`off`).
 */
function parseEnvFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.trim() === '') return fallback;
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return fallback;
}

/**
 * Bật/tắt tự chuyển tab kiosk (Tổng quan → Sơ đồ tổ chức → Tài chính → Sức khỏe nhà thầu).
 *
 * Điều khiển qua `VITE_KIOSK_AUTO_ROTATE` trong `frontend/.env`.
 * Đổi giá trị rồi restart `npm run dev` (Vite không hot-reload file .env).
 */
export const KIOSK_AUTO_ROTATE: boolean = parseEnvFlag(
  import.meta.env.VITE_KIOSK_AUTO_ROTATE,
  true,
);
