import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export type Movie = {
    adult: boolean
    backdrop_path: string
    genre_ids: number[]
    id: number
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    release_date: string
    title: string
    video: false
    vote_average: number
    vote_count: number
}

interface InitialState {
    value: Movie[]
}

const initialState:InitialState = {
    value: []
}

export const searchResultSlice = createSlice({
  name: 'searchResult',
  initialState,
  reducers: {
    setSearchResult: (state,action) => {
        state.value = action.payload
    }
  }

})

export const { setSearchResult } = searchResultSlice.actions

export default searchResultSlice.reducer