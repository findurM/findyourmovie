import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";
import { CurrentUserInfo, db } from "../Application";
import GridCards from "../components/GridCards";
import { IMAGE_URL } from "../config/config";
import { fetchMovieImages, MovieImagesState, resetMovieImages } from "../features/fetchMovieImagesSlice";

const RecentRecords = () => {

  const localStorageUserInfo = JSON.parse(localStorage.getItem('user'))
  const [currentUserInfo, setCurrentUserInfo] = useState<CurrentUserInfo>();
  const [recentRecords, setRecentRecords] = useState<Number[]>();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const {movieImages, loading} = useSelector<RootState, MovieImagesState>((state) => state.movieImages);

  const getUserInfo = async () => {
    const userRef = doc(db, "users", localStorageUserInfo.uid);
    const userSnap = await getDoc(userRef);
    setCurrentUserInfo((userSnap.data() as CurrentUserInfo));
  }

  const getRecentRecords = async () => {
    const recordRef = doc(db, "users", localStorageUserInfo.uid, "recentRecords", "movies");
    const recordSnap = await getDoc(recordRef);
    setRecentRecords((recordSnap.data().movieArray as Number[]));
  }

  useEffect(() => {
    getUserInfo();
    getRecentRecords()
    .then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    dispatch(resetMovieImages());
    if(recentRecords !== null && recentRecords !== undefined) {
      recentRecords.reverse().forEach((movieId: Number) => {
        dispatch(fetchMovieImages(movieId));
      })
    }
  }, [recentRecords])

  if(isLoading) return <div>Loading...</div>

  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-[3.75rem]">
          <h2 className="text-5xl font-bold">{currentUserInfo?.nickname} 님의 최근 검색한 기록</h2>
          <p className="mt-4">최대 20개까지 저장</p>
        </div>
        {recentRecords === null || recentRecords === undefined
        ? (<div>최근 검색한 영화가 없습니다.</div>)
        : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-5 m-auto">
        {movieImages && movieImages.map(({movieId, poster}, index) => (
          <Link to={`/movies/${movieId}`} key={index} className="w-full h-full">
            <GridCards 
              image={poster.file_path ? `${IMAGE_URL}w500${poster.file_path}`: null}
              alt={String(movieId)}
            />
          </Link>
                ))}
        </div>)}
      </section>
    </>
  )
};

export default RecentRecords;