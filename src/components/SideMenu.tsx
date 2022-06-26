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
  "my-info": "회원정보조회"
}

const MypageContainer = tw.div`
flex
flex-col
xl:flex-row
gap-5
mx-auto
w-3/4
pt-[3.75rem]
`

const SideMenuBox = tw.div`
flex
flex-col
divide-y-[3px]
divide-current
w-full
xl:max-w-[305px]
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
        <div className="pt-4 overflow-x-auto">
          <ul className="menu menu-horizontal xl:menu-vertical bg-base-100 w-full p-2">
            {Object.entries(categoryList).map((category) => (
              <li key={category[0]}>
                <Link to={category[0]} key={category[0]} 
                  className={(categoryInfo.category === category[0] ? "active font-bold " : "") + "text-2xl py-3.5 shrink-0 w-max xl:w-full"}
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