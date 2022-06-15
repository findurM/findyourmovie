import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "./searchResultSlice";


interface InitialState {
    value: Movie[]
}

const initialState:InitialState = {
    value: []
}

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setCurrentMovie: (state,action) => {
        state.value = action.payload
    }
  }

})

export const { setCurrentMovie } = movieSlice.actions

export default movieSlice.reducer
