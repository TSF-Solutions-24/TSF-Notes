import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import PasswordInput from '../../components/input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setError("")
    // Login API Call
    try{
      const resposne = await axiosInstance.post('/login', {
        email: email,
        password: password
      })
      if(resposne.data && resposne.data.accessToken){
        localStorage.setItem("token", resposne.data.accessToken)
        navigate('/dashboard')
      } 
    } catch(err){
      if(err.resposne && err.resposne.data && err.resposne.data.message){
        setError(err.resposne.data.messsage)
      }
      else{
        setError("An Unexpected error occurred, Please Try Again.")
      }
    }
  }

  return (
    <div>
      <Navbar />
      <div className='flex justify-center items-center signup-container'>
        <form onSubmit={handleSubmit} className='signup-form -mt-20 flex flex-col gap-5 border md:w-[30%] w-[50%] border-gray-300 p-5'>
          <h1 className='text-2xl font-bold signup-title'>Login</h1>
          {error && <p className='error-message'>{error}</p>}
          <input
            name='email'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            className='signup-input px-3 p-1'
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='signup-input'
          />

          <button className='signup-button'>
            Login
          </button>
          <div className='flex text-md gap-1 items-center justify-center'>
            <p className=''>Not registered yet?</p>
            <Link to={'/signup'}>
              <span className='font-semibold hover:text-blue-500 duration-200 transition-all'>Create an Account</span>
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login
