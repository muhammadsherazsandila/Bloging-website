import Cookie from "js-cookie";
import axios from "axios";
export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append("profilePicture", file);
  const response = await axios.put(
    "http://localhost:3000/user/upload-profile-picture",
    formData,
    {
      headers: {
        Authorization: `${Cookie.get("token")}`,
      },
    }
  );
  return response.data;
};
