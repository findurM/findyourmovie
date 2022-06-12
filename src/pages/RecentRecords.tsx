import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CurrentUserInfo, db } from "../Application";
import GridCards from "../components/GridCards";
import { API_KEY, API_URL, IMAGE_URL } from "../config/config";

const RecentRecords = () => {

  const localStorageUserInfo = JSON.parse(localStorage.getItem('user'))
  const [currentUserInfo, setCurrentUserInfo] = useState<CurrentUserInfo>();
  const [recentRecords, setRecentRecords] = useState<Number[]>();
  const [movieImages, setMovieImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const getMovieImages = async (movieId: Number) => {
    const res = await fetch(`${API_URL}/movie/${movieId}/images?api_key=${API_KEY}`);
    const data = await res.json();
    const newImage = [{movieId: movieId, poster: data.posters[0]}];
    setMovieImages((movieImages) => {return [...movieImages, ...newImage]});
  }

  useEffect(() => {
    getUserInfo();
<<<<<<< HEAD
    getRecentRecords();
    console.log(recentRecords,currentUserInfo)
  }, [auth.currentUser]);
=======
    getRecentRecords()
    .then(() => {
      setIsLoading(false);
    });
  }, []);
>>>>>>> 6df31c9cc3fe5cd7cbcae4cd59002426f83f8e32

  useEffect(() => {
    if(recentRecords !== null && recentRecords !== undefined) {
      recentRecords.reverse().forEach((movieId: Number) => {
        getMovieImages(movieId);
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