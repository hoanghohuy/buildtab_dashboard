import type { ReactElement } from 'react';

import { ChartLine, ClipboardList, Coins, Droplets, Puzzle, Zap } from 'lucide-react';

import { DashboardShell } from '@/shared/components/layout/DashboardShell';
import { WidgetContainer } from '@/shared/components/glass/WidgetContainer';

import { useFinanceData } from './hooks/useFinanceData';
import { CashflowWaterfallWidget } from './components/CashflowWaterfallWidget';
import { DisbursementSCurveWidget } from './components/DisbursementSCurveWidget';
import { CostBreakdownTreemapWidget } from './components/CostBreakdownTreemapWidget';
import { PackagePaymentTableWidget } from './components/PackagePaymentTableWidget';
import { VariationOrderPanelWidget } from './components/VariationOrderPanelWidget';
import { MonthlyDisbursementWidget } from './components/MonthlyDisbursementWidget';

/**
 * TAB 3 — Tài chính.
 *
 * V0 bố trí (grid 12 cột × 9 hàng):
 * - W3.1: Waterfall dòng tiền (C1–C4, R2–R5)
 * - W3.2: S-Curve giải ngân (C5–C8, R2–R5)
 * - W3.3: Cơ cấu chi phí Treemap (C9–C12, R2–R5)
 * - W3.4: Top 6 gói thầu — giá trị & thanh toán (C1–C6, R6–R8)
 * - W3.5: VO panel (Top 3 VO + voRatio) (C7–C9, R6–R8)
 * - W3.7: Giải ngân theo tháng (C1–C12, R9)
 */
export default function FinancePage(): ReactElement {
  const { data, isLoading, error, isStale } = useFinanceData();

  return (
    <DashboardShell>
      <WidgetContainer
        title="Waterfall dòng tiền"
        icon={<Droplets className="h-5 w-5" aria-hidden="true" />}
        subtitle="TMĐT → Giải ngân → Còn lại"
        position={{ colStart: 1, colSpan: 4, rowStart: 2, rowSpan: 4 }}
        isLoading={isLoading}
        error={error ?? null}
        isStale={isStale}
      >
        {data ? <CashflowWaterfallWidget data={data.waterfall} /> : null}
      </WidgetContainer>

      <WidgetContainer
        title="S-Curve giải ngân"
        icon={<ChartLine className="h-5 w-5" aria-hidden="true" />}
        subtitle="KH năm vs Thực tế vs Dự báo"
        position={{ colStart: 5, colSpan: 4, rowStart: 2, rowSpan: 4 }}
        isLoading={isLoading}
        error={error ?? null}
        isStale={isStale}
      >
        {data ? <DisbursementSCurveWidget data={data.disbursementCurve} /> : null}
      </WidgetContainer>

      <WidgetContainer
        title="Cơ cấu chi phí"
        icon={<Puzzle className="h-5 w-5" aria-hidden="true" />}
        subtitle="Treemap"
        position={{ colStart: 9, colSpan: 4, rowStart: 2, rowSpan: 4 }}
        isLoading={isLoading}
        error={error ?? null}
        isStale={isStale}
      >
        {data ? <CostBreakdownTreemapWidget data={data.costBreakdown} /> : null}
      </WidgetContainer>

      <WidgetContainer
        title="Bảng gói thầu — Giá trị & Thanh toán"
        icon={<ClipboardList className="h-5 w-5" aria-hidden="true" />}
        subtitle="Top 6 theo giá trị hợp đồng"
        position={{ colStart: 1, colSpan: 6, rowStart: 6, rowSpan: 3 }}
        isLoading={isLoading}
        error={error ?? null}
        isStale={isStale}
      >
        {data ? <PackagePaymentTableWidget data={data.packagePayments} /> : null}
      </WidgetContainer>

      <WidgetContainer
        title="Phát sinh & Điều chỉnh (VO)"
        icon={<Zap className="h-5 w-5" aria-hidden="true" />}
        subtitle="Top 3 VO lớn + KPI voRatio"
        position={{ colStart: 7, colSpan: 3, rowStart: 6, rowSpan: 3 }}
        isLoading={isLoading}
        error={error ?? null}
        isStale={isStale}
      >
        {data ? (
          <VariationOrderPanelWidget
            variationOrders={data.variationOrders}
            totalVOValue={data.totalVOValue}
            voRatio={data.voRatio}
          />
        ) : null}
      </WidgetContainer>

      <WidgetContainer
        title="Giải ngân theo tháng"
        icon={<Coins className="h-5 w-5" aria-hidden="true" />}
        subtitle="KH tháng vs TT tháng"
        position={{ colStart: 1, colSpan: 12, rowStart: 9, rowSpan: 1 }}
        isLoading={isLoading}
        error={error ?? null}
        isStale={isStale}
      >
        {data ? <MonthlyDisbursementWidget data={data.monthlyDisbursement} /> : null}
      </WidgetContainer>
    </DashboardShell>
  );
}
