/** Cụm dự án (cluster) */
export interface ICluster {
  id: string;
  name: string;
  type: string;
  scopeKm: number;
  packageCount: number;
  unitCount: number;
  progressPercent: number;
  hasAlert: boolean;
}

/** Vai trò tổ chức */
export type IOrgRole =
  | 'investor'
  | 'supervisor'
  | 'designer'
  | 'reviewer'
  | 'contractor'
  | 'landAcquisition'
  | 'other';

/** Đơn vị tham gia */
export interface IOrgUnit {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  role: IOrgRole;
  healthScore?: number;
  healthBand?: string;
  packageCodes: string[];
  contractValue?: number;
  progressPercent?: number;
}

/** Liên hệ */
export interface IContact {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  avatarUrl?: string;
}

/** Đơn vị + danh sách liên hệ (đúng theo mock org-chart.json) */
export type IOrgUnitWithContacts = IOrgUnit & {
  contacts: IContact[];
};

/** Một nút trong cây tổ chức */
export interface IOrgNode {
  cluster: ICluster;
  roles: {
    role: IOrgRole;
    units: IOrgUnitWithContacts[];
  }[];
}

/** Meta dữ liệu mock */
export interface IOrgChartMeta {
  generatedAt?: string;
  sourceSyncedAt?: string;
  cacheHit?: boolean;
  sources?: string[];
}

/** Dữ liệu toàn bộ tab Org Chart */
export interface IOrgChartDashboard {
  clusters: ICluster[];
  orgTree: IOrgNode[];
  generatedAt: string;
  meta?: IOrgChartMeta;
}

/** Response dạng mock theo `src/mocks/org-chart.json` */
export interface IOrgChartMockResponse {
  success: boolean;
  data: Omit<IOrgChartDashboard, 'meta'>;
  meta?: IOrgChartMeta;
}
