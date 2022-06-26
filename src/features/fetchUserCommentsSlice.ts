import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Application";
import { API_KEY, API_URL } from "../config/config";

export const fetchUserComments = createAsyncThunk(
  'userComments/fetchUserComments',
  async () => {
    const userCommentRef = doc(db, 'users', JSON.parse(localStorage.getItem('user')).uid, 'movieComments', 'comments')
    const userCommentSnap = await getDoc(userCommentRef);
    const result = userCommentSnap.data();
    return result ? result.commentsArray.reverse() : [];
  }
)

export const fetchMypageUserComments = createAsyncThunk(
  'userComments/fetchMypageUserComments',
  async (userComments: UserComment) => {
    const res = await fetch(`${API_URL}/movie/${userComments.movieId}?api_key=${API_KEY}&language=ko`);
    const data = await res.json();
    const mypageComment = {
      comment: userComments.comment,
      movieId: userComments.movieId,
      rate: userComments.rate,
      backdrop: data.backdrop_path,
      title: data.title,
    };
    return mypageComment;
  }
)

export interface UserComment {
  comment: string
  movieId: number
  rate: number
}

export interface MypageUserComment {
  comment: string
  movieId: number
  rate: number
  backdrop: string
  title: string
}

export interface UserCommentsState {
  userComments: UserComment[]
  mypageUserComments: MypageUserComment[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed',
}

const initialState: UserCommentsState = {
  userComments : [],
  mypageUserComments: [],
  loading: 'idle',
}

export const userCommentsSlice = createSlice({
  name: 'userComments',
  initialState,
  reducers: {
    resetMypageUserComments: (state) => {
      state.mypageUserComments = [];
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchUserComments.pending.type, (state) => {
      state.loading = 'pending';
    })
    .addCase(fetchUserComments.fulfilled.type, (state, action: PayloadAction<UserComment[]>) => {
      state.userComments = action.payload
      state.loading = 'succeeded';
    })
    .addCase(fetchUserComments.rejected.type, (state) => {
      state.loading = 'failed';
    })
    .addCase(fetchMypageUserComments.fulfilled.type, (state, action: PayloadAction<MypageUserComment>) => {
      state.mypageUserComments = [...state.mypageUserComments, action.payload];
    })
  }
})

export const { resetMypageUserComments } = userCommentsSlice.actions;

export default userCommentsSlice.reducer;