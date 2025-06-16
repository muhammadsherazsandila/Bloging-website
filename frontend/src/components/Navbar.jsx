import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import Cookie from "js-cookie";
import { Tooltip } from "@mui/material";
import { IoMdHome } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";

const navigation = [
  { name: "Home", href: "/" },
  { name: "New", href: "#" },
  { name: "Top", href: "/top" },
  { name: "About", href: "#" },
];

function Navbar() {
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // If the user is logged in, log them out
      Cookie.remove("token");
      setIsLoggedIn(false);
      setUser(null);
      navigate("/login");
    } else {
      // If the user is not logged in, redirect to login page
      navigate("/login");
    }
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 shadow-sm bg-white">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link
            to="/"
            className="text-2xl font-bold flex items-center justify-center gap-1"
          >
            <img
              src="/images/logo.jpeg"
              alt="logo"
              className="w-8 h-w-8 rounded-full"
            />
            Blogora
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              to={item.href}
              key={item.name}
              className="text-sm/6 font-semibold text-gray-900 hover:text-blue-900 transition duration-300 hover:scale-105"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <Tooltip title="Profile" placement="left">
            <button
              className="flex items-center cursor-pointer hover:scale-105 transition duration-300"
              onClick={() => navigate("/dashboard")}
            >
              <img
                src={
                  isLoggedIn && user.profilePicture
                    ? user.profilePicture
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="w-8 h-8 rounded-full border border-gray-300 hover:border-blue-900 transition duration-300 hover:animate-spin "
              />
            </button>
          </Tooltip>
          <span
            className="text-sm/6 font-semibold text-gray-900 cursor-pointer flex items-center hover:scale-105 transition duration-300 hover:text-blue-900"
            onClick={handleLoginLogout}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </span>
        </div>
      </nav>

      {/* // Mobile Navigation */}

      {
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 shadow-md z-50">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center text-gray-700 hover:text-blue-900"
          >
            <IoMdHome className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => navigate("/top")}
            className="flex flex-col items-center text-gray-700 hover:text-blue-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
              />
            </svg>
            <span className="text-xs">Top</span>
          </button>

          <button
            onClick={() => navigate("/create")}
            className="flex flex-col items-center text-gray-700 hover:text-blue-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-xs">New</span>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex flex-col items-center text-gray-700 hover:text-blue-900"
          >
            {isLoggedIn && user.profilePicture ? (
              user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="profile"
                  className="w-6 h-6 rounded-full border border-gray-300 hover:border-blue-900 transition duration-300 hover:animate-spin "
                />
              ) : (
                <MdAccountCircle className="h-6 w-6" />
              )
            ) : (
              <MdAccountCircle className="h-6 w-6" />
            )}
            <span className="text-xs">Profile</span>
          </button>
        </div>
      }
    </header>
  );
}

export default Navbar;
