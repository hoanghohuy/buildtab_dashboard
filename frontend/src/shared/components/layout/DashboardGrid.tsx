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
 * Lưới dashboard 12 cột × 9 hàng.
 * Màn lớn (≥1367px): hàng `fr` khít 100vh. iPad: cao theo nội dung, cuộn dọc.
 */
export function DashboardGrid({ children }: IDashboardGridProps): ReactElement {
  return (
    <div
      className="dashboard-grid-wrap w-full"
      style={{
        padding: GRID_LAYOUT.outsidePadding,
      }}
    >
      <div
        className="dashboard-grid-track w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_LAYOUT.cols}, minmax(0, 1fr))`,
          gridTemplateRows: 'var(--dash-grid-rows)',
          gap: GRID_LAYOUT.gutter,
          alignContent: 'var(--dash-grid-align)',
          justifyContent: 'stretch',
        }}
      >
        {Children.toArray(children).map((child, idx) => {
          if (!isValidElement(child)) return null;
          const position = getPositionFromChild(child);
          if (!position) return null;

          return (
            <div
              key={idx}
              className="dashboard-grid-item min-h-0 min-w-0 overflow-hidden"
              data-row-span={position.rowSpan}
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

