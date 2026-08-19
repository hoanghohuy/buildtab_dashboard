import type { IKpiMetric, TStatusLevel } from '@/shared/types/common.types';

/** Một điểm trên S-curve tiến độ hồ sơ */
export interface IDocumentProgressPoint {
  month: string;
  baseline: number;
  actual: number | null;
  forecast: number | null;
}

export interface IDocumentProgress {
  points: IDocumentProgressPoint[];
  unit: string;
}

/** Gói thầu bị chậm */
export interface IDelayedPackage {
  packageId: string;
  packageCode: string;
  packageName: string;
  contractorName: string;
  delayDays: number;
  reason: string;
  status: TStatusLevel;
}

/** Xếp hạng đơn vị (TVTK / Nhà thầu) */
export interface IUnitRanking {
  organizationId: string;
  organizationName: string;
  logoUrl?: string;
  submissionRate: number;
  /** First-Time Approval Rate */
  ftar: number;
  score: number;
  rank: number;
  trend: number;
}

/** Rủi ro top */
export interface IRiskItem {
  riskId: string;
  title: string;
  category: string;
  probability: number;
  impact: number;
  score: number;
  owner: string;
  status: TStatusLevel;
  mitigation: string;
}

/** Ảnh công trường */
export interface ISitePhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  packageCode: string;
  location: string;
  description: string;
  capturedAt: string;
  isLive: boolean;
}

/** Mốc tiến độ */
export interface IMilestone {
  id: string;
  name: string;
  plannedDate: string;
  actualDate?: string;
  status: TStatusLevel;
  progressPercent?: number;
  delayDays?: number;
}

/** Thông tin chung dự án */
export interface IProjectInfo {
  name: string;
  length: number;
  lanes: number;
  totalInvestment: number;
  fundingSource: string;
  startDate: string;
  plannedEndDate: string;
  owner: string;
  progressPercent: number;
  daysRemaining: number;
}

/** Dữ liệu toàn bộ tab Tổng quan */
export interface IOverviewDashboard {
  kpis: IKpiMetric[];
  documentProgress: IDocumentProgress;
  delayedPackages: IDelayedPackage[];
  designerRanking: IUnitRanking[];
  contractorRanking: IUnitRanking[];
  topRisks: IRiskItem[];
  riskMatrix: number[][];
  sitePhotos: ISitePhoto[];
  milestones: IMilestone[];
  projectInfo: IProjectInfo;
  generatedAt: string;
}
