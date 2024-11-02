import React, { useState } from 'react';
import '../components/Navbar.css';
import Profile from './card/Profile';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar/SearchBar';
import logo from '../assets/logo.png';
const Navbar = ({ userInfo, searchNote }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchNote(searchQuery.trim());
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    searchNote(""); // Clear the search results in `Home` when input is cleared
  };

  return (
    <div className='md:p-7 p-4 shadow-xl navbar flex justify-between items-center transition-navbar'>
      <div className='flex items-center'>
        <img src={logo} className='w-10' alt="" />
        <h1 className='font-bold mx-5 text-xl md:text-2xl'>TSF NOTES</h1>
      </div>
      {userInfo ? (
        <>
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <Profile userInfo={userInfo} onLogout={onLogout} />
        </>
      ) : (
        <div>
          <button onClick={() => navigate('/login')} className="mx-2 bg-blue-500 p-2 px-3 rounded-xl text-sm md:text-md text-white font-bold transition-button">Login</button>
          <button onClick={() => navigate('/signup')} className="mx-2 bg-orange-500 p-2 px-3 rounded-xl text-sm md:text-md text-white font-bold transition-button">Sign Up</button>
        </div>
      )}
    </div>
  );
}

export default Navbar;