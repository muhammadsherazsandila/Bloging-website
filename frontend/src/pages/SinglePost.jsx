import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShareAlt,
  FaReply,
  FaUserPlus,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { usePost } from "../contexts/PostContext";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { toastConfig } from "../utils/toastConfig";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import UploadPostModal from "../components/UploadPostModal";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";
import { downStyle, upStyle } from "../utils/styles";
import { motion } from "framer-motion";
import { fadeIn, fadeOut } from "../utils/animation";
import { SlOptionsVertical } from "react-icons/sl";

const SinglePost = () => {
  const { state, setState } = usePost();
  const postId = useParams().id;
  const [post, setPost] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const getPost = () => {
    axios
      .get(`https://blogora.up.railway.app/post/get-post/${postId}`)
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "success") {
          setPost(response.data.post);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (postId) {
      getPost();
    }
  }, [postId, state]);

  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [commentLikes, setCommentLikes] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isCommentDeleting, setIsCommentDeleting] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [replyFormOpen, setReplyFormOpen] = useState([]);
  const [replyTexts, setReplyTexts] = useState([]);

  const toggleReplyForm = (index) => {
    setReplyFormOpen((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleReplySubmit = (index, e) => {
    e.preventDefault();
    setIsReplying(true);
    const replyText = replyTexts[index];
    if (!replyText || !user) {
      toast.error("Please login to reply", toastConfig("reply-error"));
      return;
    }
    axios
      .post(`https://blogora.up.railway.app/post/add-comment/${post._id}`, {
        content: replyText,
        user: user.id,
        type: "reply",
        commentId: post.comments[index]._id,
      })
      .then((response) => {
        if (response.status === 200) {
          setState(!state);
          const newTexts = [...replyTexts];
          newTexts[index] = "";
          setReplyTexts(newTexts);
          setIsReplying(false);
          toast.success("Reply added!", toastConfig("reply-success"));
        }
      })
      .catch((error) => {
        console.error("Error adding reply:", error);
      });
  };

  const handleFollow = () => {
    if (!user) {
      toast.error("Please login to follow", toastConfig("follow-error"));
      return;
    }
    axios
      .put(`https://blogora.up.railway.app/post/follow/${post._id}`, {
        userId: user.id,
        followed: !followed,
      })
      .then((response) => {
        if (response.data.status === "success") {
          setFollowed(!followed);
          setState(!state);
          toast.success(
            followed ? "Unfollowed!" : "Followed!",
            toastConfig("follow-success")
          );
        } else {
          toast.error(response.data.message, toastConfig("follow-error"));
        }
      })
      .catch((error) => {
        console.error("Error following post:", error);
      });
  };

  const handleCommentSubmit = (e) => {
    setIsCommenting(true);
    e.preventDefault();
    if (!comment || !user) {
      toast.error("Please login to comment", toastConfig("comment-error"));
      return;
    }
    axios
      .post(`https://blogora.up.railway.app/post/add-comment/${post._id}`, {
        content: comment,
        user: user.id,
        type: "comment",
      })
      .then((response) => {
        if (response.status === 200) {
          setState(!state);
          setComment("");
          setIsCommenting(false);
          toast.success("Comment added!", toastConfig("comment-success"));
        }
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  const handleDeleteComment = (commentId) => {
    setIsCommentDeleting(true);
    axios
      .delete(
        `https://blogora.up.railway.app/post/delete-comment/${post._id}`,
        {
          data: { commentId },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setState(!state);
          setIsCommentDeleting(false);
          toast.success(
            "Comment deleted!",
            toastConfig("comment-delete-success")
          );
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
      .post(`https://blogora.up.railway.app/post/like/${postId}`, {
        userId: user.id,
        liked: !liked,
      })
      .then((response) => {
        if (response.status === 200) {
          setState(!state);
          setLiked(!liked);
          toast.success(
            liked ? "Unliked!" : "Liked!",
            toastConfig("like-success")
          );
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
      .put(`https://blogora.up.railway.app/post/like-comment/${post._id}`, {
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
            toast.success(
              updated[index] ? "Liked!" : "Unliked!",
              toastConfig("like-success")
            );
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
      .delete(`https://blogora.up.railway.app/post/delete-post/${post._id}`)
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

  const [openUploadPost, setOpenUploadPost] = useState(false);
  const handleOpenUploadPost = () => setOpenUploadPost(true);
  const handleCloseUploadPost = () => setOpenUploadPost(false);

  const initiateData = () => {
    if (post && user) {
      setLiked(post.likes.includes(user.id));
      setFollowed(user.following?.includes(post.author.id));
      setCommentLikes(
        post.comments.map((comment) => comment.likes.includes(user.id))
      );
      setReplyFormOpen(post.comments.map(() => false));
      setReplyTexts(post.comments.map(() => ""));
    }
  };

  useEffect(() => {
    if (post) {
      initiateData();
    }
  }, [post]);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: upStyle() }} />
      {post ? (
        <motion.div
          variants={fadeOut()}
          initial="initial"
          animate="animate"
          className="w-full px-4 sm:max-w-3/4 bg-white text-black shadow-xl rounded-2xl mb-16 sm:mb-6 md:p-6 lg:p-8 xl:p-10 mt-24 relative transition-all duration-300 hover:shadow-2xl mx-auto "
        >
          {/* Action buttons */}
          {user && user.id === post.author._id ? (
            <div className="relative">
              {/* Toggle Button */}
              <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className="p-1 rounded-full transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 absolute -top-4 -right-4 cursor-pointer"
                aria-label="Post options"
                aria-haspopup="true"
                aria-expanded={isOptionsOpen}
              >
                <SlOptionsVertical className="text-gray-500 hover:text-gray-700 text-lg" />
              </button>

              {/* Dropdown Menu */}
              {isOptionsOpen && (
                <div className="absolute right-6 -top-4  mt-2 w-40 origin-top-left rounded-md bg-white shadow-md border border-gray-200 ring-offset-gray-300 ring-opacity-5 focus:outline-none z-50 animate-fade-in">
                  <div className="py-1">
                    <button
                      onClick={handleOpenUploadPost}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                    >
                      <span className="mr-2">✏️</span>
                      Edit
                    </button>
                    <button
                      onClick={handleDeletePost}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                    >
                      <span className="mr-2">🗑️</span>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleFollow}
              className="absolute top-4 right-4 flex items-center gap-1 text-sm md:text-base font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
            >
              <FaUserPlus className={followed ? "text-blue-700" : ""} />{" "}
              <span>{followed ? "Following" : "Follow"}</span>
            </button>
          )}

          {/* Top section */}
          <div className="w-full flex flex-col justify-between items-center gap-4 mb-4">
            {/* Left: author info */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={
                    post.author.profilePicture ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {post.author.name}
                  </p>
                  <p className="text-gray-600 text-sm flex flex-col items-start gap-1 sm:flex-row lg:flex-row xl:flex-row">
                    <span>{post.createdAt}</span>
                    {post.updatedAt && (
                      <span>
                        <span className="font-semibold">Updated</span>{" "}
                        {post.updatedAt}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Caption */}
              <p
                className="text-gray-700 text-lg mb-4 w-full"
                dangerouslySetInnerHTML={{ __html: post.caption }}
              />
            </div>

            {/* Right: image */}
            <div className="w-full h-full flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
              <img
                src={post.image}
                alt={post.title}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* Bottom icons and counts */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 md:gap-6">
              {/* Like button */}
              <button
                onClick={() => handlePostLikes(post._id)}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group"
                aria-label="Like post"
              >
                <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                  {liked ? (
                    <FaHeart className="text-red-600" />
                  ) : (
                    <FaRegHeart className="group-hover:text-red-600" />
                  )}
                </div>
                <span className="font-medium">{post.likes.length}</span>
              </button>

              {/* Comment toggle */}
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                aria-label="Show comments"
              >
                <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                  <FaComment className="group-hover:text-blue-600" />
                </div>
                <span className="font-medium">{post.comments.length}</span>
              </button>
            </div>

            {/* Share */}
            <button
              className="text-blue-900 hover:text-blue-600 transition-colors group"
              aria-label="Share post"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success(
                  "Link copied to clipboard",
                  toastConfig("share-success")
                );
              }}
            >
              <div className="p-2 rounded-full group-hover:bg-blue-900 cursor-pointer transition-colors">
                <FaShareAlt className="group-hover:text-white" />
              </div>
            </button>
          </div>

          {/* Comments section */}
          {showComments && (
            <div className="mt-6 border-t border-gray-200 pt-4 max-h-[400px] overflow-y-auto">
              <>
                {/* New comment form */}
                <div className="sticky top-0 bg-white py-3 z-10">
                  <form className="flex items-center gap-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
                      required
                    />
                    {isCommenting ? (
                      <CircularProgress size={20} />
                    ) : (
                      <button
                        type="submit"
                        onClick={handleCommentSubmit}
                        disabled={!comment}
                        className={`p-3 rounded-full ${
                          comment
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-200 text-gray-400"
                        } transition-colors`}
                      >
                        <FaArrowRight />
                      </button>
                    )}
                  </form>
                </div>

                {/* Comments list */}
                <div className="space-y-4 mt-2">
                  {post.comments.map((comment, i) => (
                    <div
                      key={comment._id}
                      className="p-4 rounded-xl bg-gray-50"
                    >
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
                            <p className="font-semibold text-gray-900">
                              {comment.user.name}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {comment.createdAt}{" "}
                              {comment.updatedAt &&
                                `· Updated ${comment.updatedAt}`}
                            </p>
                            <p className="text-gray-700 mt-2">
                              {comment.content}
                            </p>
                          </div>
                        </div>

                        {user?.id === comment.user._id && (
                          <span>
                            {isCommentDeleting ? (
                              <CircularProgress size={18} />
                            ) : (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete comment"
                              >
                                <MdDelete className="text-lg" />
                              </button>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Comment action buttons */}
                      <div className="flex items-center gap-4 mt-3 ml-12 text-sm text-gray-600">
                        <button
                          onClick={() => handleCommentLikes(i, comment._id)}
                          className="flex items-center gap-1 hover:text-red-600 transition-colors"
                          aria-label="Like comment"
                        >
                          {commentLikes[i] ? (
                            <FaHeart className="text-red-600" />
                          ) : (
                            <FaRegHeart />
                          )}
                          <span>{comment.likes.length}</span>
                        </button>

                        <button
                          onClick={() => toggleReplyForm(i)}
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          aria-label="Reply to comment"
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
                            name="reply"
                            value={replyTexts[i] || ""}
                            onChange={(e) => {
                              const newTexts = [...replyTexts];
                              newTexts[i] = e.target.value;
                              setReplyTexts(newTexts);
                            }}
                            placeholder="Write a reply..."
                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
                            required
                          />
                          {isReplying ? (
                            <CircularProgress size={18} />
                          ) : (
                            <button
                              type="submit"
                              onClick={(e) => handleReplySubmit(i, e)}
                              className={`p-3 rounded-full ${
                                replyTexts[i]
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-gray-200 text-gray-400"
                              } transition-colors`}
                            >
                              <FaArrowRight />
                            </button>
                          )}
                        </form>
                      )}

                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="mt-4 ml-8 border-l-2 border-gray-200 pl-4 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className="pt-3">
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
                                  <p className="font-semibold text-gray-900">
                                    {reply.user.name}
                                  </p>
                                  <p className="text-gray-600 text-sm">
                                    {reply.createdAt}
                                  </p>
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
                  ))}
                </div>
              </>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="mt-24 flex items-center justify-center">
          <CircularProgress />
          <span className="ml-2">Loading...</span>
        </div>
      )}

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
            }}
          >
            <UploadPostModal handleClose={handleCloseUploadPost} post={post} />
          </Box>
        </Fade>
      </Modal>

      <div dangerouslySetInnerHTML={{ __html: downStyle() }} />
    </>
  );
};

export default SinglePost;
