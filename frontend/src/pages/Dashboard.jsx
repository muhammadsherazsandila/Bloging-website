import React, { useRef, useState, useEffect } from "react";
import { AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { FiCamera } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import { toastConfig } from "../utils/toastConfig";

import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import UploadPostModal from "../components/UploadPostModal";
import EditProfileModel from "../components/EditProfileModel";
import { uploadProfilePicture } from "../utils/uploadPicture";
import { Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, setUser } = useAuth();

  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openUploadPost, setOpenUploadPost] = useState(false);

  const fileInputRef = useRef(null);

  const openFile = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
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
  };

  useEffect(() => {
    const toastId = "welcome-toast";
    if (!toast.isActive(toastId)) {
      toast.success(`Welcome ${user.name}`, toastConfig(toastId));
    }
  }, []);

  return (
    <div className="px-4">
      {user ? (
        <div className="max-w-4xl mx-auto p-4 border rounded-xl shadow-md bg-white mt-32">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            {/* Profile Picture */}
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
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2 w-full sm:w-auto"
                onClick={() => setOpenEditProfile(true)}
              >
                <AiOutlineEdit />
                Edit Profile
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2 w-full sm:w-auto"
                onClick={() => setOpenUploadPost(true)}
              >
                <AiOutlinePlus />
                Add Post
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-t pt-4 overflow-x-auto">
            <div className="flex gap-6 text-gray-700 font-medium whitespace-nowrap">
              <button
                className="hover:text-blue-600 focus:outline-none"
                onClick={() => navigate("/dashboard")}
              >
                Posts
              </button>
              <button
                className="hover:text-blue-600 focus:outline-none"
                onClick={() => navigate("/dashboard/about")}
              >
                About
              </button>
              <button
                className="hover:text-blue-600 focus:outline-none"
                onClick={() => navigate("/dashboard/friends")}
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

      <Outlet />
    </div>
  );
};

export default Dashboard;
