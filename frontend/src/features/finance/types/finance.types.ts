import type { IKpiMetric, TStatusLevel } from '@/shared/types/common.types';

/** Một bước trong biểu đồ waterfall */
export interface IWaterfallItem {
  label: string;
  value: number;
  type: 'total' | 'decrease' | 'increase';
  color?: string;
}

/** Điểm trên đường cong giải ngân */
export interface IDisbursementPoint {
  month: string;
  planned: number;
  actual: number;
  cumulativePlannedPercent: number;
  cumulativeActualPercent: number;
}

/** Phân bổ chi phí theo khoản mục */
export interface ICostBreakdown {
  category: string;
  value: number;
  percentage: number;
  disbursed: number;
  color: string;
}

/** Thanh toán theo gói thầu */
export interface IPackagePayment {
  packageId: string;
  packageCode: string;
  packageName: string;
  contractorName: string;
  contractValue: number;
  certifiedPercent: number;
  paidPercent: number;
  advanceRemaining: number;
  status: TStatusLevel;
}

/** Phát sinh (Variation Order) */
export interface IVariationOrder {
  id: string;
  title: string;
  value: number;
  reason: string;
  status: 'proposed' | 'reviewing' | 'approved';
}

/** Dữ liệu toàn bộ tab Tài chính */
export interface IFinanceDashboard {
  kpis: IKpiMetric[];
  waterfall: IWaterfallItem[];
  disbursementCurve: IDisbursementPoint[];
  costBreakdown: ICostBreakdown[];
  packagePayments: IPackagePayment[];
  variationOrders: IVariationOrder[];
  totalVOValue: number;
  voRatio: number;
  monthlyDisbursement: { month: string; planned: number; actual: number }[];
  generatedAt: string;
}
