import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";
import GridCards from "../components/GridCards";
import { MypageGridArea, MypageTitle } from "../components/SideMenu";
import { IMAGE_URL } from "../config/config";
import { fetchMovieImages, MovieImagesState, resetMovieImages } from "../features/fetchMovieImagesSlice";
import { fetchRecentRecords, RecentRecordsState } from "../features/fetchRecentRecordsSlice";
import { fetchUserInfo, UserInfoState } from "../features/fetchUserInfoSlice";

const RecentRecords = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo: currentUserInfo, loading: currentUserInfoLoading } = useSelector<RootState, UserInfoState>(
    (state) => state.userInfo,
  );
  const { movieImages, loading: movieImagesLoading } = useSelector<RootState, MovieImagesState>(
    (state) => state.movieImages,
  );
  const { recentRecords, loading: recentRecordsLoading } = useSelector<RootState, RecentRecordsState>(
    (state) => state.recentRecords,
  );

  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(fetchRecentRecords());
  }, []);

  useEffect(() => {
    if (recentRecordsLoading === "succeeded") {
      dispatch(resetMovieImages());
      if (recentRecords.length > 0) {
        recentRecords.forEach((movieId: Number) => {
          dispatch(fetchMovieImages(movieId));
        });
      }
    }
  }, [recentRecordsLoading]);

  if (
    currentUserInfoLoading !== "succeeded" ||
    movieImagesLoading !== "succeeded" ||
    recentRecordsLoading !== "succeeded"
  )
    return <div>Loading...</div>;

  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-[3.75rem]">
          <MypageTitle>{currentUserInfo?.nickname} 님의 최근 검색한 기록</MypageTitle>
          <p className="text-base mt-4">최대 20개까지 저장</p>
        </div>
        {recentRecords.length === 0 ? (
          <div>최근 검색한 영화가 없습니다.</div>
        ) : (
          <MypageGridArea>
            {movieImages &&
              movieImages.map(({ movieId, poster }, index) => (
                <Link to={`/movies/${movieId}`} key={index} className="w-full h-full">
                  <GridCards image={poster ? `${IMAGE_URL}w500${poster}` : null} alt={String(movieId)} />
                </Link>
              ))}
          </MypageGridArea>
        )}
      </section>
    </>
  );
};

export default RecentRecords;
