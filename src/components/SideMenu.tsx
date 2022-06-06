import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";
import tw from "tailwind-styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { MypageCategory, setCategory } from "../features/mypageCategorySlice";

const categoryList = {
  "recent-records": "최근 기록",
  "my-likes": "좋아요",
  "my-reviews": "감상평",
  "my-info": "회원 정보"
}

const MypageContainer = tw.div`
flex
gap-5
mx-auto
max-w-7xl
pt-[3.75rem]
`

const SideMenuBox = tw.div`
flex
flex-col
divide-y
max-w-[305px]
w-full
`

const SideMenu = () => {
  const categoryInfo = useSelector<RootState, MypageCategory>((state) => state.mypageCategory);
  const dispatch = useDispatch();

  useEffect(() => {

  }, [categoryInfo]);
  
  return (
    <MypageContainer>
      <SideMenuBox>
        <h2 className="text-[2rem] mb-5">마이 페이지</h2>
        <div className="pt-[1.875rem]">
          <ul className="flex flex-col gap-[1.875rem] text-2xl">
            {Object.entries(categoryList).map((category) => (
              <li>
                <Link to={category[0]} key={category[0]} 
                  className={categoryInfo.category === category[0] ? "font-bold" : ""}
                  onClick={() => {
                    localStorage.setItem('mypageCategory', category[0]);
                    dispatch(setCategory(category[0]));
                  }}>
                    {category[1]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SideMenuBox>
      <Outlet/>
    </MypageContainer>
  )
};

export default SideMenu;