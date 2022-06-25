import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";
import { LikeGridCards } from "../components/GridCards";
import { IMAGE_URL } from "../config/config";
import { fetchLikeMovies, LikeMoviesState } from "../features/fetchLikeMoviesSlice";
import { fetchMovieImages, MovieImagesState, resetMovieImages } from "../features/fetchMovieImagesSlice";
import { fetchUserInfo, UserInfoState } from "../features/fetchUserInfoSlice";

const MyLikes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {userInfo: currentUserInfo, loading: currentUserInfoLoading} = useSelector<RootState, UserInfoState>((state) => state.userInfo);
  const {movieImages, loading: movieImagesLoading} = useSelector<RootState, MovieImagesState>((state) => state.movieImages);
  const {likeMovies, loading: likeMoviesLoading} = useSelector<RootState, LikeMoviesState>((state) => state.likeMovies);

  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(fetchLikeMovies());
  }, []);

  useEffect(() => {
    if(likeMoviesLoading === 'succeeded' && likeMovies.length > 0) {
      dispatch(resetMovieImages());
      likeMovies.forEach((movieId: Number) => {
        dispatch(fetchMovieImages(movieId));
      })
    }
  }, [likeMoviesLoading])

  if(currentUserInfoLoading !== 'succeeded' || movieImagesLoading !== 'succeeded' || likeMoviesLoading !== 'succeeded') return <div>Loading...</div>

  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-[3.75rem]">
          <h2 className="text-5xl font-bold">{currentUserInfo?.nickname} 님의 좋아요</h2>
        </div>
        {likeMovies.length === 0
        ? (<div>좋아요한 영화가 없습니다.</div>)
        : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-5 m-auto">
        {movieImages && movieImages.map(({movieId, poster}, index) => (
          <Link to={`/movies/${movieId}`} key={index} className="w-full h-full">
            <LikeGridCards 
              image={poster ? `${IMAGE_URL}w500${poster}`: null}
              alt={String(movieId)}
            />
          </Link>
                ))}
        </div>)}
      </section>
    </>
  )
};

export default MyLikes;