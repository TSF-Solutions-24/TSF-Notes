import React from 'react'
const EmptyCard = ({img, text}) => {
  return (
    <div className='flex flex-col justify-center items-center mt-20 gap-5'>
      <img src={img} alt="" />
      <p className='font-semibold text-center text-md w-[50%]'>{text}</p>
    </div>
  )
}

export default EmptyCard
