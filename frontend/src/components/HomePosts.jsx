import React, { useEffect, useState } from "react";
import { usePost } from "../contexts/PostContext";
import BlogCard from "./BlogCard";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { scale } from "../utils/animation";

function HomePosts() {
  const { posts, setPosts } = usePost();
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLatestPosts(posts.slice(0, posts.length > 5 ? 5 : posts.length));
    latestPosts.length > 0 ? setLoading(false) : setLoading(true);
  }, [posts]);

  return (
    <div className="flex flex-col gap-6 self-center md:p-4 lg:p-8 xl:p-12 p-2 mb-16">
      <h2 className="text-3xl text-blue-900 font-bold mb-2 mx-auto">
        Latest Posts
      </h2>
      {latestPosts.length > 0 ? (
        latestPosts.map((post, index) => (
          <motion.div
            key={index}
            className="flex flex-col gap-6 relative"
            variants={scale()}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <BlogCard key={index} post={post} position={"self-center"} />
          </motion.div>
        ))
      ) : (
        <p className="flex items-center gap-2">
          <CircularProgress />
          <span>Loading...</span>
        </p>
      )}
    </div>
  );
}

export default HomePosts;
