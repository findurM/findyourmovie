import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import ReviewCards from "../components/ReviewCards";
import { IMAGE_URL } from "../config/config";
import { fetchMypageUserComments, fetchUserComments, resetMypageUserComments, UserCommentsState } from "../features/fetchUserCommentsSlice";
import { fetchUserInfo, UserInfoState } from "../features/fetchUserInfoSlice";

const MyReviews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {userInfo: currentUserInfo, loading: currentUserInfoLoading} = useSelector<RootState, UserInfoState>((state) => state.userInfo);
  const {userComments, mypageUserComments, loading: userCommentsLoading} = useSelector<RootState, UserCommentsState>((state) => state.userComments);

  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(fetchUserComments());
  }, []);

  useEffect(() => {
    if(userCommentsLoading === 'succeeded' && userComments.length > 0) {
      dispatch(resetMypageUserComments());
      userComments.forEach((comment) => {
        dispatch(fetchMypageUserComments(comment));
      })
    }
  }, [userCommentsLoading]);


  if(currentUserInfoLoading !== 'succeeded' || userCommentsLoading !== 'succeeded') return <div>Loading...</div>

  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-[3.75rem]">
          <h2 className="text-5xl font-bold">{currentUserInfo?.nickname} 님의 감상평</h2>
        </div>

        {mypageUserComments.length === 0
        ? (<div>작성한 감상평이 없습니다.</div>)
        : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-5 m-auto">
          {mypageUserComments.map((comment, index) => (
            <ReviewCards 
              image={comment.backdrop ? `${IMAGE_URL}w500${comment.backdrop}`: null} 
              review={comment.comment} 
              title={comment.title} 
              movieId={comment.movieId}
              rate={comment.rate}
              index={index}
              key={index}
            />
          ))}
        </div>)}
      </section>
    </>
  )
};

export default MyReviews;