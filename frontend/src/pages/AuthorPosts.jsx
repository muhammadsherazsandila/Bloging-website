import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import Cookies from "js-cookie";
import { usePost } from "../contexts/PostContext";
import { CircularProgress } from "@mui/material";
import { AiOutlinePlus } from "react-icons/ai";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import UploadPostModal from "../components/UploadPostModal";
import { motion } from "framer-motion";
import { scale } from "../utils/animation";
function AuthorPosts() {
  const { state } = usePost();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openUploadPost, setOpenUploadPost] = useState(false);
  const fetchPosts = async () => {
    axios
      .get("https://blogorabloging.vercel.app/user/posts", {
        headers: {
          authorization: `${Cookies.get("token")}`,
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          setPosts(response.data.posts);
          setLoading(false);
          console.log(response.data.posts);
        }
      });
  };
  useEffect(() => {
    fetchPosts();
    setLoading(true);
  }, [state]);

  return (
    <div className="flex flex-col gap-6 items-center md:p-4 lg:p-8 xl:p-12 p-0">
      <h2 className="text-3xl font-bold mb-2">Your Posts</h2>
      <button
        onClick={() => setOpenUploadPost(true)}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
      >
        <AiOutlinePlus />
        <span>Upload Post</span>
      </button>
      {loading ? (
        <p className="flex items-center gap-2">
          <CircularProgress />
          <span>Loading...</span>
        </p>
      ) : (
        ""
      )}
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <motion.div
            key={index}
            className="flex flex-col relative"
            variants={scale()}
            initial="initial"
            whileInView="animate"
          >
            <BlogCard key={index} post={post} />
          </motion.div>
        ))
      ) : loading ? (
        ""
      ) : (
        <p>No posts found</p>
      )}

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
    </div>
  );
}

export default AuthorPosts;
