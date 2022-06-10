import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  email: string | null,
}

export interface User {
  email:string
}

const initialState:InitialState = {
  email: JSON.parse(localStorage.getItem('user')) || ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo : (state,action: PayloadAction<User>) => {
      if(state != null) {
        state.email = action.payload.email
      }
    },
    deleteUserInfo : (state) => {
      state.email = ''
    }
  }

})

export const { setUserInfo,deleteUserInfo } = userSlice.actions

export default userSlice.reducer
