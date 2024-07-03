import tw, {styled} from "twin.macro";
import React, {useState} from "react";
import { NavLink } from "react-router-dom";

export const Nav = styled.div`
  ${tw`
    flex
    fixed
    justify-between
    w-screen
    items-center
    bg-sunbird-navy-blue
    p-6
    sticky
    top-0
    z-50
  `}
`;

export const DropdownMenu = () => {

  const [isOpen, setIsOpen] = useState(false)

  function removeAccessToken() {
    localStorage.removeItem('access_token');
  }


  const navItems = [
    {path:"/",link:"Home"},
    {path:"/files",link:"Recent Files"},
    {path:"/login",link:"Logout"},
    {path:"/change-password",link:"Change Password"}

  ]

  function toggleDropdown() {
    setIsOpen(prev => !prev)
  };




   return  ( <div className="relative ">
        <button
          className="relative group"
          onClick={toggleDropdown} 
          aria-label="Toggle dropdown"
        >
          <div className="relative flex overflow-hidden items-center justify-center rounded-full w-12 h-12 transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md">
            <div className="flex flex-col justify-between w-5 h-5 transform transition-all duration-300 origin-center overflow-hidden">

              <div className={`bg-white h-1 w-7 transform transition-all duration-300 origin-left ${isOpen ? 'translate-x-10' : '-translate-x-0'} flex w-0 ${isOpen ? 'group-focus:w-12' :'w-12' } `}></div>
              <div className={`bg-white h-1 w-7 rounded transform transition-all duration-300 delay-75 ${isOpen ? 'translate-x-10' : '-translate-x-0'} flex w-0 ${isOpen ? 'group-focus:w-12' :'w-12' } `}></div>
              <div className={`bg-white h-1 w-7 transform transition-all duration-300 origin-left  delay-150 ${isOpen ? 'translate-x-10' : '-translate-x-0'} flex w-0 ${isOpen ? 'group-focus:w-12' :'w-12' } `}></div>

              <div
                className={`absolute items-center justify-between transform transition-all duration-500 top-2.5 ${
                  isOpen ? 'translate-x-0' : '-translate-x-10'
                } flex w-0 ${isOpen ? 'w-12' : 'group-focus:w-12'}`}
              >
                <div className="absolute bg-white h-1 w-5 transform transition-all duration-500 rotate-45 delay-300 group-focus:rotate-45"></div>
                <div className="absolute bg-white h-1 w-5 transform transition-all duration-500 -rotate-45 delay-300 group-focus:-rotate-45"></div>
              </div>
            </div>
          </div>
        </button>
  
        {isOpen && (
          <ul onMouseLeave={toggleDropdown}  className="absolute rounded-lg top-full right-0 mt-2 w-60 bg-white shadow-lg ring-1 ring-gray-300 transition-all duration-300">

            {navItems.map(({link, path}) =>  link === "Logout" ? 
            <li key={path} onClick={removeAccessToken} className="py-3 px-5 text-start text-medium hover:bg-blue-100 hover:text-large cursor-pointer ">
            <NavLink to={path} className={({ isActive, isPending }) =>
                isActive
                  ? "active block"
                  : isPending
                    ? "pending block"
                    : "block"
              }>{link}</NavLink>
              </li>
            : <li key={path} className="py-3 px-5 text-start text-medium hover:bg-blue-100 hover:text-large cursor-pointer">
            <NavLink to={path} className={({ isActive, isPending }) =>
                isActive
                  ? "active block"
                  : isPending
                    ? "pending block"
                    : "block"
              }>{link}</NavLink>
              </li>)}
            
          </ul>
        )}
      </div>

      )
    
    }

export const Title = styled.h1`
  ${tw`
    font-semibold
    text-white
    text-4xl
    
    w-full
    max-md:hidden
    
    text-center
  `}

  @media (max-width: 600px) {
    ${tw`text-2xl`} /* Adjust as needed */
  }
`;

export const Logo = styled.img`
  ${tw`h-10`} /* 40px */

  @media (max-width: 600px) {
    ${tw`h-8`} /* Adjust as needed */
  }
`;

export const LoginButton = styled.button`
${tw`
px-3
py-2
text-white
bg-sunbird-orange
rounded-md
inline-flex
items-center
justify-center
hover:opacity-90
cursor-pointer

`}`;
