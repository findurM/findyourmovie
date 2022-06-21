import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";
import GridCards from "../components/GridCards";
import { IMAGE_URL } from "../config/config";
import { fetchMovieImages, MovieImagesState, resetMovieImages } from "../features/fetchMovieImagesSlice";
import { fetchRecentRecords, RecentRecordsState } from "../features/fetchRecentRecordsSlice";
import { fetchUserInfo, UserInfoState } from "../features/fetchUserInfoSlice";

const RecentRecords = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {userInfo: currentUserInfo, loading: currentUserInfoLoading} = useSelector<RootState, UserInfoState>((state) => state.userInfo);
  const {movieImages, loading: movieImagesLoading} = useSelector<RootState, MovieImagesState>((state) => state.movieImages);
  const {recentRecords, loading: recentRecordsLoading} = useSelector<RootState, RecentRecordsState>((state) => state.recentRecords);

  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(fetchRecentRecords());
  }, []);

  useEffect(() => {
    if(recentRecordsLoading === 'succeeded' && recentRecords.length > 0) {
      dispatch(resetMovieImages());
      recentRecords.forEach((movieId: Number) => {
        dispatch(fetchMovieImages(movieId));
      })
    }
  }, [recentRecordsLoading])

  if(currentUserInfoLoading !== 'succeeded' || movieImagesLoading !== 'succeeded' || recentRecordsLoading !== 'succeeded') return <div>Loading...</div>

  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-[3.75rem]">
          <h2 className="text-5xl font-bold">{currentUserInfo?.nickname} 님의 최근 검색한 기록</h2>
          <p className="mt-4">최대 20개까지 저장</p>
        </div>
        {recentRecords.length === 0
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