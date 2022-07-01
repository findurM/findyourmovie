import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";
import tw from "tailwind-styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { MypageCategory, setCategory } from "../features/mypageCategorySlice";
import Footer from "./Footer";

const categoryList = {
  "recent-records": "최근 기록",
  "my-likes": "좋아요",
  "my-reviews": "감상평",
  "my-info": "회원정보조회",
};

const MypageContainer = tw.div`
flex
flex-col
lg:flex-row
gap-5
mx-2.5
xs:mx-auto
max-w-[calc(100vw-20px)]
w-full
xs:w-3/4
pt-[3.75rem]
min-h-[90vh]
`;

const SideMenuBox = tw.div`
flex
flex-col
divide-y-[3px]
divide-current
w-full
lg:max-w-[305px]
`;

export const MypageTitle = tw.h2`
text-2xl
font-bold
`;

export const MypageGridArea = tw.div`
grid
grid-cols-1
xs2:grid-cols-2
md:grid-cols-3
lg:grid-cols-2
xl2:grid-cols-3
justify-items-center
gap-5
mx-auto
`;

const SideMenu = () => {
  const categoryInfo = useSelector<RootState, MypageCategory>((state) => state.mypageCategory);
  const dispatch = useDispatch();

  useEffect(() => {}, [categoryInfo]);

  return (
    <>
      <MypageContainer>
        <SideMenuBox>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5">마이 페이지</h2>
          <div className="pt-4 overflow-x-auto">
            <ul className="menu menu-horizontal lg:menu-vertical bg-base-100 w-full p-2">
              {Object.entries(categoryList).map((category) => (
                <li key={category[0]}>
                  <Link
                    to={category[0]}
                    key={category[0]}
                    className={
                      (categoryInfo.category === category[0] ? "active font-bold " : "") +
                      "text-lg lg:text-xl py-[7px] lg:py-3.5 shrink-0 w-max lg:w-full"
                    }
                    onClick={() => {
                      localStorage.setItem("mypageCategory", category[0]);
                      dispatch(setCategory(category[0]));
                    }}
                  >
                    {category[1]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </SideMenuBox>
        <Outlet />
      </MypageContainer>
      <Footer />
    </>
  );
};

export default SideMenu;
