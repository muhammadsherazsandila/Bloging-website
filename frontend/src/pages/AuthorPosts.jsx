import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import Cookies from "js-cookie";
import { usePost } from "../contexts/PostContext";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { scale } from "../utils/animation";
function AuthorPosts() {
  const { state } = usePost();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
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
    </div>
  );
}

export default AuthorPosts;
