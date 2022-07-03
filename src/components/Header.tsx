import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { deleteUserInfo } from "../features/userSlice";
import { AppDispatch, RootState } from "../app/store";
import { User } from "../features/userSlice";
import { CgProfile } from "react-icons/cg";
import { setCategory } from "../features/mypageCategorySlice";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { deleteCurrentUserInfo, fetchUserInfo, UserInfoState } from "../features/fetchUserInfoSlice";
import { BsSearch } from "react-icons/bs";
import { API_URL, API_KEY } from "../config/config";
import { setSearchResult } from "../features/searchResultSlice";

interface Props {}

const Header = () => {
  const localStorageUserInfo = JSON.parse(localStorage.getItem("user"));
  const userInfo = useSelector<RootState, User>((state) => state.user);
  const auth = getAuth();
  const [url, setUrl] = useState<string>();
  const [isSearchbarOpen, setIsSearchbarOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userInfo: currentUserInfo, loading: currentUserInfoLoading } = useSelector<RootState, UserInfoState>(
    (state) => state.userInfo,
  );

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, []);

  useEffect(() => {
    if (
      currentUserInfo &&
      currentUserInfo.profileImg !== "" &&
      !currentUserInfo.profileImg.includes("googleusercontent.com")
    ) {
      imageDownload(currentUserInfo.profileImg);
    } else if (currentUserInfo?.profileImg.includes("googleusercontent.com")) {
      setUrl(currentUserInfo?.profileImg);
    } else {
      setUrl("/assets/defaultImage.png");
    }
  }, [currentUserInfo]);

  const profileClick = () => {
    navigate("/mypage/recent-records");
    localStorage.setItem("mypageCategory", "recent-records");
    dispatch(setCategory("recent-records"));
  };

  const imageDownload = (fileName: string) => {
    const storage = getStorage();
    getDownloadURL(ref(storage, "images/" + fileName))
      .then((url) => {
        setUrl(url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openSearch = () => {
    setIsSearchbarOpen(!isSearchbarOpen);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchRef.current.value;
    const endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=ko-KR&page=1&query=${query}`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((response) => dispatch(setSearchResult(response.results)));
    navigate("/search");
    searchRef.current.value = "";
  };

  return (
    <div className="navbar bg-base-100 h-20 sticky top-0 z-[1000]">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <img src="/assets/FindurM_regular_logo.png" alt="FindurM Logo" />
        </Link>
        {userInfo.email &&
        <form className="flex focus:outline-primary" onSubmit={onSubmit}>
          <div className="btn bg-transparent border-0 text-black hover:bg-primary" onClick={openSearch}>
            <BsSearch size={20} />
          </div>
          {isSearchbarOpen && (
            <input
              type="search"
              placeholder="영화를 검색하세요"
              className="input input-bordered h-12 focus:outline-none"
              ref={searchRef}
            />
          )}
        </form>}
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0 items-center">
          {userInfo.email != "" ? (
            <>
              {currentUserInfo?.profileImg !== "" ? (
                <img
                  src={url}
                  className="w-9 h-9 mr-2.5 object-cover cursor-pointer rounded-full border border-black"
                  onClick={profileClick}
                />
              ) : (
                <CgProfile size={36} className="mr-2.5 cursor-pointer" onClick={profileClick} />
              )}

              <button
                className="btn rounded-pill text-xl"
                onClick={() => {
                  localStorage.removeItem("user");
                  dispatch(deleteUserInfo());
                  dispatch(deleteCurrentUserInfo());
                  signOut(auth);
                  navigate("/");
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">로그인</Link>
              </li>
              <li>
                <Link to="/register">회원가입</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
