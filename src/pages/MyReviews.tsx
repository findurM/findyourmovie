import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import ReviewCards from "../components/ReviewCards";
import { MypageGridArea, MypageTitle } from "../components/SideMenu";
import Spinner from "../components/Spinner";
import { IMAGE_URL } from "../config/config";
import {
  fetchMypageUserComments,
  fetchUserComments,
  resetMypageUserComments,
  resetUserComments,
  UserCommentsState,
} from "../features/fetchUserCommentsSlice";
import { fetchUserInfo, UserInfoState } from "../features/fetchUserInfoSlice";

const MyReviews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [total, setTotal] = useState(6);
  const [isFinish, setIsFinish] = useState(false);
  const { userInfo: currentUserInfo, loading: currentUserInfoLoading } = useSelector<RootState, UserInfoState>(
    (state) => state.userInfo,
  );
  const {
    userComments,
    mypageUserComments,
    loading: userCommentsLoading,
  } = useSelector<RootState, UserCommentsState>((state) => state.userComments);

  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(resetUserComments());
  }, []);

  useEffect(() => {
    if (userCommentsLoading === "idle") {
      dispatch(fetchUserComments());
    } else if (userCommentsLoading === "succeeded") {
      dispatch(resetMypageUserComments());
      if (userComments.length > 0) {
        if (total >= userComments.length) {
          setTotal(() => userComments.length);
          setIsFinish(true);
        }
        userComments.slice(0, total).forEach((comment) => {
          dispatch(fetchMypageUserComments(comment));
        });
      }
    }
  }, [userCommentsLoading]);

  const moreReviews = () => {
    if (total + 6 >= userComments.length) setIsFinish(() => true);

    userComments.slice(total, isFinish ? userComments.length : total + 6).forEach((comment) => {
      dispatch(fetchMypageUserComments(comment));
    });

    setTotal(() => {
      return isFinish ? userComments.length : total + 6;
    });
  };

  if (currentUserInfoLoading !== "succeeded" || userCommentsLoading !== "succeeded") return <Spinner />;

  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-[3.75rem]">
          <MypageTitle>{currentUserInfo?.nickname} 님의 감상평</MypageTitle>
        </div>

        {mypageUserComments.length === 0 ? (
          <div>작성한 감상평이 없습니다.</div>
        ) : (
          <>
            <MypageGridArea>
              {mypageUserComments.map((comment, index) => (
                <ReviewCards
                  image={comment.backdrop ? `${IMAGE_URL}w500${comment.backdrop}` : null}
                  review={comment.comment}
                  title={comment.title}
                  movieId={comment.movieId}
                  rate={comment.rate}
                  index={index}
                  key={index}
                />
              ))}
            </MypageGridArea>
            {isFinish ? (
              ""
            ) : (
              <button className="btn btn-active btn-secondary rounded-full block mt-10 mx-auto" onClick={moreReviews}>
                더 불러오기
              </button>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default MyReviews;
