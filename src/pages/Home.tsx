import { useEffect,useRef,useState } from "react";
import { API_URL,API_KEY,IMAGE_URL } from "../config/config"
import MainImage from "../components/MainImage"
import GridCards from "../components/GridCards";
import { Link } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component'
import Carousel from "../components/Carousel";
import tw from "tailwind-styled-components/dist/tailwind";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Application";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { InputBox } from "./Register";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { isExistUserInfo } from "../features/fetchUserInfoSlice";

const Ranking = tw.div`
absolute
top-3
right-36
text-2xl
bg-primary
z-10
rounded-full
p-2
font-bold
md:top-3
md:right-3
`

export interface IHomePageProps {}


const HomePage: React.FunctionComponent<IHomePageProps> = (props) => {

  const auth = getAuth();
  const [Movies, setMovies] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(2)
  const [bestMovies, setBestMovies] = useState([])
  const [age, setAge] = useState(20)
  const [selectedRadio, setSelectedRadio] = useState('여')
  const dispatch = useDispatch<AppDispatch>();

  const ageRef = useRef<HTMLInputElement>()

  const handleRange = () => {
    setAge(Number(ageRef.current.value))
  }

  const isRadioSelected = (value:string) : boolean => selectedRadio === value

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedRadio(e.currentTarget.value)
  }

  useEffect(() => {
    const endpoint = `${API_URL}movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
    fetch(endpoint)
    .then(response => response.json())
    .then(response => {
      setMovies([...response.results])
      let bestIds = [...response.results.slice(0,8)].map((movie) => movie.id)
      setBestMovies(bestIds)
    })
  },[])
  
  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(isExistUserInfo(user.uid))
        .then((isExist) => {
          if(!isExist) {
            (document.querySelector("label.modal-button") as HTMLLabelElement).click();
          }
        });
      }
    });

    return () => AuthCheck();
  }, [auth]);

  const fetchMovies = async () => {
    const res = await fetch(`${API_URL}movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`)
    const data = await res.json()
    return data.results
  }

  const fetchData = async () => {
    const newMovies = await fetchMovies()
    setMovies([...Movies, ...newMovies])
    
    setPage(page+1)
    if(page >= 12) {
      setHasMore(false)
    }
  }

  const updateUserInfo = async () => {
    await updateDoc(doc(db,"users", auth.currentUser?.uid),
                          {age: age,
                          sex: selectedRadio})
  }

  return (
    <>
      <MainImage image={`/assets/FindurM_main_hero.jpg`}/>

      <label htmlFor="my-modal-6" className="btn modal-button" style={{display: "none"}}>open modal</label>

      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-5">성별과 나이를 입력해주세요!</h3>
          <InputBox>
            <label htmlFor="sex">
              성별
            </label>
            <div className='mt-3 w-full flex'>
              <div className='mr-3 flex justify-between w-10'> 
                <span>남</span>
                <input type="radio" name="radio-3" value='남' className="radio radio-secondary" 
                checked={isRadioSelected('남')} 
                onChange={handleRadio} />
              </div>
              <div className='flex justify-between w-10'>
                <span>여</span>
                <input type="radio" name="radio-3" value='여' className="radio radio-secondary" 
                  checked={isRadioSelected('여')} 
                  onChange={handleRadio} />
              </div>
            </div>
          </InputBox>
          <InputBox>
            <label htmlFor="age">
              나이: {age}세
            </label>
            <input 
            type="range" min="10" max="90" value={age} step="1" className="range range-secondary my-3"
            id='age'
            name='age'
            onChange={handleRange}
            ref={ageRef}
            />
          </InputBox>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn" onClick={updateUserInfo}>확인</label>
          </div>
        </div>
      </div>

      <section>
          <Carousel category='최신'/>
          <Carousel category='개봉예정'/>
      </section>

      <section className="mt-20">
        <div className="w-3/4 mx-auto mt-[3.75rem] mb-[1.875rem]">
          <h2 className="text-5xl font-bold pb-10 mt-">영화평점 TOP 250</h2>
          <InfiniteScroll className="w-full h-full"
          dataLength={Movies.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4 className="text-center">로딩중...</h4>}
          endMessage={
            <p className="text-center py-10">
              <b className="text-2xl">모든 영화를 가져왔습니다!</b>
            </p>
          }>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-5 m-auto">
          {Movies && Movies.map((movie,index) => (
            <Link to={`/movies/${movie.id}`} key={index} className="w-full flex justify-center h-full relative">
              <GridCards 
                image={movie.poster_path ? `${IMAGE_URL}w500${movie.poster_path}`: null}
                alt={movie.original_title}
                movie={movie}
              />
              {bestMovies.includes(movie.id) ? (<Ranking>{index+1}위</Ranking>): null}
            </Link>
                  ))}
          </div>
          </InfiniteScroll>
        </div>
      </section>
    </>
  );
};

export default HomePage;

