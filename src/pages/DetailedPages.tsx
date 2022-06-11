import { getAuth } from "firebase/auth";
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, CurrentUserInfo } from "../Application";
import { API_URL,API_KEY,IMAGE_URL } from "../config/config"


export interface DetailedPages {}



const DetailedPages: React.FC<DetailedPages> = () => {
  const [movieFullDetails, setMovieFullDetails] = useState([])
  const [actors, setActors] = useState([])
  const [director, setDirector] = useState([])
  const movieId = useParams().id

  interface Genre {
    id: number, 
    name: string,
  }
  
  interface ActorInfo {
    adult: boolean
    cast_id: number
    character: string
    credit_id: string
    gender: number
    id: number
    known_for_department: string
    name: string
    order: number
    original_name: string
    popularity: number
    profile_path: string
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

  async function fullDetails(){
    const movieDetailApi = `${API_URL}/movie/${movieId}?api_key=${API_KEY}`
    const res = await fetch(movieDetailApi)
    const results = await res.json()
    setMovieFullDetails([results])
    return results
  }

  async function actorDetails(){
    const actorDetailApi = `${API_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
    const res = await fetch(actorDetailApi)
    const results = await res.json()
    setActors(results.cast)
    setDirector([results.crew[0]])
    return results
  }

  fullDetails()
  actorDetails()
},[]) 

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


function maxTenActors(actors: any[]): Array<ActorInfo> {
  const result: Array<ActorInfo> = []
  if(actors.length > 10){
    for(let i = 0; i < 10; i++){
      result.push(actors[i])
    }
  } else {
    return actors
  }
  return result
}

function maxFiveActors(actors: Array<ActorInfo>): Array<ActorInfo> {
  const result: Array<ActorInfo> = []
  if(actors.length > 5){
    for(let i = 0; i < 5; i++){
      result.push(actors[i])
    }
  } else {
    return actors
  }
  return result
}

const movieTitle: string = movieFullDetails[0]?.original_title
const movieGenres: Array<Genre> = movieFullDetails[0]?.genres
const moviePoster: string = movieFullDetails[0]?.poster_path
const movieImage: string = movieFullDetails[0]?.backdrop_path
const movieRelease: string = movieFullDetails[0]?.release_date
const movieLanguage: string = movieFullDetails[0]?.original_language
const movieRuntime: string = movieFullDetails[0]?.runtime
const movieOverview: string = movieFullDetails[0]?.overview

const movieDirector: string = director[0]?.name

const fiveMovieActors: JSX.Element[] = maxFiveActors(actors).map((actor) => <li key={actor.credit_id}><img className="w-20" src={`${IMAGE_URL}w300${actor.profile_path}`} alt='Actor Image'></img><p>{actor.character}역</p> <p>{actor.name}</p></li>)
const tenMovieActors: JSX.Element[] = maxTenActors(actors).map((actor) => <li key={actor.credit_id}><img className="w-20" src={`${IMAGE_URL}w300${actor.profile_path}`} alt='Actor Image'></img><p>{actor.character}역</p> <p>{actor.name}</p></li>)



  return (
    <>
    <section>
      <img className="w-full" src={movieImage&& `${IMAGE_URL}w500${movieImage}`} alt="hero-image"></img>
    <h2>{movieTitle}</h2>
    <button>좋아요</button>
    </section>
    <section>
      
      <img src={moviePoster&& `${IMAGE_URL}w300${moviePoster}`} alt="poster"></img>
      <ul>
        기본정보
        <li>
          <ul className='flex flex-row'>
          장르
          {movieGenres&&movieGenres.map((genre) => <li key={genre.id} className="pl-2">{genre.name}</li>)}
          </ul>
        </li>
        <li>개봉날짜 {movieRelease&&movieRelease}</li>
        <li>언어 {movieLanguage&&movieLanguage}</li>
        <li>러닝타임 {movieRuntime&&movieRuntime}분</li>
        <li>감독 {movieDirector&&movieDirector}</li>
      </ul>
      <ul className='flex flex-row'>
        출연진
        {fiveMovieActors}
        <li><button>더보기</button></li>
      </ul>
      
    
    </section>
    <div>
      <h3>줄거리</h3>
      <p>{movieOverview&&movieOverview}</p>
    </div>
    <section>
      <h3>감상평</h3>
    </section>
      
    </>
  )
};


export default DetailedPages;
