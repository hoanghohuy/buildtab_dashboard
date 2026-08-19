/** @description Chu kỳ refresh cho từng widget (ms) — port từ §11.6 */
export const REFRESH_INTERVALS = {
  KPI_STRIP: 5 * 60_000,
  DOCUMENT_PROGRESS: 15 * 60_000,
  PACKAGE_STATUS: 15 * 60_000,
  UNIT_RANKING: 15 * 60_000,
  RISKS: 10 * 60_000,
  SITE_PHOTOS: 5 * 60_000,
  MAP_LAYERS: 30 * 60_000,
  MILESTONES: 60 * 60_000,
  ORG_CHART: 6 * 60 * 60_000,
  FINANCE: 30 * 60_000,
  CONTRACTOR_HEALTH: 60 * 60_000,
} as const;
