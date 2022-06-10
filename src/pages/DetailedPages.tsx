import { getAuth } from "firebase/auth";
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, CurrentUserInfo } from "../Application";
import { API_URL,API_KEY,IMAGE_URL } from "../config/config"

export interface DetailedPages {}

const DetailedPages: React.FC<DetailedPages> = () => {
  const [movieFullDetails, setMovieFullDetails] = useState([])
  const movieId = useParams().id
  const auth = getAuth();

  const recordRef = doc(db, "users", auth.currentUser?.uid, "recentRecords", "movies");
  const getRecentRecords = async () => {
    const recordSnap = await getDoc(recordRef);
    const result = recordSnap.data();
    if(result === undefined) {
      return false;
    } else if((result.movieArray as Number[]).includes(Number(movieId))) {
      updateDoc(recordRef, {movieArray: arrayRemove(Number(movieId))});
      updateDoc(recordRef, {movieArray: arrayUnion(Number(movieId))});
    } else if((result.movieArray as Number[]).length >= 20) {
      const oldestRecord = result.movieArray[0];
      updateDoc(recordRef, {movieArray: arrayRemove(oldestRecord)});
    }
    return true;
  }
  
  useEffect(() => {
    getRecentRecords()
      .then((isExist)  => {
        if (!isExist) {
          setDoc(recordRef, {movieArray: [Number(movieId)]});
        } else {
          updateDoc(recordRef, {movieArray: arrayUnion(Number(movieId))});
        }
      })
    async function fetchData(){
      const movieDetailApi = `${API_URL}/movie/${movieId}?api_key=${API_KEY}`
      const res = await fetch(movieDetailApi)
      const results = await res.json()
      setMovieFullDetails(results)
      return results
    }
    fetchData()
  },[])


 


  return (
    <div>
      디테일 페이지입니다.
    </div>
  )
};


export default DetailedPages;
