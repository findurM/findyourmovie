import { getAuth } from "firebase/auth";
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import { db } from "../Application";
import { IMAGE_URL } from "../config/config"
import {BsHeart,BsFillHeartFill} from 'react-icons/bs'
import {BsStarFill,BsStarHalf} from 'react-icons/bs'
import {BiStar} from 'react-icons/bi'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchMovieDetails, MovieDetails, MovieDetailsState } from "../features/fetchMovieDetailsSlice";
import { ActorDetailsState, ActorInfo, fetchActorDetails } from "../features/fetchActorDetailsSlice";
import { fetchSimilarMovies, SimilarMoviesState } from "../features/fetchSimilarMoviesSlice";

export interface MovieDetailedPages {}

// interface MovieFullDetails {
//   adult?: boolean,
//   backdrop_path?: string,
//   belongs_to_collection?: null | object,
//   budget?: number,
//   genres?: [{id: number , name: string}],
//   genre_ids?: [number],
//   homepage?: string | null,
//   id?: number,
//   imdb_id?: string | null,
//   original_language?: string,
//   original_title?: string,
//   overview?: string | null,
//   popularity?: number,
//   poster_path?: string | null,
//   production_companies?: [{id: number, logo_path: string, name: string, origin_country: string}],
//   production_countries?: [{iso_3166_1: string, name: string}],
//   release_date?: string,
//   revenue?: number,
//   runtime?: number | null,
//   spoken_languages?: [{iso_639_1: string, name: string}],
//   status?: string,
//   tagline?: string | null,
//   title?: string,
//   video?: boolean,
//   vote_average?: number,
//   vote_count?: number
// }

const DetailedPages: React.FC<MovieDetailedPages> = () => {
  const localStorageUserInfo = JSON.parse(localStorage.getItem('user'))
  const [like, setLike] = useState(false)
  const [moreCredits, setMoreCredits] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const movieId = useParams().id

  const dispatch = useDispatch<AppDispatch>();
  const {movieDetails, loading: movieDetailsLoading} = useSelector<RootState, MovieDetailsState>((state) => state.movieDetails);
  const {actors, director, loading: actorDetailsLoading} = useSelector<RootState, ActorDetailsState>((state) => state.actorDetails);
  const {similarMovies, loading: similarMoviesLoading} = useSelector<RootState, SimilarMoviesState>((state) => state.similarMovies);

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
    .then((isLike) => {
      setLike(isLike);
      setIsLoading(false);
    });
  }, [])
  
  useEffect(() => {
    dispatch(fetchMovieDetails(Number(movieId)));
    dispatch(fetchActorDetails(Number(movieId)));
  },[])
  
  useEffect(() => {
    dispatch(fetchSimilarMovies(Number(movieId)));
  },[]) 
  
  const auth = getAuth();
  
  const recordRef = doc(db, "users", localStorageUserInfo.uid, "recentRecords", "movies");
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

  const likeRef = doc(db, "users", localStorageUserInfo.uid, 'likeMovies','movies');

  const getLikeMovies =  async () => {
    const likeSnap = await getDoc(likeRef);
    const result = likeSnap.data();

    if(result && result.moviesArray !== undefined) {
      if((result.moviesArray as Number[]).includes(Number(movieId))) {
        return true;
      }
    } else if(!result) {
      setDoc(likeRef, {moviesArray: []});
    }
    return false;
  }

  const onLikeButtonClick = () => {
    if(like) {
      updateDoc(likeRef, {moviesArray: arrayRemove(Number(movieId))});
      setLike(false);
    } else {
      updateDoc(likeRef, {moviesArray: arrayUnion(Number(movieId))});
      setLike(true);
    }
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

  function maxSevenMovies(movies: Array<MovieDetails>): Array<MovieDetails> {
    const result: Array<MovieDetails> = []
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

  const movieDirector: string = director?.name;
  const fiveMovieActors: JSX.Element[] = maxFiveActors(actors).map((actor) => <li key={actor.credit_id}><img className="w-20" src={`${IMAGE_URL}w300${actor.profile_path}`} alt='Actor Image'></img><p>{actor.character}역</p> <p>{actor.name}</p></li>)
  const tenMovieActors: JSX.Element[] = maxTenActors(actors).map((actor) => <li key={actor.credit_id}><img className="w-20" src={`${IMAGE_URL}w300${actor.profile_path}`} alt='Actor Image'></img><p>{actor.character}역</p> <p>{actor.name}</p></li>)
  const sevenSimilarMovies: JSX.Element[] = maxSevenMovies(similarMovies).map((movie)=> <li key={movie.id}><Link to={`/movies/${movie.id}`}><img  src={movie.poster_path ? `${IMAGE_URL}w300${movie.poster_path}`: null} alt='Similar Movie Image'/></Link><p>{movie.title}</p></li>)
  const movieYear: string = movieDetails.movieRelease !== undefined ? movieDetails.movieRelease.substring(0,4) : ""

  let imgUrl = ""
  if(movieDetails.movieImage !== undefined) {
    imgUrl = `${IMAGE_URL}w500${movieDetails.movieImage}` 
  }




  if(movieDetailsLoading !== 'succeeded' || actorDetailsLoading !== 'succeeded' || 
    similarMoviesLoading !==  'succeeded' || isLoading) return <div>Loading...</div>

  return (
    <>
    <section className="relative">
      <div className="opacity-50" style={{backgroundImage: `url(${imgUrl})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', width: '100%', height: '40vw'}}></div>
      
      <div className="absolute w-3/4 left-[12.5%] bottom-10 flex flex-row justify-between">
        <div className='flex flex-row '>
          <h2 className="text-3xl font-bold">{movieDetails.movieTitle}({movieYear})</h2> 
          <div className='flex flex-row items-end ml-4'>{ratingStar(movieDetails.movieRate)} 
          <p className="text-lg font-bold ">({movieDetails.movieRate})</p>
          </div>
         
          
        </div>
        <button className="btn btn-accent btn-sm rounded-2xl w-28 opacity-100" onClick={onLikeButtonClick}>{like ? <BsFillHeartFill className="mr-3 text-red-600"></BsFillHeartFill> : <BsHeart className="mr-3"></BsHeart>}좋아요</button>
      </div>
    </section>

    <section className="w-3/4 mt-14 mx-auto flex">  
      <img src={movieDetails.moviePoster&& `${IMAGE_URL}w300${movieDetails.moviePoster}`} alt="poster"></img>
      <ul>
        기본정보
        <li>
          <ul className='flex flex-row'>
          장르
          {movieDetails.movieGenres && movieDetails.movieGenres.map((genre) => <li key={genre.id} className="pl-2">{genre.name}</li>)}
          </ul>
        </li>
        <li>개봉날짜 {movieDetails.movieRelease && movieDetails.movieRelease}</li>
        <li>언어 {movieDetails.movieLanguage && movieDetails.movieLanguage}</li>
        <li>러닝타임 {movieDetails.movieRuntime && movieDetails.movieRuntime}분</li>
        <li>감독 {movieDirector && movieDirector}</li>
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
      <p>{movieDetails.movieOverview && movieDetails.movieOverview}</p>
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
