import { useDispatch } from "react-redux";
import { setCurrentMovie } from "../features/movieSlice";
import { Movie } from "../features/searchResultSlice";
import { BsHeart, BsFillHeartFill } from "react-icons/bs";
import { RiMovie2Line } from "react-icons/ri";
import tw from "tailwind-styled-components/dist/tailwind";
import { useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../Application";

interface Props {
  image: string;
  alt: string;
  movie?: Movie;
}

const GridCards = ({ image, alt, movie }: Props) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setCurrentMovie(movie));
  };

  const noInfo = (e: EventInit) => {
    (e as Event).preventDefault();
    alert("개봉 예정작입니다.");
  };

  return (
    <div className="card card-compact bg-base-100 shadow-xl w-full max-w-[305px]" onClick={handleClick}>
      <figure className="w-full h-full">
        {image ? (
          <img
            src={image}
            alt={alt}
            style={{ aspectRatio: "1 / 1.5" }}
            className="w-full h-full object-cover hover:scale-125 duration-100"
          />
        ) : (
          <div
            className="w-full h-full hover:scale-125 duration-100 flex flex-col justify-center items-center"
            style={{ aspectRatio: "1 / 1.5" }}
            onClick={noInfo}
          >
            <RiMovie2Line size={50}></RiMovie2Line>
            <figcaption className="font-bold">{alt}</figcaption>
          </div>
        )}
      </figure>
    </div>
  );
};

const BtnHeart = tw.button`
absolute
btn
border-transparent
bottom-3
right-3
bg-base-100
z-10
rounded-full
p-3
`;

export const LikeGridCards = ({ image, alt: movieId }: Props) => {
  const localStorageUserInfo = JSON.parse(localStorage.getItem("user"));
  const [like, setLike] = useState(true);

  const likeRef = doc(db, "users", localStorageUserInfo.uid, "likeMovies", "movies");
  const onHeartButtonClick = (e: Event) => {
    e.preventDefault();
    if (like) {
      updateDoc(likeRef, { moviesArray: arrayRemove(Number(movieId)) });
      setLike(false);
    } else {
      updateDoc(likeRef, { moviesArray: arrayUnion(Number(movieId)) });
      setLike(true);
    }
  };

  return (
    <div className="relative w-fit">
      <GridCards image={image} alt={movieId} />
      <BtnHeart onClick={onHeartButtonClick}>
        {like ? (
          <BsFillHeartFill className="text-red-600 w-6 h-6"></BsFillHeartFill>
        ) : (
          <BsHeart className="w-6 h-6"></BsHeart>
        )}
      </BtnHeart>
    </div>
  );
};

export default GridCards;
