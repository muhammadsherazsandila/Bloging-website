import React, { useRef, useState, useEffect } from "react";
import { AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { FiCamera } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { toastConfig } from "../utils/toastConfig";

import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import { MdAccountCircle, MdOpenWith } from "react-icons/md";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditProfileModel from "../components/EditProfileModel";
import UploadPostModal from "../components/UploadPostModal";
import { uploadProfilePicture } from "../utils/uploadPicture";
import axios from "axios";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { usePost } from "../contexts/PostContext";
import BlogCard from "../components/BlogCard";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { translate } from "../utils/animation";
import { downStyle, upStyle } from "../utils/styles";

const Dashboard = () => {
  const { user, isLoggedIn, setIsLoggedIn, setUser } = useAuth();

  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openUploadPost, setOpenUploadPost] = useState(false);
  const [openProfilePicture, setOpenProfilePicture] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPostsOpen, setIsPostsOpen] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const { state } = usePost();
  const [posts, setPosts] = useState([]);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const openFile = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const response = await uploadProfilePicture(file);
      if (response.status === "success") {
        toast.success(
          "Picture uploaded successfully!",
          toastConfig("upload-profile-pic-success")
        );
        setUser(response.user);
      } else {
        toast.error(response.error, toastConfig("upload-profile-pic-error"));
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const deleteProfile = async () => {
    setLoading(true);
    let result = window.confirm(
      "Are you sure you want to delete your profile?"
    );
    console.log(result);
    if (!result) return;
    const response = await axios.delete(
      "https://blogora.up.railway.app/user/delete-profile",
      {
        headers: {
          Authorization: `${Cookies.get("token")}`,
        },
      }
    );
    console.log(response.data);
    if (response.data.status === "success") {
      setUser(null);
      setIsLoggedIn(false);
      Cookies.remove("token");
      toast.success("Profile deleted successfully!", toastConfig("delete"));
      navigate("/login");
    } else {
      toast.error(response.data.message, toastConfig("delete-profile-error"));
    }
    setLoading(false);
  };

  useEffect(() => {
    const toastId = "welcome-toast";
    if (user?._id) {
      if (!toast.isActive(toastId)) {
        toast.success(`Welcome ${user.name}`, toastConfig(toastId));
      }
    }
  }, []);

  const fetchPosts = async () => {
    axios
      .get(`https://blogora.up.railway.app/user/posts/${Cookies.get("token")}`)
      .then((response) => {
        if (response.data.status === "success") {
          const sortedPosts = [...response.data.user.posts].sort(
            (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
          );
          setPosts(sortedPosts);
          setLoading(false);
        }
      });
  };
  useEffect(() => {
    fetchPosts();
    setLoading(true);
  }, [state]);

  return (
    <div className="px-4">
      <div dangerouslySetInnerHTML={{ __html: upStyle() }} />
      {user ? (
        <div className="max-w-4xl mx-auto p-4 border rounded-xl shadow-md bg-white mt-32">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            {/* Profile Picture */}

            <div className="relative w-24 h-24 group cursor-pointer">
              <MdOpenWith
                className="absolute top-0 right-0 text-blue-900 bg-white rounded-full h-6 w-6 cursor-pointer hover:bg-gray-200 hover:scale-110 transition-all duration-200 z-10"
                onClick={() => setOpenProfilePicture(true)}
              />
              <div
                className="relative w-24 h-24 group cursor-pointer"
                onClick={openFile}
              >
                <img
                  src={
                    isLoggedIn && user.profilePicture
                      ? user.profilePicture
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-gray-300"
                />
                <div className="absolute inset-0 bg-transparent hover:bg-black hover:opacity-50 text-white rounded-full flex items-center justify-center">
                  <FiCamera className="text-xl" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  name="profilePicture"
                />
              </div>
            </div>

            {/* Name & Info */}
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <div className="flex justify-center sm:justify-start gap-4 mt-1">
                <p className="text-sm text-gray-600">
                  {user.followers.length} Followers
                </p>
                <p className="text-sm text-gray-600">
                  {user.following.length} Following
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-900 flex items-center justify-center gap-2 w-full sm:w-auto"
                onClick={() => setOpenEditProfile(true)}
              >
                <AiOutlineEdit />
                Edit Profile
              </button>
              <button
                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-900 flex items-center justify-center gap-2 w-full sm:w-auto"
                onClick={deleteProfile}
              >
                <DeleteIcon />
                {loading && !isLoggedIn ? <CircularProgress size={20} /> : ""}
                {loading && !isLoggedIn ? "Deleting..." : "Delete Profile"}
              </button>

              <button
                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-900 flex items-center justify-center gap-2 w-full sm:w-auto"
                onClick={() => setOpenUploadPost(true)}
              >
                <AiOutlinePlus />
                Upload Post
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-t pt-4 overflow-x-auto">
            <div className="flex gap-6 text-gray-700 font-medium whitespace-nowrap">
              <button
                className={` font-semibold ${
                  isPostsOpen
                    ? "text-blue-600"
                    : "hover:text-blue-600 focus:outline-none"
                }`}
                onClick={() => {
                  setIsPostsOpen(true);
                  setIsAboutOpen(false);
                  setIsFriendsOpen(false);
                }}
              >
                Posts
              </button>
              <button
                className={` font-semibold ${
                  isAboutOpen
                    ? "text-blue-600"
                    : "hover:text-blue-600 focus:outline-none"
                }`}
                onClick={() => {
                  setIsPostsOpen(false);
                  setIsAboutOpen(true);
                  setIsFriendsOpen(false);
                }}
              >
                About
              </button>
              <button
                className={` font-semibold ${
                  isFriendsOpen
                    ? "text-blue-600"
                    : "hover:text-blue-600 focus:outline-none"
                }`}
                onClick={() => {
                  setIsPostsOpen(false);
                  setIsAboutOpen(false);
                  setIsFriendsOpen(true);
                }}
              >
                Friends
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-10">Loading...</div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        open={openEditProfile}
        onClose={() => setOpenEditProfile(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={openEditProfile}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
            }}
          >
            <EditProfileModel handleClose={() => setOpenEditProfile(false)} />
          </Box>
        </Fade>
      </Modal>

      {/* Upload Post Modal */}
      <Modal
        open={openUploadPost}
        onClose={() => setOpenUploadPost(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={openUploadPost}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
            }}
          >
            <UploadPostModal handleClose={() => setOpenUploadPost(false)} />
          </Box>
        </Fade>
      </Modal>

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
                    user?.profilePicture ||
                    `${(<MdAccountCircle className="h-6 w-6" />)}`
                  }
                  sx={{ width: 250, height: 250 }}
                />
              </span>
            </div>
          </Box>
        </Fade>
      </Modal>

      {isPostsOpen && (
        <div className="flex flex-col gap-6 items-center md:p-4 lg:p-8 xl:p-12 p-2 mb-16">
          {posts.length > 0 ? (
            posts.map((post, index) => <BlogCard key={index} post={post} />)
          ) : (
            <p className="flex items-center gap-2">
              <CircularProgress />
              <span>Loading...</span>
            </p>
          )}
        </div>
      )}

      {isAboutOpen && (
        <div className="w-11/12 mb-16 bg-white rounded-lg shadow-md mx-auto overflow-y-auto mt-16 p-7 max-h-96">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">About</h2>
          <p>{user.about}</p>
        </div>
      )}

      {isFriendsOpen && (
        <div className="w-11/12 mb-16 bg-white rounded-lg shadow-md mx-auto overflow-y-auto mt-16 p-7 max-h-96">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Friends</h2>
          <ul className="space-y-3">
            {user.friends ? (
              user.friends.length > 0 ? (
                user.friends.map((friend, index) => (
                  <motion.li
                    initial={translate(
                      "x",
                      `${index % 2 === 0 ? "negative" : "positive"}`,
                      100
                    )}
                    animate={translate("x", "positive", 0)}
                    key={friend.id}
                    className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-2 rounded-md transition"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/author-profile/${friend.id}`);
                      console.log(friend.id);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar src={friend.profilePicture} alt={friend.name} />
                      <span className="text-sm font-medium text-gray-700">
                        {friend.name}
                      </span>
                    </div>
                  </motion.li>
                ))
              ) : (
                <span> No friends found.</span>
              )
            ) : (
              <span className="flex items-center gap-2">
                <CircularProgress />
                <span>Loading...</span>
              </span>
            )}
          </ul>
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: downStyle() }} />
    </div>
  );
};

export default Dashboard;
