import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CurrentUserInfo, db } from "../Application";
import GridCards from "../components/GridCards";
import { API_KEY, API_URL, IMAGE_URL } from "../config/config";

const RecentRecords = () => {

  const auth = getAuth();
  const [currentUserInfo, setCurrentUserInfo] = useState<CurrentUserInfo>();
  const [recentRecords, setRecentRecords] = useState<Number[]>();
  const [movieImages, setMovieImages] = useState([]);

  const getUserInfo = async () => {
    const userRef = doc(db, "users", auth.currentUser?.uid);
    const userSnap = await getDoc(userRef);
    setCurrentUserInfo((userSnap.data() as CurrentUserInfo));
  }

  const getRecentRecords = async () => {
    const recordRef = doc(db, "users", auth.currentUser?.uid, "recentRecords", "movies");
    const recordSnap = await getDoc(recordRef);
    setRecentRecords((recordSnap.data().movieArray as Number[]));
  }

  const getMovieImages = async (movieId: Number) => {
    const res = await fetch(`${API_URL}/movie/${movieId}/images?api_key=${API_KEY}`);
    const data = await res.json();
    const newImage = [{movieId: movieId, poster: data.posters[0]}];
    setMovieImages((movieImages) => {return [...movieImages, ...newImage]});
  }

  useEffect(() => {
    getUserInfo();
    getRecentRecords();
  }, [auth.currentUser]);

  useEffect(() => {
    if(recentRecords !== null && recentRecords !== undefined) {
      recentRecords.forEach((movieId: Number) => {
        getMovieImages(movieId);
      })
    }
  }, [recentRecords])

  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-[3.75rem]">
          <h2 className="text-5xl font-bold">{currentUserInfo?.nickname} 님의 최근 검색한 기록</h2>
        </div>
        {recentRecords === null || recentRecords === undefined
        ? (<div>최근 검색한 영화가 없습니다.</div>)
        : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-5 m-auto">
        {movieImages && movieImages.map(({movieId, poster}, index) => (
          <Link to={`/movies/${movieId}`} key={index} className="w-full h-full">
            <GridCards 
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

export default RecentRecords;