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

export interface ProviderInfo {
  display_priority?: number,
  logo_path?: string,
  provider_id?: number,
  provider_name?: string
}

export interface WatchProviders {
  id: number,
  results: {link: number,
            flatrate?: ProviderInfo[],
            rent?: ProviderInfo[],
            buy?: ProviderInfo[]
          }
}

export interface WatchProvidersState {
  wathProvider: WatchProviders,
  loading: 'idle' | 'pending' | 'succeeded' | 'failed',
}

const initialState: WatchProvidersState = {
  wathProvider: {
    id: 0,
    results: {
      link: 0,
      flatrate: [{display_priority: 0,
                  logo_path: "",
                  provider_id: 0,
                  provider_name: ""}],
      rent: [{display_priority: 0,
              logo_path: "",
              provider_id: 0,
              provider_name: ""}],
      buy: [{display_priority: 0,
            logo_path: "",
            provider_id: 0,
            provider_name: ""}],
    }
  },
  loading: 'idle',
}

export const watchProviderSlice = createSlice({
  name: 'watchProvider',
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

export default watchProviderSlice.reducer;