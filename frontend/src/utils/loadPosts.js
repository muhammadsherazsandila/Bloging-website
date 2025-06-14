import axios from "axios";
import { toast } from "react-toastify";
import { toastConfig } from "./toastConfig";

const loadPosts = async (setPosts) => {
  try {
    const response = await axios.get("https://blogorabloging.vercel.app/post");
    if (response.data.status === "success") {
      setPosts(response.data.posts);
    }
  } catch (error) {}
};

export default loadPosts;
