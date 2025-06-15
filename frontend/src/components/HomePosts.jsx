import React from "react";
import { usePost } from "../contexts/PostContext";
import BlogCard from "./BlogCard";

function HomePosts() {
  const { posts, setPosts } = usePost();
  return (
    <div className="flex flex-col gap-6 items-center md:p-4 lg:p-8 xl:p-12 p-2">
      <h2 className="text-3xl font-bold mb-2">Latest Posts</h2>
      {posts.map((post, index) => (
        <BlogCard key={index} post={post} />
      ))}
    </div>
  );
}

export default HomePosts;
