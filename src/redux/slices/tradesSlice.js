import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tradesService } from '../../services/api';

export const fetchTrades = createAsyncThunk(
  'trades/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await tradesService.getAll(params);
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const tradesSlice = createSlice({
  name: 'trades',
  initialState: {
    items: [],
    meta: { total: 0, limit: 20, offset: 0 },
    filters: { symbol: '', side: '', status: '' },
    status: 'idle',
    error: null,
  },
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = { symbol: '', side: '', status: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrades.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTrades.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchTrades.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setFilter, clearFilters } = tradesSlice.actions;
export default tradesSlice.reducer;
