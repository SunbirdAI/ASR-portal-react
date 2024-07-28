import { Button, RelativeDiv, Stripe, OuterRing, FlexRing, XContainer, XBar, DropDownItem, DropDownList, LoginButton } from './DropDown.styles'
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export const Dropdown = () => {

  const [isOpen, setIsOpen] = useState(false)

  function removeAccessToken() {
    localStorage.removeItem('access_token');
    window.location.reload()
  }


  const navItems = [
    { path: "/", link: "Home" },
    { path: "/files", link: "Recent Files" },
    { path: "/login", link: "Logout" }

  ]

  function toggleDropdown(event) {
    event.stopPropagation()
    console.log("Dropdown toggled.")
    setIsOpen(prev => !prev)
  };

  const DropDownMenu = () => {
    return <RelativeDiv>
      <Button
        className="group"
        onClick={toggleDropdown}
        aria-label="Toggle dropdown"
      >
        <OuterRing >
          <FlexRing>

            <Stripe className={` origin-left ${isOpen ? 'translate-x-10' : '-translate-x-0'} flex w-0 ${isOpen ? 'group-focus:w-12' : 'w-12'} `}></Stripe>
            <Stripe className={` rounded  delay-75 ${isOpen ? 'translate-x-10' : '-translate-x-0'} flex w-0 ${isOpen ? 'group-focus:w-12' : 'w-12'} `}></Stripe>
            <Stripe className={` origin-left  delay-150 ${isOpen ? 'translate-x-10' : '-translate-x-0'} flex w-0 ${isOpen ? 'group-focus:w-12' : 'w-12'} `}></Stripe>

            <XContainer
              className={` ${isOpen ? 'translate-x-0' : '-translate-x-10'
                } flex w-0 ${isOpen ? 'w-12' : 'group-focus:w-12'}`}
            >
              <XBar className=" rotate-45 group-focus:rotate-45"></XBar>
              <XBar className="-rotate-45 group-focus:-rotate-45"></XBar>
            </XContainer>
          </FlexRing>
        </OuterRing>
      </Button>

      {isOpen && (
        <DropDownList onMouseLeave={toggleDropdown}>

          {navItems.map(({ link, path }) => link === "Logout" ?
            <DropDownItem key={path} onClick={removeAccessToken}>
              <NavLink to={path} className={({ isActive, isPending }) =>
                isActive
                  ? "active block"
                  : isPending
                    ? "pending block"
                    : "block"
              }>{link}</NavLink>
            </DropDownItem>
            : <li key={path} className="py-3 px-5 text-start text-medium hover:bg-blue-100 hover:text-large cursor-pointer">
              <NavLink to={path} className={({ isActive, isPending }) =>
                isActive
                  ? "active block"
                  : isPending
                    ? "pending block"
                    : "block"
              }>{link}</NavLink>
            </li>)}

        </DropDownList>
      )}
    </RelativeDiv>
  }


  return (<>
    {localStorage.getItem('access_token') ? <DropDownMenu>
      <Button
        className="group"
        onClick={toggleDropdown}
        aria-label="Toggle dropdown"
      >
        <OuterRing className="relative flex overflow-hidden items-center justify-center rounded-full w-12 h-12 transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md">
          <FlexRing>

            <Stripe className={` origin-left ${isOpen ? 'translate-x-10' : '-translate-x-0'} flex w-0 ${isOpen ? 'group-focus:w-12' : 'w-12'} `}></Stripe>
            <Stripe className={` rounded  delay-75 ${isOpen ? 'translate-x-10' : '-translate-x-0'} flex w-0 ${isOpen ? 'group-focus:w-12' : 'w-12'} `}></Stripe>
            <Stripe className={` origin-left  delay-150 ${isOpen ? 'translate-x-10' : '-translate-x-0'} flex w-0 ${isOpen ? 'group-focus:w-12' : 'w-12'} `}></Stripe>

            <XContainer
              className={` ${isOpen ? 'translate-x-0' : '-translate-x-10'
                } flex w-0 ${isOpen ? 'w-12' : 'group-focus:w-12'}`}
            >
              <XBar className=" rotate-45 group-focus:rotate-45"></XBar>
              <XBar className="-rotate-45 group-focus:-rotate-45"></XBar>
            </XContainer>
          </FlexRing>
        </OuterRing>
      </Button>

      {isOpen && (
        <DropDownList onMouseLeave={toggleDropdown}>

          {navItems.map(({ link, path }) => link === "Logout" ?
            <DropDownItem key={path} onClick={removeAccessToken}>
              <NavLink to={path} className={({ isActive, isPending }) =>
                isActive
                  ? "active block"
                  : isPending
                    ? "pending block"
                    : "block"
              }>{link}</NavLink>
            </DropDownItem>
            : <li key={path} className="py-3 px-5 text-start text-medium hover:bg-blue-100 hover:text-large cursor-pointer">
              <NavLink to={path} className={({ isActive, isPending }) =>
                isActive
                  ? "active block"
                  : isPending
                    ? "pending block"
                    : "block"
              }>{link}</NavLink>
            </li>)}

        </DropDownList>
      )}
    </DropDownMenu>
      : <LoginButton>
        <NavLink className={"whitespace-nowrap"} to={'/login'} >
          Sign In
        </NavLink>
      </LoginButton>

    }

  </>)

}