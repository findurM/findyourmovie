import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import RatingStar from '../components/RatingStar';
import React, { useEffect, useRef, useState} from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { db } from "../Application";
import { IMAGE_URL } from "../config/config"
import {BsHeart,BsFillHeartFill} from 'react-icons/bs'
import {BiXCircle} from 'react-icons/bi'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchMovieDetails, MovieDetails, MovieDetailsState } from "../features/fetchMovieDetailsSlice";
import { ActorDetailsState, ActorInfo, fetchActorDetails } from "../features/fetchActorDetailsSlice";
import { fetchSimilarMovies, SimilarMoviesState } from "../features/fetchSimilarMoviesSlice";
import { fetchRecentRecords, RecentRecordsState } from "../features/fetchRecentRecordsSlice";
import { fetchLikeMovies, LikeMoviesState } from "../features/fetchLikeMoviesSlice";
import { fetchUserInfo, UserInfoState } from "../features/fetchUserInfoSlice";
import { fetchUserComments, UserCommentsState } from "../features/fetchUserCommentsSlice";
import { fetchMovieComments, MovieCommentsState } from "../features/fetchMovieCommentsSlice";
import { fetchTrailer, TrailerState } from "../features/fetchTrailerSlice";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";


export interface MovieDetailedPages {}

export interface CommentsInput {
  comment: string
  nickname: string
  rate: number
  id: string
}

interface InputValue {
  comment: string
  rate: number
}

interface HeightValue {
  posterHeight: number
  trailerHeight: number
}

const DetailedPages: React.FC<MovieDetailedPages> = () => {



  const [windowSize, setWindowSize] = useState('')

  const localStorageUserInfo = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  
  const [moreCredits, setMoreCredits] = useState(false);
  const [inputValue, setInputValue] = useState<InputValue>();
  const [contentsHeight, setContentsHeight] = useState<HeightValue>({posterHeight: 500, trailerHeight:200});
  const [like, setLike] = useState(false);
  const [deleteComment, setDeleteComment] = useState<CommentsInput>();
  const [movieTrailer, setMovieTrailer] = useState<string>();


  
  const dispatch = useDispatch<AppDispatch>();
  const {userInfo: currentUserInfo, loading: currentUserInfoLoading} = useSelector<RootState, UserInfoState>((state) => state.userInfo);
  const {movieDetails, loading: movieDetailsLoading} = useSelector<RootState, MovieDetailsState>((state) => state.movieDetails);
  const {actors, director, loading: actorDetailsLoading} = useSelector<RootState, ActorDetailsState>((state) => state.actorDetails);
  const {similarMovies, loading: similarMoviesLoading} = useSelector<RootState, SimilarMoviesState>((state) => state.similarMovies);
  const {recentRecords, loading: recentRecordsLoading} = useSelector<RootState, RecentRecordsState>((state) => state.recentRecords);
  const {likeMovies, loading: likeMoviesLoading} = useSelector<RootState, LikeMoviesState>((state) => state.likeMovies);
  const {userComments, loading: userCommentsLoading} = useSelector<RootState, UserCommentsState>((state) => state.userComments);
  const {movieComments: comments, loading: movieCommentsLoading} = useSelector<RootState, MovieCommentsState>((state) => state.movieComments);
  const {trailer, loading: trailerLoading} = useSelector<RootState, TrailerState>((state) => state.trailer);

  const movieId = useParams().id;
  const rateInputRef = useRef(null);
  const recordRef = doc(db, "users", localStorageUserInfo.uid, "recentRecords", "movies");
  const likeRef = doc(db, "users", localStorageUserInfo.uid, 'likeMovies','movies');
  const movieCommentRef = doc(db, 'movies', movieId);
  const userCommentRef = doc(db, 'users', localStorageUserInfo.uid, 'movieComments', 'comments');
  
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [])
  
  useEffect(() => {
    dispatch(fetchMovieDetails(Number(movieId)));
    dispatch(fetchActorDetails(Number(movieId)));
    dispatch(fetchSimilarMovies(Number(movieId)));
    dispatch(fetchRecentRecords());
    dispatch(fetchLikeMovies());
    dispatch(fetchUserComments());
    dispatch(fetchMovieComments(movieId));
    dispatch(fetchTrailer(movieId));
  }, [location.pathname])

  useEffect(() => {
    if(recentRecordsLoading === 'succeeded' && recentRecords.length === 0) {
      setDoc(recordRef, {movieArray: [Number(movieId)]});
    } else {
      if(recentRecords.includes(Number(movieId))) {
        updateDoc(recordRef, {movieArray: arrayRemove(Number(movieId))});
      } else if(recentRecords.length >= 20) {
        const oldestRecord = recentRecords[0];
        updateDoc(recordRef, {movieArray: arrayRemove(oldestRecord)});
      }
      updateDoc(recordRef, {movieArray: arrayUnion(Number(movieId))});
    }
  },[recentRecordsLoading])
  
  useEffect(() => {
    if(likeMoviesLoading === 'succeeded') {
      if(likeMovies.length > 0 && likeMovies.includes(Number(movieId))) {
        setLike(true);
      } else if(likeMovies.length === 0) {
        setDoc(likeRef, {moviesArray: []});
      }
    }
  }, [likeMoviesLoading])

  useEffect(() => {
    if(userCommentsLoading === 'succeeded' && userComments.length === 0) {
      setDoc(userCommentRef, {commentsArray: []});
    }
  }, [userCommentsLoading])

  useEffect(() => {
    if(movieCommentsLoading === 'succeeded' && comments.length === 0) {
      setDoc(movieCommentRef, {comments: []});
    }
  }, [movieCommentsLoading])

  useEffect(() => {
    if(trailerLoading === 'succeeded' && trailer.length > 0) {
      setMovieTrailer(trailerKey());
    }
  }, [trailerLoading])


  const onLikeButtonClick = () => {
    if(like) {
      updateDoc(likeRef, {moviesArray: arrayRemove(Number(movieId))});
      setLike(false);
    } else {
      updateDoc(likeRef, {moviesArray: arrayUnion(Number(movieId))});
      setLike(true);
    }
  }

  const trailerKey = () => {
    const result: string[] = []
    for(let i = 0; i < trailer.length; i++) {
      if(trailer[i].official) result.push(trailer[i].key);
    }

    return result.length > 0 ? result[0] : trailer[0].key;
  }

  const windowInnerWidth = () => {
    if(window.innerWidth >= 1920){
      setWindowSize('xl3');
    } else if (window.innerWidth >= 1360){
      setWindowSize('xl2')
    } else if (window.innerWidth >= 1280) {
      setWindowSize('xl')
    } else if (window.innerWidth >= 1025) {
      setWindowSize('lg')
    } else if (window.innerWidth >= 768) {
      setWindowSize('md')
    } else if (window.innerWidth >= 640) {
      setWindowSize('sm')
    } else if (window.innerWidth < 640) {
      setWindowSize('xs')}
  }

  window.onresize = windowInnerWidth

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

  const movieDirector: string = director?.name;
  
  const fiveMovieActors: JSX.Element[] = maxFiveActors(actors).map((actor) => (
    <li className = 'w-28'  key={actor.credit_id}>
      <img className="w-20" src={`${IMAGE_URL}w300${actor.profile_path}`} alt='Actor Image'/>
      <p className = 'display whitespace-nowrap overflow-hidden text-ellipsis'>{actor.character}역</p> 
      <p className = 'display whitespace-nowrap overflow-hidden text-ellipsis'>{actor.name}</p>
    </li>
  ))

  const tenMovieActors: JSX.Element[] = maxTenActors(actors).map((actor) => (
  <li className = 'w-28' key={actor.credit_id}>
    <img className="w-20" src={`${IMAGE_URL}w300${actor.profile_path}`} alt='Actor Image'/>
    <p className = 'display whitespace-nowrap overflow-hidden text-ellipsis'>{actor.character}역</p> 
    <p className = 'display whitespace-nowrap overflow-hidden text-ellipsis'>{actor.name}</p>
  </li>
  ))
  const sevenSimilarMovies: JSX.Element[] = maxSevenMovies(similarMovies).map((movie)=> (
  <li key={movie.id}>
    <Link to={`/movies/${movie.id}`}>
      <img  src={movie.poster_path ? `${IMAGE_URL}w300${movie.poster_path}`: null} alt='Similar Movie Image'/>
    </Link>
  </li>
  ))

  const movieYear: string = movieDetails.movieRelease !== undefined ? movieDetails.movieRelease.substring(0,4) : ""

  let imgUrl = ""
  if(movieDetails.movieImage !== undefined) {
    imgUrl = `${IMAGE_URL}w500${movieDetails.movieImage}` 
  }

  const onSubmit = async() => {
    await updateDoc(movieCommentRef, 
      {comments: arrayUnion({
        comment: inputValue.comment,
        nickname: currentUserInfo?.nickname,
        rate: inputValue.rate,
        id: currentUserInfo?.id})})

    await updateDoc(userCommentRef, 
      {commentsArray: arrayUnion({
        comment : inputValue.comment,
        movieId: movieId,
        rate: inputValue.rate})})

    dispatch(fetchMovieComments(movieId));
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

  const removeComment = async() => {
    if(deleteComment) {
      await updateDoc(movieCommentRef, {comments: arrayRemove(deleteComment)});
      await updateDoc(userCommentRef, {commentsArray: arrayRemove({
        comment : deleteComment.comment,
        movieId: movieId,
        rate: deleteComment.rate})});

      dispatch(fetchMovieComments(movieId));
      setDeleteComment(null);
    }
  }


  if(movieDetailsLoading !== 'succeeded' || actorDetailsLoading !== 'succeeded' || 
    similarMoviesLoading !==  'succeeded' || recentRecordsLoading !==  'succeeded' || 
    likeMoviesLoading !==  'succeeded' || currentUserInfoLoading !== 'succeeded' || 
    userCommentsLoading !==  'succeeded' || trailerLoading !==  'succeeded') return <Spinner/>

  return (
    <>
      <section className="relative">
        <div className="opacity-50" style={{backgroundImage: `url(${imgUrl})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', width: '100%', height: '40vw'}}></div>

        <div className="absolute w-3/4 left-[12.5%] bottom-10 flex flex-row justify-between items-end">
          <div className='flex flex-row '>

            <h2 className="text-xl font-bold xl2:text-3xl">{movieDetails.movieTitle}({movieYear})</h2> 
            <div className='flex flex-row items-end ml-4'>{RatingStar(movieDetails.movieRate, windowSize)} 
              <p className="text-lg font-bold ">({movieDetails.movieRate})</p>
            </div>
          </div>

          <button className="btn btn-accent btn-sm rounded-2xl w-28 opacity-100" onClick={onLikeButtonClick}>{like ? <BsFillHeartFill className="mr-3 text-red-600"></BsFillHeartFill> : <BsHeart className="mr-3"></BsHeart>}좋아요</button>
        </div>
      </section>

      <section className="w-3/4 mt-14 mx-auto grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1">  
        <div className="basis-1/4 mr-4 shrink-0" style={{backgroundImage: `url(${IMAGE_URL}w300${movieDetails.moviePoster})`, backgroundRepeat: 'no-repeat', backgroundSize: 'contain', aspectRatio: '1/1.5'}}></div>
        
        <div className="basis-2/4 md:col-span-2">
          <h3 className="text-2xl font-bold mb-4">기본정보</h3>
          <ul className="mr-4 text-lg">
            <li className="flex flex-row">
              장르
              <ul className='grid grid-cols-3'>
              {movieDetails.movieGenres&&movieDetails.movieGenres.map((genre) => <li key={genre.id} className="pl-2 "><p className="text-ellipsis">{genre.name}</p></li>)}
              </ul>
            </li>
            <li>개봉날짜 {movieDetails.movieRelease&&movieDetails.movieRelease}</li>
            <li>언어 {movieDetails.movieLanguage&&movieDetails.movieLanguage}</li>
            <li>러닝타임 {movieDetails.movieRuntime&&movieDetails.movieRuntime}분</li>
            <li>감독 {movieDirector&&movieDirector}</li>
          </ul>
        </div>
        
        <div className="basis-1/4 md:col-span-1 sm:col-span-2">
          <h3 className="text-2xl font-bold mb-4">트레일러</h3>
          {movieTrailer&& <iframe src={`https://www.youtube.com/embed/${movieTrailer}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
        </div>
        
      </section>

      <section className="w-3/4  mx-auto ">
        <div className='divider'></div>
        <div>
          <h3 className="text-2xl font-bold mb-4">출연진</h3>
          <ul className='flex flex-row overflow-auto'>
            {moreCredits ? tenMovieActors : fiveMovieActors}
            <li><button className='btn btn-primary btn-sm' onClick={()=>moreCredits ? setMoreCredits(false) :setMoreCredits(true)}>{moreCredits ? `접기` : `더보기`}</button></li>
          </ul>
        </div>
        <div className='divider'></div>
        <div>
          <h3 className="text-2xl font-bold mb-4">줄거리</h3>
          <p>{movieDetails.movieOverview&&movieDetails.movieOverview}</p>
        </div>
        <div className='divider'></div>
        <h3 className="text-2xl font-bold mb-4">비슷한 영화</h3>

        <ul className='flex flex-row justify-between'>
          {sevenSimilarMovies}
        </ul>
        <div className='divider'></div>
      </section>


      <section className="w-3/4  mx-auto flex flex-col mb-8">
        <h3 className="text-2xl font-bold mb-4">감상평</h3>
        <div className='bg-gray-300 flex flex-col items-center py-8'>

          <p className='mb-4'>별점을 선택해주세요</p>

          <form className="flex flex-col items-center w-full" onSubmit={handleSubmit} >

          <div className="rating rating-md rating-half mb-4" ref={rateInputRef}>
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
          {comments && comments.map((comment, index)=> (
          <div key={index}>
            <div className="flex flex-row justify-between" > 
              <div> 
                <div className="flex flex-row my-4">{RatingStar(comment.rate, windowSize)}</div>  
                <span >{comment.comment}</span> 
                <p className="text-gray-400">{comment.nickname}</p>
              </div> 
              <div>{comment.id == currentUserInfo?.id ?
                <label htmlFor="my-modal-6" className="modal-button cursor-pointer" onClick={() => {setDeleteComment(comment)}}>
                  <BiXCircle className="text-gray-400 text-2xl" ></BiXCircle> 
                </label> : ""}
              </div> 
            </div> 
            <div className="divider"></div>
          </div>
          )
        )}
        </div>
        
        <input type="checkbox" id="my-modal-6" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">정말 감상평을 삭제하시겠습니까?</h3>
            <p className="py-4">삭제 후엔 되돌릴 수 없습니다.</p>
            <div className="modal-action">
              <label htmlFor="my-modal-6" className="btn" onClick={removeComment}>삭제</label>
              <label htmlFor="my-modal-6" className="btn btn-outline">취소</label>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  )
};


export default DetailedPages;

