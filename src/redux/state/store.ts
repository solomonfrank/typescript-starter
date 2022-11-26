import { combineReducers, configureStore } from "@reduxjs/toolkit";
import repositoriesReducer from "./reducers/repositories";

const reducers = combineReducers({ repositories: repositoriesReducer });
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reducers>;

export type AppDispatch = typeof store.dispatch;
