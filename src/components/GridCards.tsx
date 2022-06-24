import { useDispatch } from 'react-redux'
import {setCurrentMovie} from '../features/movieSlice'
import {Movie} from '../features/searchResultSlice'
import {BsHeart,BsFillHeartFill} from 'react-icons/bs'
import tw from "tailwind-styled-components/dist/tailwind";
import { useState } from 'react';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Application';

interface Props {
    image: string,
    alt: string,
    movie?: Movie
}

const GridCards = ({image, alt, movie}:Props) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setCurrentMovie(movie))
  }

  return(
    <div className="card card-compact bg-base-100 shadow-xl w-full max-w-[305px]" onClick={handleClick}>
      <figure className='w-full h-full'>
        <img src={image} alt={alt} style={{aspectRatio: "1 / 1.5"}} className="w-full h-full object-cover hover:scale-125 duration-100" />
      </figure>
    </div>
  )
}

const BtnHeart = tw.button`
absolute
btn
border-transparent
bottom-3
right-3
bg-base-100
z-10
rounded-full
p-3
`

export const LikeGridCards = ({image, alt: movieId}:Props) => {
  const localStorageUserInfo = JSON.parse(localStorage.getItem('user'));
  const [like, setLike] = useState(true);

  const likeRef = doc(db, "users", localStorageUserInfo.uid, 'likeMovies','movies');
  const onHeartButtonClick = (e: Event) => {
    e.preventDefault();
    if(like) {
      updateDoc(likeRef, {moviesArray: arrayRemove(Number(movieId))});
      setLike(false);
    } else {
      updateDoc(likeRef, {moviesArray: arrayUnion(Number(movieId))});
      setLike(true);
    }
  }

  return (
    <div className='relative w-fit'>
      <GridCards 
        image={image}
        alt={movieId}
      />
      <BtnHeart onClick={onHeartButtonClick}>{like ? <BsFillHeartFill className="text-red-600 w-6 h-6"></BsFillHeartFill> : <BsHeart className="w-6 h-6"></BsHeart>}</BtnHeart>
    </div>
  )
}

export default GridCards;