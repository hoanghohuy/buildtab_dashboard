import { forwardRef, memo } from 'react'

export type TGlassLevel = 'L1' | 'L2' | 'L3'

export interface IGlassPanel extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Cấp độ kính:
   * - L1: panel nền (glass-panel)
   * - L2: card nổi (glass-card)
   * - L3: overlay (glass-overlay)
   */
  level?: TGlassLevel
}

/**
 * Khung kính chuẩn cho mọi container/panel trong dashboard.
 */
export const GlassPanel = memo(
  forwardRef<HTMLDivElement, IGlassPanel>(function GlassPanel(
    { level = 'L1', className, children, ...restProps },
    ref,
  ) {
    const levelClassName =
      level === 'L2'
        ? 'glass-card'
        : level === 'L3'
          ? 'glass-overlay'
          : 'glass-panel'

    const combinedClassName = [levelClassName, className]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={combinedClassName} {...restProps}>
        {children}
      </div>
    )
  }),
)

GlassPanel.displayName = 'GlassPanel'

