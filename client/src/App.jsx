import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import StartPage from './pages/StartPage'
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/dashboard' element={<Home/>} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
