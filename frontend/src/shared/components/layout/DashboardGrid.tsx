import type { ReactElement, ReactNode } from 'react';
import { Children, isValidElement } from 'react';

import type { IGridPosition } from '@/shared/constants/GRID_LAYOUT';
import { GRID_LAYOUT } from '@/shared/constants/GRID_LAYOUT';

export interface IDashboardGridProps {
  children: ReactNode;
}

interface IPositionedChildProps {
  position: IGridPosition;
}

function getPositionFromChild(child: ReactElement): IGridPosition | null {
  const maybeProps = child.props as Partial<IPositionedChildProps>;
  if (!maybeProps.position) return null;
  const { colStart, colSpan, rowStart, rowSpan } = maybeProps.position;
  if (
    typeof colStart !== 'number' ||
    typeof colSpan !== 'number' ||
    typeof rowStart !== 'number' ||
    typeof rowSpan !== 'number'
  ) {
    return null;
  }
  return maybeProps.position;
}

/**
 * Lưới dashboard 12 cột × 9 hàng (TV 1920×1080).
 * - Không tạo thanh cuộn: wrapper dùng `overflow-hidden`, track dùng `fr`.
 * - Vị trí widget dùng inline style (`gridColumn`, `gridRow`).
 */
export function DashboardGrid({ children }: IDashboardGridProps): ReactElement {
  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{
        padding: GRID_LAYOUT.outsidePadding,
      }}
    >
      <div
        className="h-full w-full overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_LAYOUT.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_LAYOUT.rows}, minmax(0, 1fr))`,
          gap: GRID_LAYOUT.gutter,
          alignContent: 'stretch',
          justifyContent: 'stretch',
        }}
      >
        {Children.toArray(children).map((child, idx) => {
          if (!isValidElement(child)) return null;
          const position = getPositionFromChild(child);
          if (!position) return null;

          return (
            <div
              // Grid item wrapper (child bên trong không cần gridColumn/gridRow)
              key={idx}
              className="min-h-0 min-w-0 overflow-hidden"
              style={{
                gridColumn: `${position.colStart} / span ${position.colSpan}`,
                gridRow: `${position.rowStart} / span ${position.rowSpan}`,
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}

