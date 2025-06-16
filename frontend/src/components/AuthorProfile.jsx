import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { toastConfig } from "../utils/toastConfig";

const AuthorProfile = () => {
  const authorId = useParams().id;
  const { author, setAuthor, isLoggedIn, user } = useAuth();
  const [followed, setFollowed] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`https://blogora.up.railway.app/user/posts/${authorId}`)
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "success") {
          setAuthor(response.data.user);
        }
      });
  }, [authorId]);

  const handleFollow = () => {
    if (!user && !isLoggedIn) {
      toast.error("Please login to follow", toastConfig("follow-error"));
      return;
    }
    axios
      .put(`https://blogora.up.railway.app/user/follow/${authorId}`, {
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

  return (
    <div className="px-4">
      {author ? (
        <div className="max-w-4xl mx-auto p-4 border rounded-xl shadow-md bg-white mt-32">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative">
            <button
              onClick={handleFollow}
              className="absolute top-1 right-1 flex items-center gap-1 text-sm md:text-base font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-sm cursor-pointer"
            >
              <FaUserPlus className={followed ? "text-blue-700" : ""} />{" "}
              <span>{followed ? "Following" : "Follow"}</span>
            </button>
            {/* Profile Picture */}
            <div className="relative w-24 h-24 group cursor-pointer">
              <img
                src={
                  author.profilePicture
                    ? author.profilePicture
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
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
              <button
                className="hover:text-blue-600 focus:outline-none"
                onClick={() => navigate(`/author-profile/${authorId}`)}
              >
                Posts
              </button>
              <button
                className="hover:text-blue-600 focus:outline-none"
                onClick={() => navigate(`/author-profile/${authorId}/about`)}
              >
                About
              </button>
              <button
                className="hover:text-blue-600 focus:outline-none"
                onClick={() => navigate(`/author-profile/${authorId}/friends`)}
              >
                Friends
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Outlet />
    </div>
  );
};

export default AuthorProfile;
