import type { ReactElement, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { GlassPanel } from '@/shared/components/glass/GlassPanel';
import type { IGridPosition } from '@/shared/constants/GRID_LAYOUT';
import { WidgetEmpty } from '@/shared/components/feedback/WidgetEmpty';
import { WidgetError } from '@/shared/components/feedback/WidgetError';
import { WidgetSkeleton } from '@/shared/components/feedback/WidgetSkeleton';

/**
 * Vị trí widget trên lưới dashboard.
 */
export interface IWidgetContainerProps {
  /** Tiêu đề widget */
  title: string;
  /** Icon đứng trước tiêu đề */
  icon?: ReactNode;
  /** Mô tả phụ dưới tiêu đề */
  subtitle?: string;
  /** Nội dung góc phải header */
  headerRight?: ReactNode;
  /** Nội dung footer dưới cùng */
  footer?: ReactNode;
  /** Vị trí widget trên lưới 12×9 */
  position: IGridPosition;
  /** Hiển thị trạng thái loading */
  isLoading?: boolean;
  /** Hiển thị lỗi */
  error?: Error | string | null;
  /** Dữ liệu quá cũ */
  isStale?: boolean;
  /** Hành động thử lại */
  onRetry?: () => void;
  /** Nội dung widget */
  children?: ReactNode;
}

/**
 * Container chuẩn cho widget dashboard (Glass L1 + layout header/body/footer).
 *
 * Lưu ý: vị trí (`position`) được dùng bởi `DashboardGrid` để set `gridColumn/gridRow`,
 * widget chỉ giữ layout nội bộ.
 */
export function WidgetContainer({
  title,
  icon,
  subtitle,
  headerRight,
  footer,
  position,
  isLoading = false,
  error = null,
  isStale = false,
  onRetry,
  children,
}: IWidgetContainerProps): ReactElement {
  const { t } = useTranslation('common');

  const hasError = Boolean(error);
  const hasContent = Boolean(children);

  return (
    <GlassPanel
      level="L1"
      className={isStale ? 'h-full w-full opacity-70' : 'h-full w-full'}
      data-grid-col-start={position.colStart}
      data-grid-col-span={position.colSpan}
      data-grid-row-start={position.rowStart}
      data-grid-row-span={position.rowSpan}
    >
      <section className="flex h-full w-full flex-col overflow-hidden">
        <header className="flex shrink-0 items-start justify-between px-4 pt-2.5 pb-1.5">
          <div className="flex min-w-0 items-center gap-2">
            {icon && <span className="shrink-0 text-accent">{icon}</span>}
            <div className="min-w-0">
              <h2 className="truncate text-body-md font-medium text-[var(--text-primary)]">
                {title}
              </h2>
              {subtitle && (
                <p className="truncate text-caption text-[var(--text-secondary)]">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            {isStale && (
              <span className="rounded-[10px] bg-warning/20 px-3 py-1 text-caption text-warning">
                {t('staleData', 'Dữ liệu cũ')}
              </span>
            )}
            {headerRight}
          </div>
        </header>

        <div className="mx-4 h-px shrink-0 bg-white/[0.08]" />

        <div className="min-h-0 flex-1 overflow-hidden px-4 py-2">
          {isLoading && <WidgetSkeleton />}
          {!isLoading && hasError && (
            <WidgetError
              error={error}
              onRetry={onRetry}
              retryLabel={t('retry', 'Thử lại')}
            />
          )}
          {!isLoading && !hasError && !hasContent && <WidgetEmpty />}
          {!isLoading && !hasError && hasContent && children}
        </div>

        {footer && (
          <footer className="shrink-0 px-6 pb-4 text-caption text-[var(--text-secondary)]">
            {footer}
          </footer>
        )}
      </section>
    </GlassPanel>
  );
}

