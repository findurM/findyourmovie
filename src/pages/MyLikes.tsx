import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CurrentUserInfo, db } from "../Application";
import { LikeGridCards } from "../components/GridCards";
import { API_KEY, API_URL, IMAGE_URL } from "../config/config";

const MyLikes = () => {

  const localStorageUserInfo = JSON.parse(localStorage.getItem('user'))
  const [currentUserInfo, setCurrentUserInfo] = useState<CurrentUserInfo>();
  const [likeMovies, setLikeMovies] = useState<Number[]>();
  const [movieImages, setMovieImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserInfo = async () => {
    const userRef = doc(db, "users", localStorageUserInfo.uid);
    const userSnap = await getDoc(userRef);
    setCurrentUserInfo((userSnap.data() as CurrentUserInfo));
  }

  const getLikeMovies = async () => {
    const likeRef = doc(db, "users", localStorageUserInfo.uid, "likeMovies", "movies");
    const likeSnap = await getDoc(likeRef);
    setLikeMovies((likeSnap.data().moviesArray as Number[]));
  }

  const getMovieImages = async (movieId: Number) => {
    const res = await fetch(`${API_URL}/movie/${movieId}/images?api_key=${API_KEY}`);
    const data = await res.json();
    const newImage = [{movieId: movieId, poster: data.posters[0]}];
    setMovieImages((movieImages) => {return [...movieImages, ...newImage]});
  }

  useEffect(() => {
    getUserInfo();
    getLikeMovies()
    .then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if(likeMovies !== null && likeMovies !== undefined) {
      likeMovies.reverse().forEach((movieId: Number) => {
        getMovieImages(movieId);
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
              alt={movieId}
            />
          </Link>
                ))}
        </div>)}
      </section>
    </>
  )
};

export default MyLikes;