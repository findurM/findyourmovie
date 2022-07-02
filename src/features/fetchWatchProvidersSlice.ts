import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_KEY, API_URL } from "../config/config";

export const fetchWatchProviders = createAsyncThunk("watchProviders/watchProvidersSlice", async (movieId: Number) => {
  const res = await fetch(`${API_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
  const results = await res.json();
  return results.results["KR"]["rent"];
});

export interface WatchProviders {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface WatchProvidersState {
  watchProviders: WatchProviders[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: WatchProvidersState = {
  watchProviders: [],
  loading: "idle",
};

export const watchProvidersSlice = createSlice({
  name: "watchProviders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchProviders.pending.type, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchWatchProviders.fulfilled.type, (state, action: PayloadAction<WatchProviders[]>) => {
        state.watchProviders = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchWatchProviders.rejected.type, (state) => {
        state.watchProviders = [];
        state.loading = "failed";
      });
  },
});

export default watchProvidersSlice.reducer;
