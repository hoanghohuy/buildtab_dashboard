import { memo } from 'react'

export interface IAuroraBackgroundProps {
  className?: string
}

/**
 * Hiển thị 3 quầng sáng aurora mờ (dark + glassmorphism base layer).
 * Dùng cho layout ở chế độ TV 10-foot.
 */
export const AuroraBackground = memo(
  ({ className }: IAuroraBackgroundProps) => {
            const combinedClassName = ['fixed inset-0 pointer-events-none z-0', className]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={combinedClassName} aria-hidden>
        <div
          className={[
            'absolute top-[-220px] left-[-220px]',
            'h-[520px] w-[520px]',
            'rounded-full',
            'bg-[var(--aurora-1)]',
            'blur-[180px]',
            'opacity-[0.28]',
            'animate-aurora',
          ].join(' ')}
        />

        <div
          className={[
            'absolute bottom-[-240px] right-[-240px]',
            'h-[560px] w-[560px]',
            'rounded-full',
            'bg-[var(--aurora-2)]',
            'blur-[200px]',
            'opacity-[0.22]',
            'animate-aurora',
          ].join(' ')}
        />

        <div
          className={[
            'absolute top-1/2 right-[-260px]',
            '-translate-y-1/2',
            'h-[600px] w-[600px]',
            'rounded-full',
            'bg-[var(--aurora-3)]',
            'blur-[220px]',
            'opacity-[0.15]',
            'animate-aurora',
          ].join(' ')}
        />
      </div>
    )
  },
)

AuroraBackground.displayName = 'AuroraBackground'

