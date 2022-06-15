import { Link } from "react-router-dom";
import {BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill} from 'react-icons/bs'
import { useRef, useState } from "react";

interface Props {
    category: string
}

const Carousel = ({category}:Props) => {

    const [offset, setOffset] = useState(0)

    const movieCarouselRef = useRef<HTMLDivElement>()

    const rightShift = () => {
      if(offset <= -90) return
      if (movieCarouselRef.current) {
        movieCarouselRef.current.style.transform = `translate(${offset-10}rem)`
        setOffset(offset-10)
      }
    }
  
    const leftShift = () => {
      if (movieCarouselRef.current) {
        if(offset >= 0) return
        movieCarouselRef.current.style.transform = `translate(${offset+10}rem)`
        setOffset(offset+10)
      }
    }

  return (
    <div className="relative w-3/4 h-60 bg-black mx-auto mt-12 overflow-hidden">
        <svg className="w-full h-full absolute top-0 left-0">
            <line x1="0" y1="100%" x2="100%" y2="0" className="stroke-gray-400 stroke-2" />
            <line x1="0" y1="0" x2="100%" y2="100%" className="stroke-gray-400 stroke-2"/>
        </svg>
        <p className="absolute text-4xl text-primary top-16 left-12">
            <Link to='/movielist'> {category} <br/>영화</Link>
        </p>
        <div className="overflow-hidden relative top-3 left-60 w-3/4">
            <div className="carousel carousel-center p-4 bg-transparent rounded-box w-[130rem] h-full
            transition duration-150 ease-out" ref={movieCarouselRef}>
                <div className="carousel-item w-[13rem] ">
                    <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=8B7BCDC2" className="rounded-box" />
                </div> 
                <div className="carousel-item w-[13rem] ">
                    <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=8B7BCDC2" className="rounded-box" />
                </div> 
                <div className="carousel-item w-[13rem] ">
                    <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=8B7BCDC2" className="rounded-box" />
                </div> 
                <div className="carousel-item w-[13rem] ">
                    <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=8B7BCDC2" className="rounded-box" />
                </div> 
                <div className="carousel-item w-[13rem] ">
                    <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=8B7BCDC2" className="rounded-box" />
                </div> 
                <div className="carousel-item w-[13rem] ">
                    <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=8B7BCDC2" className="rounded-box" />
                </div> 
                <div className="carousel-item w-[13rem] ">
                    <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=8B7BCDC2" className="rounded-box" />
                </div> 
                <div className="carousel-item w-[13rem] ">
                    <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=8B7BCDC2" className="rounded-box" />
                </div> 
                <div className="carousel-item w-[13rem] ">
                    <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=8B7BCDC2" className="rounded-box" />
                </div> 
                <div className="carousel-item w-[13rem] ">
                    <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=8B7BCDC2" className="rounded-box" />
                </div> 
                <div className="carousel-item w-[13rem] ">
                    <img src="https://api.lorem.space/image/furniture?w=180&h=180&hash=8B7BCDC2" className="rounded-box" />
                </div> 
            </div>
        </div>
        <button className="absolute top-24 left-52 text-primary" onClick={leftShift}>
            <BsFillArrowLeftCircleFill size={36}/>
        </button>
        <button className="absolute top-24 right-2 text-primary" onClick={rightShift}>
            <BsFillArrowRightCircleFill size={36}/>
        </button>
    </div>
  )
}

export default Carousel