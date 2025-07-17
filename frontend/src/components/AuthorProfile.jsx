import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { toastConfig } from "../utils/toastConfig";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import { MdOpenWith } from "react-icons/md";
import { IconButton, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePost } from "../contexts/PostContext";
import { downStyle, upStyle } from "../utils/styles";
import { backendServer } from "../utils/backendServer";

const AuthorProfile = () => {
  const authorId = useParams().id;
  const { author, setAuthor, isLoggedIn, user } = useAuth();
  const { state } = usePost();
  const [followed, setFollowed] = useState(false);
  const [openProfilePicture, setOpenProfilePicture] = useState(false);
  const [isPostsOpen, setIsPostsOpen] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${backendServer}/user/${authorId}`)
      .then((response) => {
        if (response.data.status === "success") {
          setAuthor(response.data.author);
        }
      });
  }, [authorId, state]);

  const handleFollow = () => {
    if (!user && !isLoggedIn) {
      toast.error("Please login to follow", toastConfig("follow-error"));
      return;
    }
    axios
      .put(`${backendServer}/user/follow/${authorId}`, {
        userId: user.id,
        followed: !followed,
      })
      .then((response) => {
        if (response.data.status === "success") {
          setFollowed(!followed);
          toast.success(
            followed ? "Unfollowed!" : "Followed!",
            toastConfig("follow-success")
          );
        } else {
          toast.error(response.data.message, toastConfig("follow-error"));
        }
      });
  };

  useEffect(() => {
    if (user && isLoggedIn && author) {
      if (author.followers.includes(user.id)) {
        setFollowed(true);
      }
    }
  }, [author, user, isLoggedIn]);

  const navigators = [
    {
      name: "Posts",
      onClick: () => {
        setIsPostsOpen(true);
        setIsAboutOpen(false);
        setIsFriendsOpen(false);
        navigate(`/author-profile/${authorId}`);
      },
      isOpen: isPostsOpen,
    },
    {
      name: "About",
      onClick: () => {
        setIsPostsOpen(false);
        setIsAboutOpen(true);
        setIsFriendsOpen(false);
        navigate(`/author-profile/${authorId}/about`);
      },
      isOpen: isAboutOpen,
    },
    {
      name: "Friends",
      onClick: () => {
        setIsPostsOpen(false);
        setIsAboutOpen(false);
        setIsFriendsOpen(true);
        navigate(`/author-profile/${authorId}/friends`);
      },
      isOpen: isFriendsOpen,
    },
  ];

  const handleNavigators = (navigator) => {
    navigator.onClick();
  };

  return (
    <div className="px-4">
      <div dangerouslySetInnerHTML={{ __html: upStyle() }} />
      {author ? (
        <div className="max-w-4xl mx-auto p-4 border rounded-xl shadow-md bg-white mt-32">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative">
            <button
              onClick={handleFollow}
              className="absolute top-1 right-1 flex items-center gap-1 text-sm md:text-base font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-900 hover:bg-blue-100 transition-colors shadow-sm cursor-pointer"
            >
              <FaUserPlus className={followed ? "text-blue-900" : ""} />{" "}
              <span>{followed ? "Following" : "Follow"}</span>
            </button>
            {/* Profile Picture */}
            <div className="relative w-24 h-24 group cursor-pointer">
              <MdOpenWith
                className="absolute top-0 right-0 text-blue-900 bg-white rounded-full h-6 w-6 cursor-pointer hover:bg-gray-200 hover:scale-110 transition-all duration-200 z-10"
                onClick={() => setOpenProfilePicture(true)}
              />
              <img
                src={
                  author?.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-gray-300"
              />
            </div>

            {/* Name & Info */}
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">
                {author.name}
              </h2>
              <div className="flex justify-center sm:justify-start gap-4 mt-1">
                <p className="text-sm text-gray-600">
                  {author.followers.length} Followers
                </p>
                <p className="text-sm text-gray-600">
                  {author.following.length} Following
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-1">{author.bio}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-t pt-4 overflow-x-auto">
            <div className="flex gap-6 text-gray-700 font-medium whitespace-nowrap">
              {navigators.map((navigator, index) => (
                <button
                  key={index}
                  className={` font-semibold ${
                    navigators[index].isOpen
                      ? "text-blue-900"
                      : "hover:text-blue-900 focus:outline-none"
                  }`}
                  onClick={() => handleNavigators(navigator)}
                >
                  {navigator.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Outlet />

      {/* Open Profile Picture Modal */}
      <Modal
        open={openProfilePicture}
        onClose={() => setOpenProfilePicture(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={openProfilePicture}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
            }}
          >
            <div className="flex justify-center items-center ">
              <span className="relative">
                <IconButton
                  onClick={() => setOpenProfilePicture(false)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bgcolor: "#1c398e",
                    color: "white",
                    "&:hover": { bgcolor: "#1c398e" },
                    ":hover": { rotate: "180deg", scale: "1.1" },
                    transition: "all 0.3s ease",
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Avatar
                  src={
                    author?.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  sx={{ width: 250, height: 250 }}
                />
              </span>
            </div>
          </Box>
        </Fade>
      </Modal>

      <div dangerouslySetInnerHTML={{ __html: downStyle() }} />
    </div>
  );
};

export default AuthorProfile;
