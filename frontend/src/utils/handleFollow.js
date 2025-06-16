import axios from "axios";
import { toast } from "react-toastify";
import { toastConfig } from "./toastConfig";
export const handleFollow = (
  postId,
  user,
  followed,
  setFollowed,
  state,
  setState
) => {
  console.log(postId);
  if (!user) {
    toast.error("Please login to follow", toastConfig("follow-error"));
    return;
  }
  axios
    .put(`https://blogora.up.railway.app/post/follow/${postId}`, {
      userId: user.id,
      followed: !followed,
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.status === "success") {
        setFollowed(!followed);
        setState(!state);
      } else {
        toast.error(response.data.message, toastConfig("follow-error"));
      }
    })
    .catch((error) => {
      console.error("Error following post:", error);
    });
};
