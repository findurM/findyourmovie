import { useEffect, useRef, useState } from "react";
import { API_URL, API_KEY, IMAGE_URL } from "../config/config";
import GridCards from "../components/GridCards";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Footer from "../components/Footer";

interface Props {}

const MovieListPage = () => {
  const [Movies, setMovies] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);
  const [category, setCategory] = useState("popular");

  const selectRef = useRef<HTMLSelectElement>();

  interface ICategory {
    [key: string]: any;
  }

  const categoryKR: ICategory = {
    popular: "인기",
    top_rated: "최고 평점",
    upcoming: "개봉 예정",
  };

  useEffect(() => {
    const endpoint = `${API_URL}movie/${category}?api_key=${API_KEY}&language=ko&page=1`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((response) => {
        setMovies([...response.results]);
      });
  }, [category]);

  const fetchMovies = async () => {
    const res = await fetch(`${API_URL}movie/${category}?api_key=${API_KEY}&language=ko&page=${page}`);
    const data = await res.json();
    return data.results;
  };

  const fetchData = async () => {
    const newMovies = await fetchMovies();
    console.log(newMovies);
    setMovies([...Movies, ...newMovies]);
    setPage(page + 1);
    if (page >= 12) {
      setHasMore(false);
    }
  };

  const changeCategory = () => {
    setCategory(selectRef.current.value);
  };

  return (
    <>
      <section className="w-2/3 mx-auto mt-12">
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-4xl mb-5 sm:mb-10 text-center">{categoryKR[category]} 영화</h1>
          <select className="select select-primary w-full max-w-xs mb-5" onChange={changeCategory} ref={selectRef}>
            <option selected value="popular">
              인기순으로 정렬
            </option>
            <option value="top_rated">평점순으로 정렬</option>
            <option value="upcoming">개봉 예정작</option>
          </select>
        </div>

        <InfiniteScroll
          className="w-full h-full"
          dataLength={Movies.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4 className="text-center">로딩중...</h4>}
          endMessage={
            <>
              <p className="text-center py-10">
                <b className="text-2xl">모든 영화를 가져왔습니다!</b>
              </p>
              <Footer />
            </>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-5 m-auto">
            {Movies &&
              Movies.map((movie, index) => (
                <Link to={`/movies/${movie.id}`} key={index} className="w-full h-full flex justify-center">
                  <GridCards
                    image={movie.poster_path ? `${IMAGE_URL}w500${movie.poster_path}` : null}
                    alt={movie.original_title}
                  />
                </Link>
              ))}
          </div>
        </InfiniteScroll>
      </section>
    </>
  );
};

export default MovieListPage;
