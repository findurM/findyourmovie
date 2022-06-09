import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, UserInfo } from "../Application";
import { API_URL,API_KEY,IMAGE_URL } from "../config/config"

export interface DetailedPages {}

const DetailedPages: React.FC<DetailedPages> = () => {
  const [movieFullDetails, setMovieFullDetails] = useState([])
  const movieId = useParams().id
 

useEffect(() => {
  async function fetchData(){
    const movieDetailApi = `${API_URL}/movie/${movieId}?api_key=${API_KEY}`
    const res = await fetch(movieDetailApi)
    const results = await res.json()
    setMovieFullDetails(results)
    return results
  }
  fetchData()
},[])


 


  return (
    <div>
      디테일 페이지입니다.
    </div>
  )
};


export default DetailedPages;
