import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** 4 tab chính của dashboard */
export type TDashboardTab = 'overview' | 'orgChart' | 'finance' | 'contractorHealth';

/** State quản lý chế độ kiosk / xoay tab tự động */
export interface IKioskState {
  isKioskMode: boolean;
  isRotating: boolean;
  activeTab: TDashboardTab;
  rotationDurations: Record<TDashboardTab, number>;
  pausedUntil: number | null;
  anonymizeUnits: boolean;
  isPerfMode: boolean;
}

const initialState: IKioskState = {
  isKioskMode: true,
  isRotating: true,
  activeTab: 'overview',
  rotationDurations: {
    overview: 60,
    orgChart: 40,
    finance: 45,
    contractorHealth: 45,
  },
  pausedUntil: null,
  anonymizeUnits: false,
  isPerfMode: false,
};

const kioskSlice = createSlice({
  name: 'kiosk',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<TDashboardTab>) {
      state.activeTab = action.payload;
    },
    pauseRotation(state, action: PayloadAction<number>) {
      state.isRotating = false;
      state.pausedUntil = action.payload;
    },
    resumeRotation(state) {
      state.isRotating = true;
      state.pausedUntil = null;
    },
    toggleAnonymize(state) {
      state.anonymizeUnits = !state.anonymizeUnits;
    },
    setPerfMode(state, action: PayloadAction<boolean>) {
      state.isPerfMode = action.payload;
    },
  },
});

export const {
  setActiveTab,
  pauseRotation,
  resumeRotation,
  toggleAnonymize,
  setPerfMode,
} = kioskSlice.actions;

export const kioskReducer = kioskSlice.reducer;
