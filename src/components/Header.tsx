import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth';
import {deleteUserInfo} from '../features/userSlice'
import { RootState } from '../app/store';
import {User} from '../features/userSlice'
import { CgProfile } from "react-icons/cg";
import { setCategory } from '../features/mypageCategorySlice';

interface Props {}

const Header = () => {
  
  const userInfo = useSelector<RootState, User>((state) => state.user)
  const auth = getAuth();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {

  }, [userInfo]);

  const profileClick = () => {
    navigate("/mypage/recent-records");
    localStorage.setItem('mypageCategory', "recent-records");
    dispatch(setCategory("recent-records"));
  }

  return (
    <div className="navbar bg-base-100 h-20 sticky top-0 z-[1000]">
      <div className="flex-1">
        <Link to='/' className="btn btn-ghost normal-case text-xl"><img src="/assets/Findurm_regular_logo.png" alt="FindurM Logo"/></Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0 items-center">
          {userInfo.email !='' ? 
          (
            <>
              {auth.currentUser.photoURL ?
              <img src={auth.currentUser.photoURL} className="w-9 h-9 mr-2.5 cursor-pointer rounded-full" 
                onClick={profileClick}/>
              : <CgProfile size={36} className="mr-2.5 cursor-pointer" 
                onClick={profileClick}/>}
              <button className='btn rounded-pill text-xl' onClick={() => {
                localStorage.removeItem('user')
                console.log(userInfo)
                dispatch(deleteUserInfo())
                signOut(auth)
                navigate('/')
                }}>로그아웃</button>
            </>
          )
          : (
            <>
              <li><Link to='/login'>로그인</Link></li>
              <li><Link to='/register'>회원가입</Link></li>
            </>   
          )}
      </ul>
    </div>
  </div>
  )
}

export default Header