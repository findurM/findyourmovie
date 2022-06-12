import { Link } from "react-router-dom";
import {BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill} from 'react-icons/bs'
import { useRef } from "react";

interface Props {
    category: string
}

const Carousel = ({category}:Props) => {

    const movieCarouselRef = useRef<HTMLDivElement>()

    const rightShift = () => {
      if (movieCarouselRef.current) {
      }
    }
  
    const leftShift = () => {
      if (movieCarouselRef.current) {
      }
    }

  return (
    <div className="relative w-3/4 h-60 bg-black mx-auto mt-12">
        <svg className="w-full h-full absolute top-0 left-0">
            <line x1="0" y1="100%" x2="100%" y2="0" className="stroke-gray-400 stroke-2" />
            <line x1="0" y1="0" x2="100%" y2="100%" className="stroke-gray-400 stroke-2"/>
        </svg>
        <p className="absolute text-4xl text-primary top-16 left-12">
            <Link to='/movielist'> {category} <br/>영화</Link>
        </p>
        <div className="carousel carousel-center p-4 space-x-4 bg-transparent rounded-box  absolute top-3 left-60" ref={movieCarouselRef}>
            <div className="carousel-item">
                <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=8B7BCDC2" className="rounded-box" />
            </div> 
            <div className="carousel-item">
                <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=500B67FB" className="rounded-box" />
            </div> 
            <div className="carousel-item">
                <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=A89D0DE6" className="rounded-box" />
            </div>
        </div>
        <button className="absolute top-24 left-52 text-primary" onClick={rightShift}>
            <BsFillArrowLeftCircleFill size={36}/>
        </button>
        <button className="absolute top-24 right-2 text-primary" onClick={leftShift}>
            <BsFillArrowRightCircleFill size={36}/>
        </button>
    </div>
  )
}

export default Carousel