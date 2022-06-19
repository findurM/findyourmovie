import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Application";

export const fetchLikeMovies = createAsyncThunk(
  'likeMovies/fetchLikeMovies',
  async () => {
    const likeRef = doc(db, "users", JSON.parse(localStorage.getItem('user')).uid, "likeMovies", "movies");
    const likeSnap = await getDoc(likeRef);
    const result = likeSnap.data();
    return result === undefined ? [] : result.moviesArray.reverse();
  }
)

export interface LikeMoviesState {
  likeMovies : Number[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: LikeMoviesState = {
  likeMovies : [],
  loading: 'idle',
}

export const likeMoviesSlice = createSlice({
  name: 'likeMovies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchLikeMovies.pending.type, (state) => {
      state.loading = 'pending';
    })
    .addCase(fetchLikeMovies.fulfilled.type, (state, action: PayloadAction<Number[]>) => {
      state.likeMovies = action.payload
      state.loading = 'succeeded';
    })
    .addCase(fetchLikeMovies.rejected.type, (state) => {
      state.loading = 'failed';
    })
  }
})

export default likeMoviesSlice.reducer;