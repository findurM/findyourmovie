import { Link } from "react-router-dom";
import {BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill} from "react-icons/bs"
import { useEffect, useRef, useState } from "react"
import { API_URL,API_KEY,IMAGE_URL } from "../config/config"
import GridCards from "../components/GridCards"

interface Props {
    category: string
}

const Carousel = ({category}:Props) => {

    const [offset, setOffset] = useState(0)
    const [movies, setMovies] = useState([])

    const MAX_OFFSET = 100
    const OFFSET_STEP = MAX_OFFSET/10

    const movieCarouselRef = useRef<HTMLDivElement>()

    interface ICategory {
        "최신": string,
        "개봉예정": string
    }

    const categoryKR:ICategory = {
        "최신": 'popular',
        "개봉예정": "upcoming"
    }
    const getMovies = (category: keyof ICategory) => {
        const newCategory = categoryKR[category]
        const endpoint = `${API_URL}movie/${newCategory}?api_key=${API_KEY}&language=en-US&page=1`
        fetch(endpoint)
        .then(response => response.json())
        .then(response => {
        setMovies([...response.results.slice(0,9)])
            })
        }

    useEffect(() => {
    getMovies(category as keyof ICategory)
    },[])

    const rightShift = () => {
      if(offset <= -MAX_OFFSET+OFFSET_STEP) return
      if (movieCarouselRef.current) {
        movieCarouselRef.current.style.transform = `translate(${offset-OFFSET_STEP}rem)`
        setOffset(offset-OFFSET_STEP)
      }
    }
  
    const leftShift = () => {
      if (movieCarouselRef.current) {
        if(offset >= 0) return
        movieCarouselRef.current.style.transform = `translate(${offset+OFFSET_STEP}rem)`
        setOffset(offset+OFFSET_STEP)
      }
    }

  return (
    <div className="relative w-3/4 h-60 bg-black mx-auto mt-12 overflow-hidden">
        <p className="absolute text-4xl text-primary top-16 left-12">
            <Link to='/movielist'> {category} <br/>영화</Link>
        </p>
        <div className="overflow-hidden relative top-3 left-28 md:top-3 md:left-60 w-3/4">
            <div className={`carousel carousel-center p-4 bg-transparent rounded-box w-[${Number(OFFSET_STEP*10)}rem] md:w-[${Number(OFFSET_STEP*15)}rem] h-full
            transition duration-150 ease-out`} ref={movieCarouselRef}>
                {movies && movies.map((movie,index) => (
                <div className="carousel-item w-[10rem] md:w-[15rem] flex items-center md:items-start ">
                    <Link to={`/movies/${movie.id}`} key={index} 
                    className="w-5/6 flex justify-center h-3/5 relative hover:scale-125">
                    <GridCards
                        image={movie.poster_path ? `${IMAGE_URL}w300${movie.poster_path}`: null}
                        alt={movie.original_title}
                        movie={movie}
                    />
                    </Link>
                </div> ))}
                <Link to='/movielist'><button className="btn p-5 btn-lg bg-primary rounded-full text-white mt-14 ml-8">더 보기</button></Link>
            </div>
        </div>
        <button className="absolute top-36 left-28 md:top-24 md:left-52 text-primary" onClick={leftShift}>
            <BsFillArrowLeftCircleFill size={36}/>
        </button>
        <button className="absolute top-36 md:top-24 right-2 text-primary" onClick={rightShift}>
            <BsFillArrowRightCircleFill size={36}/>
        </button>
    </div>
  )
}

export default Carousel