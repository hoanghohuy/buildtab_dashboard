import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/** @description Typed dispatch hook */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/** @description Typed selector hook */
export const useAppSelector = useSelector.withTypes<RootState>();
