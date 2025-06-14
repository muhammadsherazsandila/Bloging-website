import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShareAlt,
  FaReply,
  FaUserPlus,
} from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { usePost } from "../contexts/PostContext";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { toastConfig } from "../utils/toastConfig";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import UploadPostModal from "../components/UploadPostModal";
import Backdrop from "@mui/material/Backdrop";

const SinglePost = () => {
  const { posts, state, setState } = usePost();
  const location = useLocation();
  const postId = location.state?.postId;
  const post = posts.find((post) => post._id.toString() === postId.toString());

  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(true); // Always show comments for single post
  const [commentLikes, setCommentLikes] = useState(
    post?.comments?.map(() => false) || []
  );
  const [followed, setFollowed] = useState(false);
  const [replyFormOpen, setReplyFormOpen] = useState(
    post?.comments?.map(() => false) || []
  );
  const [replyText, setReplyText] = useState("");
  const [openUploadPost, setOpenUploadPost] = useState(false);

  const toggleReplyForm = (index) => {
    setReplyFormOpen((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // API interaction handlers
  const handleReplySubmit = (index, e) => {
    e.preventDefault();
    if (!replyText || !user) {
      toast.error("Please login to reply", toastConfig("reply-error"));
      return;
    }
    axios
      .post(`https://blogorabloging.vercel.app/post/add-comment/${post._id}`, {
        content: replyText,
        user: user.id,
        type: "reply",
        commentId: post.comments[index]._id,
      })
      .then((response) => {
        if (response.status === 200) {
          setState(!state);
          setReplyText("");
        }
      })
      .catch((error) => {
        console.error("Error adding reply:", error);
      });
  };

  const handleFollow = () => {
    axios
      .put(`https://blogorabloging.vercel.app/post/follow/${post._id}`, {
        userId: user.id,
        followed: !followed,
      })
      .then((response) => {
        if (response.data.status === "success") {
          setFollowed(!followed);
          setState(!state);
        } else {
          toast.error(response.data.message, toastConfig("follow-error"));
        }
      })
      .catch((error) => {
        console.error("Error following post:", error);
      });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment || !user) {
      toast.error("Please login to comment", toastConfig("comment-error"));
      setComment("");
      return;
    }
    axios
      .post(`https://blogorabloging.vercel.app/post/add-comment/${post._id}`, {
        content: comment,
        user: user.id,
        type: "comment",
      })
      .then((response) => {
        if (response.status === 200) {
          setState(!state);
          setComment("");
        }
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  const handleDeleteComment = (commentId) => {
    axios
      .delete(
        `https://blogorabloging.vercel.app/post/delete-comment/${post._id}`,
        {
          data: { commentId },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setState(!state);
        }
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
      });
  };

  const handlePostLikes = (postId) => {
    if (!user) {
      toast.error("Please login to like", toastConfig("like-error"));
      return;
    }
    axios
      .post(`https://blogorabloging.vercel.app/post/like/${postId}`, {
        userId: user.id,
        liked: !liked,
      })
      .then((response) => {
        if (response.status === 200) {
          setState(!state);
          setLiked(!liked);
        }
      })
      .catch((error) => {
        console.error("Error liking post:", error);
      });
  };

  const handleCommentLikes = (index, commentId) => {
    if (!user) {
      toast.error("Please login to like", toastConfig("like-error"));
      return;
    }
    axios
      .put(`https://blogorabloging.vercel.app/post/like-comment/${post._id}`, {
        commentId: commentId,
        userId: user.id,
        liked: commentLikes[index],
      })
      .then((response) => {
        if (response.status === 200) {
          setState(!state);
          setCommentLikes((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
          });
        }
      })
      .catch((error) => {
        console.error("Error adding reply:", error);
      });
  };

  const handleDeletePost = () => {
    axios
      .delete(`https://blogorabloging.vercel.app/post/delete-post/${post._id}`)
      .then((response) => {
        if (response.status === 200) {
          setState(!state);
          toast.success("Post deleted!", toastConfig("post-delete-success"));
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  const handleOpenUploadPost = () => setOpenUploadPost(true);
  const handleCloseUploadPost = () => setOpenUploadPost(false);

  const initiateData = () => {
    if (post && user) {
      setLiked(post.likes.includes(user?.id));
      setFollowed(user?.following?.includes(post.author.id));
      setCommentLikes(
        post.comments.map((comment) => comment.likes.includes(user?.id))
      );
    }
  };

  useEffect(() => {
    if (post) {
      initiateData();
    }
  }, [post]);

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Post Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Card Header */}
        <div className="p-5 border-b border-gray-100 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={
                    post.author.profilePicture ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-500">
                  {post.createdAt} · Updated {post.updatedAt}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {user ? (
              user.id === post.author.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleOpenUploadPost}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                    title="Edit post"
                  >
                    <FiEdit className="text-lg" />
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="p-2 rounded-full hover:bg-red-50 transition-colors text-red-500"
                    title="Delete post"
                  >
                    <MdDelete className="text-lg" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    followed
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaUserPlus
                    className={`${
                      followed ? "text-blue-700" : "text-gray-700"
                    }`}
                  />
                  <span>{followed ? "Following" : "Follow"}</span>
                </button>
              )
            ) : (
              <button
                onClick={handleFollow}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                <FaUserPlus />
                <span>Follow</span>
              </button>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          <h1 className="font-bold text-3xl text-gray-900 mb-4">
            {post.title}
          </h1>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {post.caption}
          </p>

          <div className="rounded-xl overflow-hidden mb-6 shadow-md">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-cover"
              loading="lazy"
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePostLikes(post._id)}
                className="flex items-center gap-2 group"
              >
                <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                  {liked ? (
                    <FaHeart className="text-red-600 text-lg" />
                  ) : (
                    <FaRegHeart className="text-gray-500 group-hover:text-red-500 text-lg" />
                  )}
                </div>
                <span className="text-gray-700 font-medium">
                  {post.likes.length} Likes
                </span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 group"
              >
                <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                  <FaComment className="text-gray-500 group-hover:text-blue-500 text-lg" />
                </div>
                <span className="text-gray-700 font-medium">
                  {post.comments.length} Comments
                </span>
              </button>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success(
                  "Link copied to clipboard!",
                  toastConfig("share-success")
                );
              }}
              className="p-2 rounded-full hover:bg-green-50 transition-colors group"
              title="Share post"
            >
              <FaShareAlt className="text-gray-500 group-hover:text-green-500 text-lg" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-5">
            <h3 className="font-bold text-xl text-gray-900 mb-4">
              Comments ({post.comments.length})
            </h3>

            {/* New Comment Form */}
            <div className="mb-6">
              <form className="flex items-center gap-2">
                <img
                  src={
                    user?.profilePicture ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt="Your profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 pr-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow-sm"
                    required
                  />
                  <button
                    type="submit"
                    onClick={handleCommentSubmit}
                    disabled={!comment}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                      comment
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              ) : (
                post.comments.map((comment, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <img
                          src={
                            comment.user.profilePicture ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt={comment.user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {comment.user.name}
                            </p>
                            <span className="text-xs text-gray-500">
                              {comment.createdAt}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-2">
                            {comment.content}
                          </p>
                        </div>
                      </div>

                      {user?.id === comment.user.id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete comment"
                        >
                          <MdDelete />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3 ml-12">
                      <button
                        onClick={() => handleCommentLikes(i, comment._id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                      >
                        {commentLikes[i] ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                        <span>{comment.likes.length}</span>
                      </button>

                      <button
                        onClick={() => toggleReplyForm(i)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <FaReply />
                        <span>Reply</span>
                      </button>
                    </div>

                    {/* Reply form */}
                    {replyFormOpen[i] && (
                      <form className="mt-3 ml-12 flex items-center gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${comment.user.name}...`}
                          className="flex-1 p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                          required
                        />
                        <button
                          type="submit"
                          onClick={(e) => handleReplySubmit(i, e)}
                          className={`p-3 rounded-full transition-colors ${
                            replyText
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          <FaArrowRight />
                        </button>
                      </form>
                    )}

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="mt-4 ml-8 pl-4 border-l-2 border-gray-200 space-y-4">
                        {comment.replies.map((reply, j) => (
                          <div key={j} className="pt-3">
                            <div className="flex items-start gap-3">
                              <img
                                src={
                                  reply.user.profilePicture ||
                                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                alt={reply.user.name}
                                className="w-8 h-8 rounded-full object-cover border-2 border-white"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-gray-900">
                                    {reply.user.name}
                                  </p>
                                  <span className="text-xs text-gray-500">
                                    {reply.createdAt}
                                  </span>
                                </div>
                                <p className="text-gray-700 mt-1">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      <Modal
        open={openUploadPost}
        onClose={handleCloseUploadPost}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 300,
          },
        }}
      >
        <Fade in={openUploadPost}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              maxWidth: "600px",
              p: 2,
              outline: "none",
            }}
          >
            <UploadPostModal handleClose={handleCloseUploadPost} post={post} />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default SinglePost;
