import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";
import { db } from "../Application";
import { LikeGridCards } from "../components/GridCards";
import { IMAGE_URL } from "../config/config";
import { fetchMovieImages, MovieImagesState, resetMovieImages } from "../features/fetchMovieImagesSlice";
import { fetchUserInfo, UserInfoState } from "../features/fetchUserInfoSlice";

const MyLikes = () => {

  const localStorageUserInfo = JSON.parse(localStorage.getItem('user'))
  const [likeMovies, setLikeMovies] = useState<Number[]>();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const {movieImages, loading: movieImagesLoading} = useSelector<RootState, MovieImagesState>((state) => state.movieImages);
  const {userInfo: currentUserInfo, loading: currentUserInfoLoading} = useSelector<RootState, UserInfoState>((state) => state.userInfo);

  const getLikeMovies = async () => {
    const likeRef = doc(db, "users", localStorageUserInfo.uid, "likeMovies", "movies");
    const likeSnap = await getDoc(likeRef);
    if(likeSnap.data()) setLikeMovies((likeSnap.data().moviesArray as Number[]));
  }

  useEffect(() => {
    dispatch(fetchUserInfo());
    getLikeMovies()
    .then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    dispatch(resetMovieImages());
    if(likeMovies !== null && likeMovies !== undefined) {
      likeMovies.reverse().forEach((movieId: Number) => {
        dispatch(fetchMovieImages(movieId));
      })
    }
  }, [likeMovies])

  if(isLoading) return <div>Loading...</div>

  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-[3.75rem]">
          <h2 className="text-5xl font-bold">{currentUserInfo?.nickname} 님의 좋아요</h2>
        </div>
        {likeMovies === null || likeMovies === undefined
        ? (<div>좋아요한 영화가 없습니다.</div>)
        : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-5 m-auto">
        {movieImages && movieImages.map(({movieId, poster}, index) => (
          <Link to={`/movies/${movieId}`} key={index} className="w-full h-full">
            <LikeGridCards 
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

export default MyLikes;