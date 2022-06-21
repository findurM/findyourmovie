import { getAuth } from "firebase/auth";
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import { useParams,Link } from "react-router-dom";
import { db, CurrentUserInfo } from "../Application";
import { API_URL,API_KEY,IMAGE_URL } from "../config/config"
import {BsFillHeartFill,BsHeart} from 'react-icons/bs'
import RatingStar from '../components/RatingStar'

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
// import { fetchMovieDetails, MovieDetails, MovieDetailsState } from "../features/fetchMovieDetailsSlice";
// import { ActorDetailsState, ActorInfo, fetchActorDetails } from "../features/fetchActorDetailsSlice";
// import { fetchSimilarMovies, SimilarMoviesState } from "../features/fetchSimilarMoviesSlice";
// import { fetchRecentRecords, RecentRecordsState } from "../features/fetchRecentRecordsSlice";
// import { fetchLikeMovies, LikeMoviesState } from "../features/fetchLikeMoviesSlice";
// import { fetchUserInfo, UserInfoState } from "../features/fetchUserInfoSlice";
// import { fetchUserComments, UserCommentsState } from "../features/fetchUserCommentsSlice";

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

interface CommentsInput {
  comment: string
  nickname: string
  rate: number
}

interface UserComment {
  comment: string
  movieId: number
  rate: number
}

interface InputValue {
  comment: string
  rate: number
}

interface WidthValue {
  postwidth: number
  trailerWidth: number
}

const DetailedPages: React.FC<MovieDetailedPages> = () => {
  const localStorageUserInfo = JSON.parse(localStorage.getItem('user'))
  const [currentUserInfo, setCurrentUserInfo] = useState<CurrentUserInfo>()
  const [movieFullDetails, setMovieFullDetails] = useState<MovieFullDetails>()
  const [trailer, setTrailer] = useState([])
  const [actors, setActors] = useState([])
  const [director, setDirector] = useState([])
  const [similarMovies, setSimilarMovies] = useState([])
  const [like, setLike] = useState(false)
  const [moreCredits, setMoreCredits] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [inputValue, setInputValue] = useState<InputValue>()
  const [comments, setComments] = useState<CommentsInput[]>([])
  const [contentsHeight, setContentsHeight] = useState<WidthValue>()
  const movieId = useParams().id
  const posterRef = useRef(null)
  const trailerRef = useRef(null)
  const rateInputRef = useRef(null)

  useEffect(() => {
    getUserInfo();
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
    getComments()
  },[])

  useEffect(() => {
    if(comments === []){
      const comments: Array<CommentsInput> = [];
      setDoc(movieCommentRef,{comments})
    }
  },[])

  useEffect(() => {
    getUserComment()
    .then((isUserComment) => {
      if(!isUserComment) {
        const commentsArray: Array<UserComment> = [];
        setDoc(userCommentRef,{commentsArray})
      }
    })
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
    async function trailerApi(){
      const trailerApi = `${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
      const res = await fetch(trailerApi)
      const results = await res.json()
      setTrailer(results.results)
      return results
    }
    trailerApi()
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
   
    if(result !== undefined) {
      if((result.moviesArray as Number[]).includes(Number(movieId))) {
        return true;
      }
    } else if (!result) {
      setDoc(likeRef,{moviesArray:[]})
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

  const posterHeight = () => {
    if(posterRef !== undefined) {
      const width = posterRef.current.clientWidth;
      const height = width * 1.5;  
      return height;
    }
  }

  const trailerKey = () => {
    const result: string[] = []
    if(trailer !== undefined) {
      for(let i = 0; i < trailer.length; i++) {
        trailer[i].official = true ? result.push(trailer[i].key) : ""
      }
    }

    return result[0]
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
    const {original_title, genres, poster_path, backdrop_path, release_date, spoken_languages, runtime, overview, vote_average, } = movieFullDetails

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


  const movieTrailer: string = trailerKey() 
  const movieDirector: string = director[0]?.name
  const fiveMovieActors: JSX.Element[] = maxFiveActors(actors).map((actor) => <li key={actor.credit_id} className="flex-1"><img className="w-20" src={`${IMAGE_URL}w300${actor.profile_path}`} alt='Actor Image'></img><p>{actor.character}역</p> <p>{actor.name}</p></li>)
  const tenMovieActors: JSX.Element[] = maxTenActors(actors).map((actor) => <li key={actor.credit_id}><img className="w-20" src={`${IMAGE_URL}w300${actor.profile_path}`} alt='Actor Image'></img><p>{actor.character}역</p> <p>{actor.name}</p></li>)
  const sevenSimilarMovies: JSX.Element[] = maxSevenMovies(similarMovies).map((movie)=> <li key={movie.id}><Link to={`/movies/${movie.id}`}><img  src={movie.poster_path ? `${IMAGE_URL}w300${movie.poster_path}`: null} alt='Similar Movie Image'/></Link><p>{movie.title}</p></li>)
  const movieYear: string = movieRelease !== undefined ? movieRelease.substring(0,4) : ""

  let imgUrl = ""
  if(movieImage !== undefined) {
    imgUrl = `${IMAGE_URL}w500${movieImage}` 
  }

  

  const movieCommentRef = doc(db, 'movies', movieId)
  const userCommentRef = doc(db, 'users', localStorageUserInfo?.uid, 'movieComments', 'comments')

  const getComments = async() => {
    const commentsSnap = await getDoc(movieCommentRef);
    const result = commentsSnap.data();
   
    if(result !== undefined) {
      setComments(result.comments)
      return true
    }else return false
  }

  const getUserComment = async() => {
    const userCommentSnap = await getDoc(userCommentRef);
    const result = userCommentSnap.data();
    
    if(result !== undefined) return true
    else return false
  }

  const onSubmit = async() => {
    
   updateDoc(movieCommentRef, 
                      {comments: arrayUnion({comment: inputValue.comment,
                                            nickname: currentUserInfo?.nickname,
                                            rate: inputValue.rate})})

    updateDoc(userCommentRef, 
                      {commentsArray: arrayUnion({comment : inputValue.comment,
                                                  movieId: movieId,
                                                  rate: inputValue.rate})})
  }


  const getUserInfo = async () => {
    const userRef = doc(db, "users", localStorageUserInfo.uid);
    const userSnap = await getDoc(userRef);
    setCurrentUserInfo((userSnap.data() as CurrentUserInfo));
  }

 const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
  setInputValue({...inputValue, [event.target.name]: event.target.value})
 }

 const handleRateInput = () => {
  let count = 0;
  const stars = rateInputRef.current.childNodes
  for(let i = 0; i < stars.length; i++) {
    if(stars[i].checked) count = i;
  }
  setInputValue({...inputValue, rate: count})
 }

 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  onSubmit();
 }

  if(isLoading) return <div>Loading...</div>

  return (
    <>
      <section className="relative">
        <div className="opacity-50" style={{backgroundImage: `url(${imgUrl})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', width: '100%', height: '40vw'}}></div>

        <div className="absolute w-3/4 left-[12.5%] bottom-10 flex flex-row justify-between">
          <div className='flex flex-row '>
            <h2 className="text-3xl font-bold">{movieTitle}({movieYear})</h2> 
            <div className='flex flex-row items-end ml-4'>{RatingStar(movieRate)} 
              <p className="text-lg font-bold ">({movieRate})</p>
            </div>
          </div>

          <button className="btn btn-accent btn-sm rounded-2xl w-28 opacity-100" onClick={onLikeButtonClick}>{like ? <BsFillHeartFill className="mr-3 text-red-600"></BsFillHeartFill> : <BsHeart className="mr-3"></BsHeart>}좋아요</button>
        </div>
      </section>

      <section className="w-3/4 mt-14 mx-auto flex">  
        <div className="basis-1/4 mr-4" ref={posterRef} style={{backgroundImage: `url(${IMAGE_URL}w300${moviePoster})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: `${posterHeight()}px`}}></div>
        <div className="basis-2/4 ">
          <h3 className="text-2xl font-bold">기본정보</h3>
          <ul className="mr-4 text-lg">
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
        </div>
        
        <div className="basis-1/4">
          <h3 className="text-2xl font-bold">트레일러</h3>
          {movieTrailer&&<iframe  src={`https://www.youtube.com/embed/${movieTrailer}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
        </div>
        
      </section>

      <section className="w-3/4  mx-auto ">
        <div className='divider'></div>
        <div>
          <h3 className="text-2xl font-bold">출연진</h3>
          <ul className='flex flex-row'>
            {moreCredits ? tenMovieActors : fiveMovieActors}
            <li><button className='btn btn-primary btn-sm' onClick={()=>moreCredits ? setMoreCredits(false) :setMoreCredits(true)}>{moreCredits ? `접기` : `더보기`}</button></li>
          </ul>
        </div>
        <div className='divider'></div>
        <div>
          <h3 className="text-2xl font-bold">줄거리</h3>
          <p>{movieOverview&&movieOverview}</p>
        </div>
        <div className='divider'></div>
        <h3 className="text-2xl font-bold">비슷한 영화</h3>

        <ul className='flex flex-row justify-between'>
          {sevenSimilarMovies}
        </ul>
        <div className='divider'></div>
      </section>


      <section className="w-3/4  mx-auto flex flex-col">
        <h3 className="text-2xl font-bold">감상평</h3>
        <div className='bg-gray-300 flex flex-col items-center py-8'>

          <p>별점을 선택해주세요</p>

          <form className="flex flex-col items-center w-full" onSubmit={handleSubmit} >

          <div className="rating rating-md rating-half" ref={rateInputRef}>
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

          <div className="w-3/4 flex flex-row">
            <input type="text" placeholder="감상평을 입력해주세요" name='comment' className="input input-bordered input-primary input-sm w-full" onChange={handleInput}/>
            <button type="submit" className="btn btn-accent btn-sm ml-4" onClick={handleRateInput}>등록</button>
          </div>

          </form>
        </div>

        <div>
          {comments.map((comment, index)=> <div key={index}> <div className="flex flex-row">{RatingStar(comment.rate)}</div> <p>{comment.nickname}</p> <span>{comment.comment}</span> <div className="divider"></div></div>)}
        </div>
      </section>

    </>
  )
};


export default DetailedPages;

