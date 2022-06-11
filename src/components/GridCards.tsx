import React from 'react'

interface Props {
    image: string,
    alt: string
}

const GridCards = ({image, alt}:Props) => {
  return(
    <div className="card card-compact bg-base-100 shadow-xl w-full max-w-[305px]">
      <figure className='w-full h-full'>
        <img src={image} alt={alt} style={{aspectRatio: "1 / 1.5"}} className="w-full h-full object-cover hover:scale-125 duration-100" />
      </figure>
    </div>
  )
}

export default GridCards