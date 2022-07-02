import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";
import { LikeGridCards } from "../components/GridCards";
import { MypageGridArea, MypageTitle } from "../components/SideMenu";
import { IMAGE_URL } from "../config/config";
import { fetchLikeMovies, LikeMoviesState, resetLikeMovies } from "../features/fetchLikeMoviesSlice";
import { fetchMovieImages, MovieImagesState, resetMovieImages } from "../features/fetchMovieImagesSlice";
import { fetchUserInfo, UserInfoState } from "../features/fetchUserInfoSlice";

const MyLikes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [total, setTotal] = useState(6);
  const [isFinish, setIsFinish] = useState(false);
  const { userInfo: currentUserInfo, loading: currentUserInfoLoading } = useSelector<RootState, UserInfoState>(
    (state) => state.userInfo,
  );
  const { movieImages, loading: movieImagesLoading } = useSelector<RootState, MovieImagesState>(
    (state) => state.movieImages,
  );
  const { likeMovies, loading: likeMoviesLoading } = useSelector<RootState, LikeMoviesState>(
    (state) => state.likeMovies,
  );

  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(resetLikeMovies());
  }, []);

  useEffect(() => {
    if (likeMoviesLoading === "idle") {
      dispatch(fetchLikeMovies());
    } else if (likeMoviesLoading === "succeeded") {
      dispatch(resetMovieImages());
      if (likeMovies.length > 0) {
        if (total >= likeMovies.length) {
          setTotal(() => likeMovies.length);
          setIsFinish(true);
        }
        likeMovies.slice(0, total).forEach((movieId: Number) => {
          dispatch(fetchMovieImages(movieId));
        });
      }
    }
  }, [likeMoviesLoading]);

  const morePosters = () => {
    if (total + 6 >= likeMovies.length) setIsFinish(() => true);

    likeMovies.slice(total, isFinish ? likeMovies.length : total + 6).forEach((movieId: Number) => {
      dispatch(fetchMovieImages(movieId));
    });

    setTotal(() => {
      return isFinish ? likeMovies.length : total + 6;
    });
  };

  if (currentUserInfoLoading !== "succeeded" || likeMoviesLoading !== "succeeded") return <div>Loading...</div>;

  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-[3.75rem]">
          <MypageTitle>{currentUserInfo?.nickname} 님의 좋아요</MypageTitle>
        </div>
        {likeMovies.length === 0 ? (
          <div>좋아요한 영화가 없습니다.</div>
        ) : (
          <>
            <MypageGridArea>
              {movieImages &&
                movieImages.map(({ movieId, poster }, index) => (
                  <Link to={`/movies/${movieId}`} key={index} className="w-full h-full">
                    <LikeGridCards image={poster ? `${IMAGE_URL}w500${poster}` : null} alt={String(movieId)} />
                  </Link>
                ))}
            </MypageGridArea>
            {isFinish ? (
              ""
            ) : (
              <button className="btn btn-active btn-secondary rounded-full block mt-10 mx-auto" onClick={morePosters}>
                더 불러오기
              </button>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default MyLikes;
