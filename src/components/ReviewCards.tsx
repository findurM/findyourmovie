import { Link } from "react-router-dom";
import RatingStar from "../components/RatingStar";

interface Props {
  image: string;
  review: string;
  title: string;
  movieId: number;
  rate: number;
  index: number;
}

const ReviewCards = ({ image, review, title, movieId, rate, index }: Props) => {
  return (
    <div
      className="card card-compact bg-base-100 shadow-xl w-full h-full max-w-[305px] min-h-[260px]"
      style={{ aspectRatio: "305 / 440" }}
    >
      <Link to={`/movies/${movieId}`} key={index} className={"basis-1/2"}>
        <figure className="w-full h-full overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover hover:scale-125 duration-100" />
        </figure>
      </Link>
      <div className="flex flex-col justify-between p-5 basis-1/2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">{RatingStar(rate)}</div>
          <p className="text-sm ellipsis-box-3-sm">{review}</p>
        </div>
        <div className="card-actions justify-end items-center">
          <h2 className="flex-1 text-base font-bold truncate">{title}</h2>
          <Link to={`/movies/${movieId}`} key={index}>
            <button className="btn btn-accent btn-outline rounded-[1.125rem] text-sm px-3 min-h-fit h-8">더보기</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReviewCards;
