import React from 'react';
import { getInitials } from '../../utils/helper';

const Profile = ({ onLogout, userInfo }) => {
  return (
    <div className='flex gap-3 items-center cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-all duration-300 ease-in-out'>
      <div className='flex items-center justify-center font-semibold rounded-full bg-slate-300 text-gray-800 p-3 w-10 h-10 text-lg hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105'>
        {getInitials(userInfo.fullName)}
      </div>
      <div className='transition-all duration-300 ease-in-out'>
        <p className='font-semibold text-gray-700 hover:text-blue-600'>{userInfo.fullName}</p>
        <button 
          className='underline text-blue-500 hover:text-blue-700 focus:outline-none transition-colors duration-300 ease-in-out'
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
