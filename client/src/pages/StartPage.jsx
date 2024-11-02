import React from 'react'
import Navbar from '../components/Navbar'
import notes1 from '../assets/notes1.png'
import notes2 from '../assets/notes2.png'
const StartPage = () => {
    return (
        <div>
            <Navbar />
            <div className='flex flex-col md:gap-5 justify-center items-center'>
                <h1 className='mt-10 text-2xl md:text-3xl lg:text-5xl font-bold'>Welcome to Our <span className='italic text-orange-500'>TSF Notes</span> App</h1>
                <div className='flex md:flex-row flex-col md:mx-0 mx-10 justify-center items-center gap-10 mt-10'>
                    <img src={notes1} className='w-[500px] h-[370px]' alt="" />
                    <img src={notes2} className='md:w-[50%] md:h-[370px]' alt="" />
                </div>
                <div className='mt-5 flex flex-col gap-2 mx-10 md:mx-0 items-center mb-5'>
                    <h1 className='font-semibold md:text-xl text-sm'>Make Your Thoughts, Ideas and Solutions into Notes</h1>
                    <button className='bg-orange-500 text-white rounded-xl p-2 px-3 text-sm md:text-md font-semibold transition-button'>Get Started with SignUp/Login</button>
                </div>
            </div>
        </div>
    )
}

export default StartPage