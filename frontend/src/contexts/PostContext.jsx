import { useContext, createContext, useState } from "react";

const PostContext = createContext();
export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [state, setState] = useState(false);
  const [searchedPosts, setSearchedPosts] = useState([]);
  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        state,
        setState,
        searchedPosts,
        setSearchedPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
export const usePost = () => useContext(PostContext);
