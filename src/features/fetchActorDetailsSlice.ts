import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_KEY, API_URL } from "../config/config";

export const fetchActorDetails = createAsyncThunk(
  'actorDetails/fetchActorDetails',
  async (movieId: Number) =>{
    const res = await fetch(`${API_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`)
    const results = await res.json()
    return {actors: results.cast, director: {name: results.crew[0].name}};
  }
)

export interface ActorInfo {
  adult: boolean
  cast_id: number
  character: string
  credit_id: string
  gender: number
  id: number
  known_for_department: string
  name: string
  order: number
  original_name: string
  popularity: number
  profile_path: string
}

interface DirectorInfo {
  name: string
}

export interface ActorDetailsState {
  actors : ActorInfo[],
  director: DirectorInfo,
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: ActorDetailsState = {
  actors : [],
  director: {name: ""},
  loading: 'idle',
}

export const actorDetailsSlice = createSlice({
  name: 'actorDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchActorDetails.pending.type, (state) => {
      state.loading = 'pending';
    })
    .addCase(fetchActorDetails.fulfilled.type, (state, action: PayloadAction<{actors: ActorInfo[], director: DirectorInfo}>) => {
      state.actors = action.payload.actors;
      state.director = action.payload.director;
      state.loading = 'succeeded';
    })
    .addCase(fetchActorDetails.rejected.type, (state) => {
      state.loading = 'failed';
    })
  }
})

export default actorDetailsSlice.reducer;