import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { portfolioService } from '../../services/api';

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await portfolioService.get();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
    lastUpdated: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default portfolioSlice.reducer;
