import type { ReactElement } from 'react';

/**
 * UI trạng thái rỗng widget (không có dữ liệu).
 */
export function WidgetEmpty(): ReactElement {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="text-heading-md text-[var(--text-tertiary)]">—</div>
      <div className="text-caption text-[var(--text-secondary)]">Chưa có dữ liệu</div>
    </div>
  );
}

