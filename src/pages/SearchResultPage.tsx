import { useEffect,useRef,useState } from "react";
import { API_URL,API_KEY,IMAGE_URL } from "../config/config"
import GridCards from "../components/GridCards";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {RootState} from '../app/store'
import {Movie} from '../features/searchResultSlice'
import MainImage from "../components/MainImage";
import Footer from "../components/Footer";


const SearchResultPage =  () => {
    const searchResult =  useSelector((state: RootState) => state.searchResult.value)
  return (
      <>
       <MainImage image={`/assets/FindurM_main_hero.jpg`}/>
        <section className="w-2/3 mx-auto mt-12">
            <div className="flex justify-between">
                <h1 className="text-4xl mb-10">검색 결과</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-5 m-auto">
            {searchResult && searchResult.map((movie,index) => (
                <Link to={`/movies/${movie.id}`} key={index} className="w-full h-full">
                <GridCards 
                    image={movie.poster_path ? `${IMAGE_URL}w500${movie.poster_path}`: null}
                    alt={movie.original_title}
                    movie={movie}
                />
                </Link>
                    ))}
            </div>
        </section>
        <Footer/>
      </>
  )
}

export default SearchResultPage