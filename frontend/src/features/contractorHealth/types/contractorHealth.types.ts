import type { IKpiMetric } from '@/shared/types/common.types';

/** 6 trụ cột đánh giá sức khỏe */
export interface IHealthPillars {
  progress: number;
  document: number;
  quality: number;
  safety: number;
  resource: number;
  finance: number;
}

/** Mức xếp hạng sức khỏe */
export type THealthBand = 'excellent' | 'good' | 'watch' | 'risk' | 'critical';

/** Sức khỏe một đơn vị */
export interface IContractorHealth {
  organizationId: string;
  organizationName: string;
  logoUrl?: string;
  role: string;
  pillars: IHealthPillars;
  totalScore: number;
  band: THealthBand;
  history: number[];
  scoreChange: number;
  rank: number;
  rankChange: number;
  workloadValue: number;
  packageCount: number;
}

/** Cảnh báo sớm */
export interface IEarlyWarning {
  warningId: string;
  organizationId: string;
  organizationName: string;
  severity: string;
  title: string;
  reasons: string[];
  recommendation: string;
  dueDate?: string;
}

/** Dữ liệu toàn bộ tab Sức khỏe nhà thầu */
export interface IContractorHealthDashboard {
  kpis: IKpiMetric[];
  contractors: IContractorHealth[];
  heatmapData: {
    organizationName: string;
    pillars: IHealthPillars;
  }[];
  earlyWarnings: IEarlyWarning[];
  avgScore: number;
  trendHistory: number[];
  generatedAt: string;
}
