import React, { useEffect, useState } from "react";
import { usePost } from "../contexts/PostContext";
import BlogCard from "../components/BlogCard";
import { Box, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { scale } from "../utils/animation";

function All() {
  const { posts, setPosts } = usePost();
  const { state } = usePost();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.log(posts);
  }, [state]);

  return (
    <div className="mx-auto px-2 md:px-12 sm:px-18 lg:px-24 py-12 mt-16">
      <h2 className="text-3xl font-bold mb-6">Top Posts</h2>
      {loading ? (
        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <CircularProgress />
          <span>Loading...</span>
        </p>
      ) : (
        ""
      )}

      {posts.map((post, index) => (
        <motion.div
          key={index}
          className="flex flex-col relative"
          variants={scale()}
          initial="initial"
          animate="animate"
        >
          <BlogCard
            key={index}
            post={post}
            position={index % 2 === 0 ? "self-start" : "self-end"}
            postId={post._id}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default All;
