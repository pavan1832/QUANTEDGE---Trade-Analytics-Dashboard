import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { marketDataService } from '../../services/api';

export const fetchMarketData = createAsyncThunk(
  'marketData/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await marketDataService.getAll();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchSymbolDetail = createAsyncThunk(
  'marketData/fetchSymbol',
  async (symbol, { rejectWithValue }) => {
    try {
      const res = await marketDataService.getBySymbol(symbol);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const marketDataSlice = createSlice({
  name: 'marketData',
  initialState: {
    symbols: [],
    selectedSymbol: null,
    selectedSymbolData: null,
    status: 'idle',
    symbolStatus: 'idle',
    error: null,
    lastUpdated: null,
  },
  reducers: {
    setSelectedSymbol(state, action) {
      state.selectedSymbol = action.payload;
      state.selectedSymbolData = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.symbols = action.payload;
        state.lastUpdated = new Date().toISOString();
        // Auto-select first symbol if none selected
        if (!state.selectedSymbol && action.payload.length > 0) {
          state.selectedSymbol = action.payload[0].symbol;
        }
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchSymbolDetail.pending, (state) => {
        state.symbolStatus = 'loading';
      })
      .addCase(fetchSymbolDetail.fulfilled, (state, action) => {
        state.symbolStatus = 'succeeded';
        state.selectedSymbolData = action.payload;
      })
      .addCase(fetchSymbolDetail.rejected, (state, action) => {
        state.symbolStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSelectedSymbol, clearError } = marketDataSlice.actions;
export default marketDataSlice.reducer;
