import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

interface Props {}

const ErrorPage = () => {
  return (
    <>
    <div className="min-h-[75vh] lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
    <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div className="relative">
            <div className="absolute">
                <div className="">
                    <h1 className="my-2 text-gray-800 font-bold text-4xl">
                       페이지가 존재하지 않습니다!
                    </h1>
                    <p className="my-2 text-gray-800 text-2xl">잘못된 경로를 찾아오셨습니다.</p>
                    <Link to='/'><button className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-accent text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">메인 페이지로 가기!</button></Link>
                </div>
            </div>
            <div>
                <img src="https://i.ibb.co/G9DC8S0/404-2.png" />
            </div>
        </div>
    </div>
    <div>
        <img src="https://i.ibb.co/ck1SGFJ/Group.png" />
    </div>
</div>
<Footer/>
</>
  )
}

export default ErrorPage