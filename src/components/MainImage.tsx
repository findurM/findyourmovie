import React from 'react'
import {BiSearch} from 'react-icons/bi'

interface Props {
    image:string
}

const MainImage = ({image}:Props) => {
  return (
      <>
        <section className='h-1/2' >
        <div className="hero h-full" style={{backgroundImage: `url(${image})`}}>
  <div className="hero-overlay bg-opacity-60"></div>
  <div className="hero-content text-center text-white w-full">
    <div className="w-full">
      <h1 className="mb-5 text-5xl font-bold">What is your Movie?</h1>
      <h1 className="mb-5 text-5xl font-bold pb-16">Let's find your Movie!</h1>
      <form className='relative w-3/5 mx-auto'>
      <input type="search" placeholder="Search.." className="input input-bordered input-primary w-full pl-10 text-black" />
      <button type='submit' className='absolute top-3 left-2 text-black'><BiSearch size={24}/></button>
      </form>
    </div>
  </div>
</div>
        </section>
      </>
  )
}

export default MainImage