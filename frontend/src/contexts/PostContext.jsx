import { useContext, createContext, useState } from "react";

const PostContext = createContext();
export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [state, setState] = useState(false);
  return (
    <PostContext.Provider value={{ posts, setPosts, state, setState }}>
      {children}
    </PostContext.Provider>
  );
};
export const usePost = () => useContext(PostContext);
