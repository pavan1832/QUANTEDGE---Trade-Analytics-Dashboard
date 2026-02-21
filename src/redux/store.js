import { configureStore } from '@reduxjs/toolkit';
import marketDataReducer from './slices/marketDataSlice';
import portfolioReducer from './slices/portfolioSlice';
import tradesReducer from './slices/tradesSlice';

const store = configureStore({
  reducer: {
    marketData: marketDataReducer,
    portfolio: portfolioReducer,
    trades: tradesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['marketData/fetchAll/fulfilled'],
      },
    }),
});

export default store;
