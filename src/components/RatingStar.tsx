import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { BiStar } from "react-icons/bi";

export default function ratingStar(rate: number, size?: string): JSX.Element[] {
  let rating: number = rate / 2;
  const result: JSX.Element[] = [];

  if (size === "xl3" || size === "xl2" || size === "xl") {
    for (let i = 0; i < 5; i++) {
      if (rating >= 1) {
        result.push(<BsStarFill fill="#eab308" size="1.5rem" key={i}></BsStarFill>);
        rating -= 1;
      } else if (rating >= 0.25) {
        result.push(<BsStarHalf fill="#eab308" size="1.5rem" key={i}></BsStarHalf>);
        rating = 0;
      } else result.push(<BiStar fill="#eab308" size="1.5rem" key={i}></BiStar>);
    }
  } else {
    for (let i = 0; i < 5; i++) {
      if (rating >= 1) {
        result.push(<BsStarFill fill="#eab308" size="1.2rem" key={i}></BsStarFill>);
        rating -= 1;
      } else if (rating >= 0.25) {
        result.push(<BsStarHalf fill="#eab308" size="1.2rem" key={i}></BsStarHalf>);
        rating = 0;
      } else result.push(<BiStar fill="#eab308" size="1.2rem" key={i}></BiStar>);
    }
  }
  return result;
}
