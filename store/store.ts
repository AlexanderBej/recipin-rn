// store/store.ts (in the RN project)
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import authReducer from './auth-store/auth.slice';
import groceryReducer from './grocery-store/grocery.slice';
import plannerReducer from './planner-store/planner.slice';
import recipesReducer from './recipes-store/recipes.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  recipes: recipesReducer,
  planner: plannerReducer,
  grocery: groceryReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // tweak middleware if you have Firestore Timestamps or other non-serializables
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // or keep it true and configure ignoredPaths/actions like you did before
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;