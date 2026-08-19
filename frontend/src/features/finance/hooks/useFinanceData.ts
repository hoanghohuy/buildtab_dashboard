import useSWR from 'swr'

import financeMockRaw from '@/mocks/finance.json'
import { REFRESH_INTERVALS } from '@/shared/constants/REFRESH_INTERVALS'

import type { IFinanceDashboard } from '../types/finance.types'

interface IFinanceMockRaw {
  success: boolean
  data: IFinanceDashboard
  meta?: {
    generatedAt?: string
  }
}

export interface IUseFinanceDataResult {
  data: IFinanceDashboard | undefined
  isLoading: boolean
  error: Error | undefined
  /**
   * Dữ liệu mock quá cũ (so với chu kỳ refresh) để widget hiển thị trạng thái "Dữ liệu cũ".
   * Trên production sẽ dựa timestamp từ BFF/CDE/ERP.
   */
  isStale: boolean
  refresh: () => void
}

/**
 * Lấy dữ liệu Tab 3 — Tài chính.
 * Ở giai đoạn V0, dùng mock `src/mocks/finance.json` để render đúng 6 widget theo V0.
 */
export function useFinanceData(): IUseFinanceDataResult {
  const financeMock = financeMockRaw as IFinanceMockRaw

  const { data, error, isLoading, mutate } = useSWR<IFinanceDashboard, Error>(
    ['finance-dashboard'],
    async () => {
      // Mock: không cần request mạng
      return financeMock.data
    },
    {
      refreshInterval: REFRESH_INTERVALS.FINANCE,
      keepPreviousData: true,
      revalidateOnFocus: false,
      errorRetryCount: 5,
      errorRetryInterval: 10_000,
    },
  )

  const generatedAt = financeMock.meta?.generatedAt
  const isStale = Boolean(
    generatedAt && Date.now() - new Date(generatedAt).getTime() > REFRESH_INTERVALS.FINANCE * 2,
  )

  return {
    data,
    isLoading,
    error,
    isStale,
    refresh: () => void mutate(),
  }
}

