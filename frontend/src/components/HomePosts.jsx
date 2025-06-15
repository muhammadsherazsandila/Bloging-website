import React, { useEffect, useState } from "react";
import { usePost } from "../contexts/PostContext";
import BlogCard from "./BlogCard";
import { CircularProgress } from "@mui/material";

function HomePosts() {
  const { posts, setPosts } = usePost();
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLatestPosts(() => posts.sort((a, b) => b.createdAt - a.createdAt));
    latestPosts.length > 0 ? setLoading(false) : setLoading(true);
  }, []);

  return (
    <div className="flex flex-col gap-6 items-center md:p-4 lg:p-8 xl:p-12 p-2">
      <h2 className="text-3xl font-bold mb-2">Latest Posts</h2>
      {latestPosts.length > 0 ? (
        latestPosts.map((post, index) => <BlogCard key={index} post={post} />)
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
