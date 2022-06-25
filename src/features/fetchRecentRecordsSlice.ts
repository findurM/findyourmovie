import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Application";

export const fetchRecentRecords = createAsyncThunk(
  'recentRecords/fetchRecentRecords',
  async () => {
    const recordRef = doc(db, "users", JSON.parse(localStorage.getItem('user')).uid, "recentRecords", "movies");
    const recordSnap = await getDoc(recordRef);
    const result = recordSnap.data();
    return result.movieArray.reverse() || [];
  }
)

export interface RecentRecordsState {
  recentRecords : Number[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: RecentRecordsState = {
  recentRecords : [],
  loading: 'idle',
}

export const recentRecordsSlice = createSlice({
  name: 'recentRecords',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchRecentRecords.pending.type, (state) => {
      state.loading = 'pending';
    })
    .addCase(fetchRecentRecords.fulfilled.type, (state, action: PayloadAction<Number[]>) => {
      state.recentRecords = action.payload
      state.loading = 'succeeded';
    })
    .addCase(fetchRecentRecords.rejected.type, (state) => {
      state.loading = 'failed';
    })
  }
})

export default recentRecordsSlice.reducer;