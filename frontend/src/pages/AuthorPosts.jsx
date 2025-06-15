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
import { useAuth } from "../contexts/AuthContext";
function AuthorPosts() {
  const { state } = usePost();
  const { author, setAuthor } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openUploadPost, setOpenUploadPost] = useState(false);
  useEffect(() => {
    setLoading(true);
    setPosts(author ? author.posts : []);
    posts.length > 0 ? setLoading(false) : setLoading(true);
  }, [state, author]);

  return (
    <div className="flex flex-col gap-6 items-center md:p-4 lg:p-8 xl:p-12 p-0 mb-16">
      <h2 className="text-3xl font-bold mb-2">Posts</h2>

      {loading ? (
        <p className="flex items-center gap-2">
          <CircularProgress />
          <span>Loading...</span>
        </p>
      ) : (
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
