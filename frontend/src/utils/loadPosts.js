import axios from "axios";
import { backendServer } from "./backendServer";
const loadPosts = async (setPosts) => {
  try {
    const response = await axios.get(`${backendServer}/post`);
    if (response.data.status === "success") {
      const sortedPosts = [...response.data.posts].sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setPosts(sortedPosts);
    }
  } catch (error) {}
};

export default loadPosts;
