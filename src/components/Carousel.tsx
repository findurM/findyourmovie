import { Link } from "react-router-dom";
import {BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill} from 'react-icons/bs'
import { useRef } from "react";

interface Props {
    category: string
}

const Carousel = ({category}:Props) => {

    const movieCarouselRef = useRef<HTMLDivElement>()

    let tmp = 0
    const rightShift = () => {
      if (movieCarouselRef.current) {
        movieCarouselRef.current.style.left = String(tmp - 100) +'px'
        tmp-=100
      }
    }
  
    const leftShift = () => {
      if (movieCarouselRef.current) {
        movieCarouselRef.current.style.left = String(tmp + 100) +'px'
        tmp+=100
      }
    }

  return (
    <div className="relative w-2/3 h-60 bg-black mx-auto mt-12">
        <p className="absolute text-4xl text-primary top-16 left-12 text-center z-20">
            <Link to={category === '영화' ? `/movielist` : '/tvshowlist'}> {category} <br/>인기작</Link>
        </p>
        <div className="carousel  carousel-center p-4 space-x-4 bg-transparent rounded-box z-10 absolute top-3 left-40" ref={movieCarouselRef}>
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

        <button className="absolute top-24 left-48 text-primary z-30" onClick={rightShift}>
            <BsFillArrowLeftCircleFill size={36}/>
        </button>
        <button className="absolute top-24 right-2 text-primary z-30" onClick={leftShift}>
            <BsFillArrowRightCircleFill size={36}/>
        </button>
        <svg className="w-full h-full absolute top-0 left-0">
            <line x1="0" y1="100%" x2="100%" y2="0" className="stroke-gray-400 stroke-2" />
            <line x1="0" y1="0" x2="100%" y2="100%" className="stroke-gray-400 stroke-2"/>
        </svg>
    </div>
  )
}

export default Carousel