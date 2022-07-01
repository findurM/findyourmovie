import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_KEY, API_URL } from "../config/config";

export const fetchWathProvider = createAsyncThunk(
  'wathProvider/fetchwathProvider',
  async (movieId: string) => {
    const res = await fetch(`${API_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
    const results = await res.json();
    return results.results;
  }
)

interface WatchProviders {
  // id: number,

}

export interface WatchProvidersState {
  wathProvider: WatchProviders[],
  loading: 'idle' | 'pending' | 'succeeded' | 'failed',
}

const initialState: WatchProvidersState = {
  wathProvider : [],
  loading: 'idle',
}

export const trailerSlice = createSlice({
  name: 'trailer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchWathProvider.pending.type, (state) => {
      state.loading = 'pending';
    })
    .addCase(fetchWathProvider.fulfilled.type, (state, action: PayloadAction<WatchProvidersState[]>) => {
      state.wathProvider = action.payload
      state.loading = 'succeeded';
    })
    .addCase(fetchWathProvider.rejected.type, (state) => {
      state.loading = 'failed';
    })
  }
})

export default trailerSlice.reducer;