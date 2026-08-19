import { forwardRef, memo } from 'react'
import {
  GlassPanel,
  type IGlassPanel,
} from '@/shared/components/glass/GlassPanel'

export type IGlassCardProps = Omit<IGlassPanel, 'level'>

/**
 * Shortcut của `GlassPanel` với `level="L2"`.
 */
export const GlassCard = memo(
  forwardRef<HTMLDivElement, IGlassCardProps>(function GlassCard(
    { className, ...restProps },
    ref,
  ) {
    return (
      <GlassPanel
        ref={ref}
        level="L2"
        className={className}
        {...restProps}
      />
    )
  }),
)

GlassCard.displayName = 'GlassCard'

