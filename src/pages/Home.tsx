import { useEffect,useRef,useState } from "react";
import { API_URL,API_KEY,IMAGE_URL } from "../config/config"
import MainImage from "../components/MainImage"
import GridCards from "../components/GridCards";
import { Link } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component'
import {BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill} from 'react-icons/bs'


export interface IHomePageProps {}


const HomePage: React.FunctionComponent<IHomePageProps> = (props) => {

  const [Movies, setMovies] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(2)
  // const [bestMovies, setBestMovies] = useState([])

  const movieCarouselRef = useRef<HTMLDivElement>()
  const dramaCarouselRef = useRef<HTMLDivElement>()

  useEffect(() => {
    const endpoint = `${API_URL}movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
    fetch(endpoint)
    .then(response => response.json())
    .then(response => {
      setMovies([...response.results])
      // let bestIds = [response.results.slice(0,8)].map((movie) => movie.id)
      // setBestMovies(bestIds)
    })
  },[])

 const fetchMovies = async () => {
   const res = await fetch(`${API_URL}movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`)
   const data = await res.json()
   return data.results
 }

  const fetchData = async () => {
    const newMovies = await fetchMovies()
    console.log(newMovies)
    setMovies([...Movies, ...newMovies])
    console.log(Movies);
    
    setPage(page+1)
    if(page >= 12) {
      setHasMore(false)
    }
  }

  let tmp = 0
  const movieRightShift = () => {
    if (movieCarouselRef.current) {
      movieCarouselRef.current.style.left = String(tmp - 100) +'px'
      tmp-=100
    }
  }

  const movieLeftShift = () => {
    if (movieCarouselRef.current) {
      movieCarouselRef.current.style.left = String(tmp + 100) +'px'
      tmp+=100
    }
  }
  const dramaRightShift = () => {
    if (dramaCarouselRef.current) {
      dramaCarouselRef.current.style.left = String(tmp - 100) +'px'
      tmp-=100
    }
  }

  const dramaLeftShift = () => {
    if (dramaCarouselRef.current) {
      dramaCarouselRef.current.style.left = String(tmp + 100) +'px'
      tmp+=100
    }
  }

  return (
    <>
      <MainImage image={`/assets/FindurM_main_hero.jpg`}/>
      <section>
        <div className="relative w-2/3 h-60 bg-black mx-auto mt-16">
        <p className="absolute text-4xl text-primary top-16 left-12 text-center z-20">
        <Link to='/movielist'> 영화 <br/>인기작</Link>
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
              <button className="absolute top-24 left-48 text-primary z-30" onClick={movieRightShift}><BsFillArrowLeftCircleFill size={36}/></button>
              <button className="absolute top-24 right-2 text-primary z-30" onClick={movieLeftShift}><BsFillArrowRightCircleFill size={36}/></button>
            <svg className="w-full h-full absolute top-0 left-0">
                <line x1="0" y1="100%" x2="100%" y2="0" className="stroke-gray-400 stroke-2" />
                <line x1="0" y1="0" x2="100%" y2="100%" className="stroke-gray-400 stroke-2"/>
            </svg>
        </div>
        <div className="relative w-2/3 h-60 bg-black mx-auto mt-10">
          <p className="absolute text-4xl text-primary top-16 left-12 text-center z-20">
          <Link to='/tvshowlist'> 드라마 <br/>인기작</Link>
            </p>
              <div className="carousel  carousel-center p-4 space-x-4 bg-transparent rounded-box z-10 absolute top-3 left-40" ref={dramaCarouselRef}>
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
            <button className="absolute top-24 left-48 text-primary z-30" onClick={dramaRightShift}><BsFillArrowLeftCircleFill size={36}/></button>
              <button className="absolute top-24 right-2 text-primary z-30" onClick={dramaLeftShift}><BsFillArrowRightCircleFill size={36}/></button>
            <svg className="w-full h-full absolute top-0 left-0">
                <line x1="0" y1="100%" x2="100%" y2="0" className="stroke-gray-400 stroke-2" />
                <line x1="0" y1="0" x2="100%" y2="100%" className="stroke-gray-400 stroke-2"/>
            </svg>
        </div>
      </section>

      <section className="max-w-7xl mx-auto mt-20">
        <div className="mt-[3.75rem] mb-[1.875rem]">
          <h2 className="text-5xl font-bold pb-10 mt-">영화평점 TOP 250</h2>
          <InfiniteScroll className="w-full h-full"
          dataLength={Movies.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4 className="text-center">로딩중...</h4>}
          endMessage={
            <p className="text-center py-10">
              <b className="text-2xl">모든 영화를 가져왔습니다!</b>
            </p>
          }>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-5 m-auto">
          {Movies && Movies.map((movie,index) => (
            <Link to={`/movies/${movie.id}`} key={index} className="w-full h-full">
              <GridCards 
                image={movie.poster_path ? `${IMAGE_URL}w500${movie.poster_path}`: null}
                alt={movie.original_title}
              />
            </Link>
                  ))}
          </div>
          </InfiniteScroll>
        </div>
      </section>
    </>
  );
};

export default HomePage;

