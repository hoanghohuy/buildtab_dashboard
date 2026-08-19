import type { ReactElement } from 'react';

export interface IWidgetErrorProps {
  error: Error | string | null | undefined;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * UI trạng thái lỗi widget (kèm nút thử lại nếu có).
 */
export function WidgetError({
  error,
  onRetry,
  retryLabel = 'Thử lại',
}: IWidgetErrorProps): ReactElement {
  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : undefined;

  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="text-center">
        <div className="text-caption font-semibold text-danger">⚠ Lỗi dữ liệu</div>
        <div className="mt-2 text-caption text-[var(--text-secondary)]">
          {message ?? 'Không tải được dữ liệu'}
        </div>
      </div>

      {onRetry && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-white/10 px-4 py-2 text-caption transition-colors hover:bg-white/15"
          >
            {retryLabel}
          </button>
        </div>
      )}
    </div>
  );
}

