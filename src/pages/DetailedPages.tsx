import { getAuth } from "firebase/auth";
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import { db, CurrentUserInfo } from "../Application";
import { API_URL,API_KEY,IMAGE_URL } from "../config/config"
import {BsHeart,BsFillHeartFill} from 'react-icons/bs'
import {BsStarFill,BsStarHalf} from 'react-icons/bs'
import {BiStar} from 'react-icons/bi'


export interface MovieDetailedPages {}

interface MovieFullDetails {
  adult?: boolean,
  backdrop_path?: string,
  belongs_to_collection?: null | object,
  budget?: number,
  genres?: [{id: number , name: string}],
  genre_ids?: [number],
  homepage?: string | null,
  id?: number,
  imdb_id?: string | null,
  original_language?: string,
  original_title?: string,
  overview?: string | null,
  popularity?: number,
  poster_path?: string | null,
  production_companies?: [{id: number, logo_path: string, name: string, origin_country: string}],
  production_countries?: [{iso_3166_1: string, name: string}],
  release_date?: string,
  revenue?: number,
  runtime?: number | null,
  spoken_languages?: [{iso_639_1: string, name: string}],
  status?: string,
  tagline?: string | null,
  title?: string,
  video?: boolean,
  vote_average?: number,
  vote_count?: number
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


const DetailedPages: React.FC<MovieDetailedPages> = () => {
  const [currentUserInfo, setCurrentUserInfo] = useState<CurrentUserInfo>();
  const [movieFullDetails, setMovieFullDetails] = useState<MovieFullDetails>()
  const [actors, setActors] = useState([])
  const [director, setDirector] = useState([])
  const [similarMovies, setSimilarMovies] = useState([])
  const [like, setLike] = useState(false)
  const [moreCredits, setMoreCredits] = useState(false)
  const movieId = useParams().id

  
  useEffect(() => {
    getRecentRecords()
    .then((isExist)  => {
      if (!isExist) {
        setDoc(recordRef, {movieArray: [Number(movieId)]});
      } else {
        updateDoc(recordRef, {movieArray: arrayUnion(Number(movieId))});
      }
    })
  },[])
  
  useEffect(() => {
    getLikeMovies()
    .then((isExit) => {
      if(!isExit) {
        setDoc(likeRef, {moviesArray: [Number(movieId)]});
      } else {
          if(like){
            updateDoc(likeRef, {moviesArray: arrayUnion(Number(movieId))});
          } else updateDoc(likeRef, {moviesArray:arrayRemove(Number(movieId))})
    }})
  })
  
  useEffect(() => {
    async function fullDetails(){
      const movieDetailApi = `${API_URL}/movie/${movieId}?api_key=${API_KEY}`
      const res = await fetch(movieDetailApi)
      const results = await res.json()
      setMovieFullDetails(results)
      return results
    }
    fullDetails()
  },[])
  
  useEffect(() => {
    async function actorDetails(){
      const actorDetailApi = `${API_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
      const res = await fetch(actorDetailApi)
      const results = await res.json()
      setActors(results.cast)
      setDirector([results.crew[0]])
      return results
    }
    actorDetails()
  },[]) 
  
  useEffect(() => {
    async function similarMovies(){
      const similarMoviesApi = `${API_URL}/movie/${movieId}/similar?api_key=${API_KEY}`
      const res = await fetch(similarMoviesApi)
      const results = await res.json()
      setSimilarMovies(results.results)
      return results
    }
    similarMovies()
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

  const likeRef = doc(db, "users", auth.currentUser?.uid, 'likeMovies','movies');

  const getLikeMovies =  async () => {
    const likeSnap = await getDoc(likeRef);
    const result = likeSnap.data();

  if(like){
    if(result === undefined) {
      return false;
    } else if((result.moviesArray as Number[]).includes(Number(movieId))) {
      updateDoc(likeRef, {moviesArray: arrayRemove(Number(movieId))});
      updateDoc(likeRef, {moviesArray: arrayUnion(Number(movieId))});
    } else { updateDoc(likeRef, {moviesArray: arrayUnion(Number(movieId))});}
  } else if (like === false){
      updateDoc(likeRef, {moviesArray: arrayRemove(Number(movieId))})
  }

  return true
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

function maxSevenMovies(movies: Array<MovieFullDetails>): Array<MovieFullDetails> {
  const result: Array<MovieFullDetails> = []
  if(movies.length > 7){
    for(let i = 0; i < 7; i++){
      result.push(movies[i])
    }
  } else {
    return movies
  }
  return result
}

function ratingStar(rate: number): JSX.Element[] {
  let rating: number = rate / 2;
  const result: JSX.Element[] = [];

  for(let i = 0; i < 5; i++){
    if(rating > 1){
      result.push(<BsStarFill fill="yellow" size="1.5rem" key={i}></BsStarFill>)
      rating -= 1;
    } else if(rating >= 0.25) {
      result.push(<BsStarHalf fill="yellow" size="1.5rem" key={i}></BsStarHalf>)
      rating = 0
    } else result.push(<BiStar fill="yellow"  size="1.5rem" key={i}></BiStar>)
  }
  return result
}

let movieTitle 
let movieGenres 
let moviePoster 
let movieImage 
let movieRelease 
let movieLanguage 
let movieRuntime
let movieOverview 
let movieRate

if(movieFullDetails !== undefined){
  const {original_title, genres, poster_path, backdrop_path, release_date, spoken_languages, runtime, overview, vote_average} = movieFullDetails

  movieTitle = original_title
  movieGenres = genres
  moviePoster = poster_path
  movieImage = backdrop_path
  movieRelease = release_date
  movieLanguage = spoken_languages[0].name
  movieRuntime = runtime
  movieOverview = overview
  movieRate = vote_average
}

const movieDirector: string = director[0]?.name
const fiveMovieActors: JSX.Element[] = maxFiveActors(actors).map((actor) => <li key={actor.credit_id}><img className="w-20" src={`${IMAGE_URL}w300${actor.profile_path}`} alt='Actor Image'></img><p>{actor.character}역</p> <p>{actor.name}</p></li>)
const tenMovieActors: JSX.Element[] = maxTenActors(actors).map((actor) => <li key={actor.credit_id}><img className="w-20" src={`${IMAGE_URL}w300${actor.profile_path}`} alt='Actor Image'></img><p>{actor.character}역</p> <p>{actor.name}</p></li>)
const sevenSimilarMovies: JSX.Element[] = maxSevenMovies(similarMovies).map((movie)=> <li key={movie.id}><Link to={`/movies/${movie.id}`}><img  src={movie.poster_path ? `${IMAGE_URL}w300${movie.poster_path}`: null} alt='Similar Movie Image'/></Link><p>{movie.title}</p></li>)
const movieYear: string = movieRelease !== undefined ? movieRelease.substring(0,4) : ""

let imgUrl = ""
if(movieImage !== undefined) {
  imgUrl = `${IMAGE_URL}w500${movieImage}` 
}





  return (
    <>
    <section className="relative">
      <div className="opacity-50" style={{backgroundImage: `url(${imgUrl})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', width: '100%', height: '40vw'}}></div>
      
      <div className="absolute w-3/4 left-[12.5%] bottom-10 flex flex-row justify-between">
        <div className='flex flex-row '>
          <h2 className="text-3xl font-bold">{movieTitle}({movieYear})</h2> 
          <div className='flex flex-row items-end ml-4'>{ratingStar(movieRate)} 
          <p className="text-lg font-bold ">({movieRate})</p>
          </div>
         
          
        </div>
        <button className="btn btn-accent btn-sm rounded-2xl w-28 opacity-100" onClick={()=> like ? setLike(false) : setLike(true)}>{like ? <BsFillHeartFill className="mr-3 text-red-600"></BsFillHeartFill> : <BsHeart className="mr-3"></BsHeart>}좋아요</button>
      </div>
    </section>

    <section className="w-3/4 mt-14 mx-auto flex">  
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

    </section>

    <section className="w-3/4  mx-auto ">
      <div>
      <ul className='flex flex-row'>
        출연진
        {moreCredits ? tenMovieActors : fiveMovieActors}
        <li><button className='btn btn-primary btn-sm' onClick={()=>moreCredits ? setMoreCredits(false) :setMoreCredits(true)}>{moreCredits ? `접기` : `더보기`}</button></li>
      </ul>
      </div>

    <div>
      <h3>줄거리</h3>
      <p>{movieOverview&&movieOverview}</p>
    </div>
    <h3>비슷한 영화</h3>
    <ul className='flex flex-row justify-between'>
      {sevenSimilarMovies}
    </ul>
    <div>

    </div>
    </section>
    

    <section className="w-3/4  mx-auto flex flex-col">
      <h3>감상평</h3>
      <div className='bg-gray-300 flex flex-col items-center'>
       
        <p>별점을 선택해주세요</p>

        <div className="rating rating-md rating-half">
          <input type="radio" name="rating-10" className="rating-hidden" />
          <input type="radio" name="rating-10" className="bg-yellow-500 mask mask-star-2 mask-half-1" />
          <input type="radio" name="rating-10" className="bg-yellow-500 mask mask-star-2 mask-half-2" />
          <input type="radio" name="rating-10" className="bg-yellow-500 mask mask-star-2 mask-half-1" />
          <input type="radio" name="rating-10" className="bg-yellow-500 mask mask-star-2 mask-half-2" />
          <input type="radio" name="rating-10" className="bg-yellow-500 mask mask-star-2 mask-half-1" />
          <input type="radio" name="rating-10" className="bg-yellow-500 mask mask-star-2 mask-half-2" />
          <input type="radio" name="rating-10" className="bg-yellow-500 mask mask-star-2 mask-half-1" />
          <input type="radio" name="rating-10" className="bg-yellow-500 mask mask-star-2 mask-half-2" />
          <input type="radio" name="rating-10" className="bg-yellow-500 mask mask-star-2 mask-half-1" />
          <input type="radio" name="rating-10" className="bg-yellow-500 mask mask-star-2 mask-half-2" />
        </div>

        <div className="flex">
        <input type="text" placeholder="감상평을 입력해주세요" className="input input-bordered input-primary input-sm w-full" />
        <button type="submit" className="btn btn-accent btn-sm ml-4">등록</button>
        </div>
      </div>
      
      
    </section>
      
    </>
  )
};


export default DetailedPages;
