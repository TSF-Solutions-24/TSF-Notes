import React from 'react';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
    return (
        <div className='flex p-2 bg-slate-200 justify-between items-center w-[25%] rounded-full transition-all duration-300 ease-in-out shadow-lg focus-within:shadow-xl'>
            <input
                type="text"
                placeholder='Search Notes'
                className='outline-none bg-transparent flex-1 px-2 text-gray-700 transition-all duration-300 ease-in-out'
                value={value}
                onChange={onChange}
            />
            <div className='flex justify-center items-center gap-2'>
                {value && (
                    <IoMdClose
                        onClick={onClearSearch}
                        className='text-gray-500 cursor-pointer text-xl hover:text-red-500 transition-transform duration-300 ease-in-out transform hover:scale-125'
                    />
                )}
                <FaMagnifyingGlass
                    onClick={handleSearch}
                    className='text-gray-500 mr-2 cursor-pointer hover:text-blue-500 transition-transform duration-300 ease-in-out transform hover:scale-110'
                />
            </div>
        </div>
    );
};

export default SearchBar;
