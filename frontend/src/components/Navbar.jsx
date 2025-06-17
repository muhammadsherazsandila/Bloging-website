import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Cookie from "js-cookie";
import { Tooltip } from "@mui/material";
import { IoMdHome } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import UploadPostModal from "../components/UploadPostModal";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";
import SearchModel from "./SearchModel";
import { IoSearchOutline } from "react-icons/io5";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Top", href: "/top" },
  { name: "All", href: "/all" },
  { name: "About", href: "/#about" },
  { name: "Search", href: "/searchPosts" },
];

function Navbar() {
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useAuth();
  const [showNav, setShowNav] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const handleCloseSearchModal = () => setOpenSearchModal(false);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      Cookie.remove("token");
      setIsLoggedIn(false);
      setUser(null);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollPosition(currentScrollY);

      if (currentScrollY > lastScrollY.current && currentScrollY > 0) {
        setShowNav(false); // hide navbar
      } else {
        setShowNav(true); // show navbar
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Desktop Navbar */}
      <header
        className={`fixed left-0 top-0 inset-x-0 z-50 transition-transform duration-300 ease-in-out w-full max-w-screen ${
          scrollPosition === 0
            ? "bg-white backdrop-blur-none shadow-none border-b-0"
            : "shadow-md backdrop-blur-md"
        } ${showNav ? "translate-y-0" : "-translate-y-full border-b-gray-200"}`}
      >
        <nav className="flex items-center justify-between p-4 lg:px-8">
          {/* Logo */}
          <div className="flex">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <img
                src="/images/logo.jpeg"
                alt="logo"
                className="w-8 h-8 rounded-full"
              />
              Blogora
            </Link>
          </div>

          {/* Links (desktop only) */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                to={item.href}
                key={item.name}
                className="text-sm font-semibold text-gray-800 hover:text-blue-800 transition duration-300"
                onClick={() => {
                  if (item.name === "About") {
                    const aboutSection = document.getElementById("about");
                    if (aboutSection) {
                      aboutSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                  if (item.name === "Search") {
                    setOpenSearchModal(true);
                  }
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Profile/Login */}
          <div className="flex items-center gap-3">
            <Tooltip title="Profile" placement="left">
              <button
                className="cursor-pointer hover:scale-105 transition duration-300"
                onClick={() => navigate("/dashboard")}
              >
                <img
                  src={
                    user?.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="profile"
                  className="w-8 h-8 rounded-full border border-gray-300 hover:border-blue-900"
                />
              </button>
            </Tooltip>
            <span
              onClick={handleLoginLogout}
              className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-blue-800 transition"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </span>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 shadow-md z-50">
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center text-gray-700 hover:text-blue-800"
        >
          <IoMdHome className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => navigate("/top")}
          className="flex flex-col items-center text-gray-700 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
          onClick={() => {
            setOpenSearchModal(true);
            navigate("/searchPosts");
          }}
          className="flex flex-col items-center text-gray-700 hover:text-blue-800"
        >
          <IoSearchOutline className="h-6 w-6" />
          <span className="text-xs">Search</span>
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center text-gray-700 hover:text-blue-800"
        >
          <img
            src={
              user?.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            className="w-6 h-6 rounded-full border border-gray-300 hover:border-blue-800"
          />
          <span className="text-xs">Profile</span>
        </button>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-16 right-5 bg-gradient-to-r from-blue-600 to-blue-900 p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition transform z-50 animate-bounce"
        aria-label="Back to top"
      >
        <FaArrowUp className="text-white text-xl" />
      </button>

      {/* Search Posts Modal */}
      <Modal
        open={openSearchModal}
        onClose={handleCloseSearchModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={openSearchModal}>
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translate(-50%, -10%)",
              width: "100%",
              maxWidth: "600px",
              p: 2,
            }}
          >
            <SearchModel onClose={handleCloseSearchModal} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default Navbar;
