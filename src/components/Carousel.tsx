import { Link } from "react-router-dom";
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { API_URL, API_KEY, IMAGE_URL } from "../config/config";
import GridCards from "../components/GridCards";

interface Props {
  category: string;
}

const Carousel = ({ category }: Props) => {
  const [offset, setOffset] = useState(0);
  const [movies, setMovies] = useState([]);

  const MAX_OFFSET = 70;
  const OFFSET_STEP = MAX_OFFSET / 10;

  const movieCarouselRef = useRef<HTMLDivElement>();

  interface ICategory {
    최신: string;
    개봉예정: string;
  }

  const categoryKR: ICategory = {
    최신: "popular",
    개봉예정: "upcoming",
  };
  const getMovies = (category: keyof ICategory) => {
    const newCategory = categoryKR[category];
    const endpoint = `${API_URL}movie/${newCategory}?api_key=${API_KEY}&language=ko&page=1`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((response) => {
        setMovies([...response.results.slice(0, 9)]);
      });
  };

  useEffect(() => {
    getMovies(category as keyof ICategory);
  }, []);

  const rightShift = () => {
    if (offset <= -MAX_OFFSET + OFFSET_STEP) return;
    if (movieCarouselRef.current) {
      movieCarouselRef.current.style.transform = `translate(${offset - OFFSET_STEP}rem)`;
      setOffset(offset - OFFSET_STEP);
    }
  };

  const leftShift = () => {
    if (movieCarouselRef.current) {
      if (offset >= 0) return;
      movieCarouselRef.current.style.transform = `translate(${offset + OFFSET_STEP}rem)`;
      setOffset(offset + OFFSET_STEP);
    }
  };

  return (
    <div className="relative w-3/4 h-60 md:h-72 bg-black mx-auto mt-12 overflow-hidden">
      <p className="absolute text-[22px] sm:text-3xl text-bold md:text-4xl text-primary top-20 md:top-24 left-10 md:left-16 w-[80px] md:w-full">
        <Link to="/movielist">
          {" "}
          {category} <br />
          영화
        </Link>
      </p>
      <div className="overflow-hidden relative top-6 left-28 md:left-60 w-3/4">
        <div
          className="carousel carousel-center p-4 bg-transparent w-[105rem]  h-full
            transition duration-150 ease-out touch-auto"
          ref={movieCarouselRef}
        >
          {movies &&
            movies.map((movie, index) => (
              <div className="carousel-item w-[7.5rem] md:w-[10.5rem] flex items-center md:items-start" key={index}>
                <Link
                  to={`/movies/${movie.id}`}
                  className="w-[100px] md:w-[140px] flex justify-center relative hover:scale-110"
                >
                  <GridCards
                    image={movie.poster_path ? `${IMAGE_URL}w300${movie.poster_path}` : null}
                    alt={movie.original_title}
                    movie={movie}
                  />
                </Link>
              </div>
            ))}
          <Link to="/movielist">
            <button className="btn p-5 btn-lg bg-primary rounded-full text-white mt-[3rem] md:mt-[4rem] -ml-2 sm:ml-8">
              더 보기
            </button>
          </Link>
        </div>
      </div>
      <button className="absolute top-24 left-28 md:top-32 md:left-52 text-primary" onClick={leftShift}>
        <BsFillArrowLeftCircleFill size={36} />
      </button>
      <button className="absolute top-24 md:top-32 right-2 text-primary" onClick={rightShift}>
        <BsFillArrowRightCircleFill size={36} />
      </button>
    </div>
  );
};

export default Carousel;
