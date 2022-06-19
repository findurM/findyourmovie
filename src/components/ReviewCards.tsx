import { Link } from "react-router-dom";

interface Props {
  image: string,
  review: string,
  title: string,
  movieId: number,
}

const ReviewCards = ({image, review, title, movieId}: Props) => {
return(
  <div className="card card-compact bg-base-100 shadow-xl w-ful h-fulll max-w-[305px]">
    <Link to={`/movies/${movieId}`} key={movieId}>
      <figure className="w-full h-full max-h-[220px] overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover hover:scale-125 duration-100" />
      </figure>
    </Link>
    <div className="card-body">
      <p className="text-base ellipsis-box-3">{review}</p>
      <div className="card-actions justify-end items-center">
        <h2 className="flex-1 text-lg font-bold truncate">{title}</h2>
        <Link to={`/movies/${movieId}`} key={movieId}>
          <button className="btn btn-accent btn-outline rounded-[1.125rem] text-lg px-[18px] min-h-fit h-9">더보기</button>
        </Link>
      </div>
    </div>
  </div>
)
}

export default ReviewCards;