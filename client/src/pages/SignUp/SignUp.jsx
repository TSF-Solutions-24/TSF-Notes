import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import PasswordInput from '../../components/input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
const SignUp = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!name) {
      setError("Please enter your name")
      return
    }
    if (!email) {
      setError("Please enter the email address")
      return
    }
    if (!password) {
      setError("Please enter the password")
      return
    }
    setError('')

    //SignUp API
    try {
      const response = await axiosInstance.post('/create-account', {
        fullName: name,
        email: email,
        password: password
      })
      //Handle registration response
      if (response.data && response.data.error) {
        setError(response.data.message)
        return
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken)
        navigate('/dashboard')
      }
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("An Unexpected error occured. Please try again")
      }
    }
  }
  return (
    <div>
      <Navbar />
      <div className="signup-container">
        <form className="signup-form -mt-20" onSubmit={handleSignUp}>
          <h2 className="signup-title font-bold">Sign Up</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-input px-3 p-1"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input px-3 p-1"
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
          />
          <button type="submit" className="signup-button mt-5">Sign Up</button>
          <p className="signup-footer">
            Already have an account? <Link to="/login"><span className='font-semibold hover:text-blue-500 transition-all duration-200'>Login</span></Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp
