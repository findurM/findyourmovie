import React from 'react'

interface Props {
    image: string,
    movieName: string
}

const GridCards = ({image, movieName}:Props) => {
  return(
    <div className="card card-compact bg-base-100 shadow-xl w-full max-w-[305px]">
      <figure className='w-full h-full'><img src={image} alt={movieName} className="w-full h-full object-cover hover:scale-125 duration-100" /></figure>
    </div>
  )
}

export default GridCards