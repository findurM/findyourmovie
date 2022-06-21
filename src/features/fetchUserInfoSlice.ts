import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Application";

export const fetchUserInfo = createAsyncThunk(
  'userInfo/fetchUserInfo',
  async () => {
    const userRef = doc(db, "users", JSON.parse(localStorage.getItem('user')).uid);
    const userSnap = await getDoc(userRef);
    return userSnap.data() as CurrentUserInfo;
  }
)

export const isExistUserInfo = createAsyncThunk(
  'userInfo/isExistUserInfo',
  async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();
    return data && data.age !== undefined && data.sex !== undefined;
  }
)

export interface CurrentUserInfo {
  email: string,
  id: string,
  nickname: string,
  profileImg: string,
  age: number,
  sex: string
}

export interface UserInfoState {
  userInfo : CurrentUserInfo
  isExist?: boolean
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: UserInfoState = {
  userInfo : {
    email: "",
    id: "",
    nickname: "",
    profileImg: "",
    age: 0,
    sex: ""
  },
  loading: 'idle',
}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchUserInfo.pending.type, (state) => {
      state.loading = 'pending';
    })
    .addCase(fetchUserInfo.fulfilled.type, (state, action: PayloadAction<CurrentUserInfo>) => {
      state.userInfo = action.payload
      state.loading = 'succeeded';
    })
    .addCase(fetchUserInfo.rejected.type, (state) => {
      state.loading = 'failed';
    })
    .addCase(isExistUserInfo.fulfilled.type, (state, action: PayloadAction<boolean>) => {
      state.isExist = action.payload
    })
  }
})

export default userInfoSlice.reducer