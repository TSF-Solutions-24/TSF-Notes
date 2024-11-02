import React, { useState } from 'react'
import {FaRegEye,FaRegEyeSlash} from 'react-icons/fa6'
const PasswordInput = ({ value, onChange, placeholder }) => {
    const[isShowPassword,setIsShowPassword] = useState(false)
    const toggleShowPassword = ()=>{
        setIsShowPassword(!isShowPassword)
    }
    return (
        <div className='border border-gray-300 p-1 px-3 flex justify-between'>
            <input value={value} onChange={onChange} type={isShowPassword?"text":"password"} placeholder={placeholder || 'Password'} className=' bg-transparent outline-none' />
            {
                isShowPassword?<FaRegEye onClick={toggleShowPassword} className='text-blue-700 cursor-pointer' size={22}/>:<FaRegEyeSlash onClick={toggleShowPassword} className='text-blue-700 cursor-pointer' size={22}/>
            }
        </div>
    )
}

export default PasswordInput
