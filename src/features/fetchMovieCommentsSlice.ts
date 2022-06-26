import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Application";
import { CommentsInput } from "../pages/DetailedPages";

export const fetchMovieComments = createAsyncThunk(
  'movieComments/fetchMovieComments',
  async (movieId: string) => {
    const movieCommentRef = doc(db, 'movies', movieId)
    const movieCommentsSnap = await getDoc(movieCommentRef);
    const result = movieCommentsSnap.data();
    return result ? result.comments.reverse() : [];
  }
)

export interface MovieCommentsState {
  movieComments: CommentsInput[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed',
}

const initialState: MovieCommentsState = {
  movieComments : [],
  loading: 'idle',
}

export const movieCommentsSlice = createSlice({
  name: 'movieComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchMovieComments.pending.type, (state) => {
      state.loading = 'pending';
    })
    .addCase(fetchMovieComments.fulfilled.type, (state, action: PayloadAction<CommentsInput[]>) => {
      state.movieComments = action.payload
      state.loading = 'succeeded';
    })
    .addCase(fetchMovieComments.rejected.type, (state) => {
      state.loading = 'failed';
    })
  }
})

export default movieCommentsSlice.reducer;