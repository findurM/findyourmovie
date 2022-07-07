import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_KEY, API_URL } from "../config/config";

export const fetchMovieDetails = createAsyncThunk("movieDetails/fetchMovieDetails", async (movieId: Number) => {
  const res = await fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko`);
  const results = await res.json();
  const details = {
    movieTitle: results.original_title,
    movieGenres: results.genres,
    moviePoster: results.poster_path,
    movieImage: results.backdrop_path,
    movieRelease: results.release_date,
    movieLanguage: results.spoken_languages[0].name,
    movieRuntime: results.runtime,
    movieOverview: results.overview,
    movieRate: results.vote_average,
  };
  return details;
});

export interface MovieDetails {
  id?: number;
  title?: string;
  poster_path?: string | null;
  movieTitle: string;
  movieGenres: [{ id: number; name: string }];
  moviePoster: string | null;
  movieImage: string;
  movieRelease: string;
  movieLanguage: string;
  movieRuntime: number | null;
  movieOverview: string | null;
  movieRate: number;
}

export interface MovieDetailsState {
  movieDetails: MovieDetails;
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: MovieDetailsState = {
  movieDetails: {
    movieTitle: "",
    movieGenres: [{ id: 0, name: "" }],
    moviePoster: null,
    movieImage: "",
    movieRelease: "",
    movieLanguage: "",
    movieRuntime: null,
    movieOverview: null,
    movieRate: 0,
  },
  loading: "idle",
};

export const movieDetailsSlice = createSlice({
  name: "movieDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovieDetails.pending.type, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchMovieDetails.fulfilled.type, (state, action: PayloadAction<MovieDetails>) => {
        state.movieDetails = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchMovieDetails.rejected.type, (state) => {
        state.loading = "failed";
      });
  },
});

export default movieDetailsSlice.reducer;
