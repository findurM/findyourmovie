import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import { config } from './config/config'
import tw from "tailwind-styled-components"
import Header from './components/Header'
import AuthRoute from './components/AuthRoute'
import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import SideMenu from './components/SideMenu'
import RecentRecords from './pages/RecentRecords'
import MyLikes from './pages/MyLikes'
import MyReviews from './pages/MyReviews'
import MyInfo from './pages/MyInfo'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {getFirestore} from '@firebase/firestore'
import MovieListPage from './pages/MovieListPage'
import TvshowListPage from './pages/TvshowListPage'
import DetailedPages from './pages/DetailedPages'

initializeApp(config.firebaseConfig);
export const db = getFirestore()

export interface IApplicationProps {}

export interface UserInfo {
  email: string,
  id: string,
  nickname: string
}

const App = tw.div`
min-h-screen
`

const Application: React.FunctionComponent<IApplicationProps> = (props) => {
  return (
    <App>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/"
            element={
              <AuthRoute>
                <HomePage />
              </AuthRoute>
            }
          />
          <Route path="/movies/:id" element={<DetailedPages/>}/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/movielist' element={<MovieListPage/>}/>
          <Route path='/tvshowlist' element={<TvshowListPage/>}/>
          <Route path="/mypage" element={<SideMenu/>}>
            <Route path="recent-records" element={<RecentRecords/>}/>
            <Route path="my-likes" element={<MyLikes/>}/>
            <Route path="my-reviews" element={<MyReviews/>}/>
            <Route path="my-info" element={<MyInfo/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </App>
  );
};

export default Application;
