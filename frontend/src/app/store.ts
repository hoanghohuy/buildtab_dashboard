import { configureStore } from '@reduxjs/toolkit';
import { kioskReducer } from '@/features/kiosk/slices/kioskSlice';

export const store = configureStore({
  reducer: {
    kiosk: kioskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
