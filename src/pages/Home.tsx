import { useEffect,useState } from "react";
import { API_URL,API_KEY,IMAGE_URL } from "../config/config"
import MainImage from "../components/MainImage"
import GridCards from "../components/GridCards";
import { Link } from "react-router-dom";


export interface IHomePageProps {}

const HomePage: React.FunctionComponent<IHomePageProps> = (props) => {

  const [Movies, setMovies] = useState([])
  const [MainMovieImage, setMainMovieImage] = useState(null)

  useEffect(() => {
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    fetch(endpoint)
    .then(response => response.json())
    .then(response => {
      setMovies([...response.results])
      setMainMovieImage(response.results[0])
    })
  },[])

  return (
    <>
      <MainImage 
        image={`${IMAGE_URL}w780${MainMovieImage?.backdrop_path}`}
        title={MainMovieImage?.original_title}
        text={MainMovieImage?.overview}
      />
      <section className="max-w-7xl mx-auto">
        <div className="mt-[3.75rem] mb-[1.875rem]">
          <h2 className="text-5xl font-bold">TOP 250</h2>
          <hr/>
        </div>
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
        <div className="flex justify-center">
          <button className="btn btn-secondary text-xl">더 가져오기!</button>
        </div>
      </section>
    </>
  );
};

export default HomePage;

