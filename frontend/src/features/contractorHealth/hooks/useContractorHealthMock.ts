import useSWR from 'swr';

import contractorHealthMockRawImport from '@/mocks/contractor-health.json';

import type { IContractorHealthDashboard } from '../types/contractorHealth.types';

interface IContractorHealthMockRaw {
  success: boolean;
  data: IContractorHealthDashboard;
}

const CONTRACTOR_HEALTH_MOCK_KEY = 'contractor-health:mock';

const contractorHealthMockRaw = contractorHealthMockRawImport as IContractorHealthMockRaw;
const contractorHealthMock = contractorHealthMockRaw.data;

/**
 * Lấy dữ liệu dashboard "Sức khỏe nhà thầu/tư vấn" từ mock JSON.
 *
 * Lưu ý: mặc dù là mock nhưng dùng SWR để đồng bộ flow dữ liệu theo chuẩn kiosk.
 */
export function useContractorHealthMock(): {
  dashboard: IContractorHealthDashboard;
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useSWR<IContractorHealthDashboard>(
    CONTRACTOR_HEALTH_MOCK_KEY,
    async () => contractorHealthMock,
    {
      fallbackData: contractorHealthMock,
      revalidateOnFocus: false,
    },
  );

  return {
    dashboard: data ?? contractorHealthMock,
    isLoading,
    error: error instanceof Error ? error : null,
  };
}

