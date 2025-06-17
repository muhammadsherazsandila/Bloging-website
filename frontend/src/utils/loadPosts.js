import axios from "axios";

const loadPosts = async (setPosts) => {
  try {
    const response = await axios.get("https://blogora.up.railway.app/post");
    if (response.data.status === "success") {
      const sortedPosts = [...response.data.posts].sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setPosts(sortedPosts);
    }
  } catch (error) {}
};

export default loadPosts;
