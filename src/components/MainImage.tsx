import React, { useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL, API_KEY } from "../config/config";
import { setSearchResult } from "../features/searchResultSlice";

interface Props {
  image: string;
}

const MainImage = ({ image }: Props) => {
  const inputRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = inputRef.current.value;
    const endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=ko-KR&page=1&query=${query}`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((response) => dispatch(setSearchResult(response.results)));
    navigate("/search");
  };

  return (
    <>
      <section className="h-1/2">
        <div className="hero h-full" style={{ backgroundImage: `url(${image})` }}>
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-white w-full">
            <div className="w-full">
              <h1 className="mb-5 text-5xl font-bold">What is your Movie?</h1>
              <h1 className="mb-5 text-5xl font-bold pb-16">Let's find your Movie!</h1>
              <form className="relative w-3/5 mx-auto" onSubmit={onSubmit}>
                <input
                  type="search"
                  placeholder="Search.."
                  className="input input-bordered input-primary w-full pl-10 text-black"
                  ref={inputRef}
                />
                <button type="submit" className="absolute top-3 left-2 text-black">
                  <BiSearch size={24} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainImage;
