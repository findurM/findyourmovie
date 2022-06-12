import { useEffect,useRef,useState } from "react";
import { API_URL,API_KEY,IMAGE_URL } from "../config/config"
import MainImage from "../components/MainImage"
import GridCards from "../components/GridCards";
import { Link } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component'
import {BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill} from 'react-icons/bs'
import Carousel from "../components/Carousel";


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
    setPage(page+1)
    if(page >= 12) {
      setHasMore(false)
    }
  }

  return (
    <>
      <MainImage image={`/assets/FindurM_main_hero.jpg`}/>
      <section>
          <Carousel category='영화'/>
          <Carousel category='드라마'/>
      </section>

      <section className="max-w-7xl mx-auto mt-20">
        <div className="mt-[3.75rem] mb-[1.875rem]">
          <h2 className="text-5xl font-bold pb-10 mt-">영화평점 TOP 250</h2>
          <hr/>
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
                movieName={movie.original_title}
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

