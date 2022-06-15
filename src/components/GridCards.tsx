import React from 'react'
import { useDispatch } from 'react-redux'
import {setCurrentMovie} from '../features/movieSlice'
import {Movie} from '../features/searchResultSlice'

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

export default GridCards