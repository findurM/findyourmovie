import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { useLocation } from "react-router-dom";

interface InitialState {
  category: string | null,
}

export interface MypageCategory {
  category: string
}

const initialState: InitialState = {
  category: localStorage.getItem('mypageCategory') || 'recent-records'
}

export const mypageCategorySlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCategory: (state,action) => {
      state.category = action.payload
    },
  }
})

export const { setCategory } = mypageCategorySlice.actions

export default mypageCategorySlice.reducer