import React, { useState } from "react";
import {
  Avatar,
  TextField,
  Button,
  Stack,
  Divider,
  Typography,
  IconButton,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { uploadProfilePicture } from "../utils/uploadPicture";
import { toast } from "react-toastify";
import { toastConfig } from "../utils/toastConfig";
import Cookies from "js-cookie";
import { usePost } from "../contexts/PostContext";

const UploadPostModal = ({
  handleClose,
  post = { _id: "", caption: "", image: "", mimeType: "" },
}) => {
  const [caption, setCaption] = useState(
    post.caption !== "" ? post.caption : ""
  );
  const [image, setImage] = useState(
    post.image
      ? base64ToFile(
          post.image.slice(post.image.indexOf("/9j/")),
          "image.png",
          `${post.mimeType}`
        )
      : null
  );
  const { user } = useAuth();
  const { state, setState } = usePost();
  const [isLoading, setIsLoading] = useState(false);
  function base64ToFile(base64String, filename, mimeType = `${post.mimeType}`) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const file = new File([byteArray], filename, { type: mimeType });
    return file;
  }
  const handlePost = async (e) => {
    e.preventDefault();

    if (!caption) {
      toast.error("Please enter a caption", toastConfig("post-upload-error"));
      return;
    }
    if (!image) {
      toast.error("Please upload an image", toastConfig("post-upload-error"));
      return;
    }

    if (image.size > 4000000) {
      toast.error(
        "Image size should be less than 4MB",
        toastConfig("post-upload-error")
      );
      return;
    }

    setIsLoading(true);
    const data = new FormData();
    data.append("caption", caption);
    data.append("image", image);
    data.append("id", post._id);

    console.log(post);
    try {
      const response = await axios.post(
        "https://blogorabloging.vercel.app/post/upload-post",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${Cookies.get("token")}`,
          },
        }
      );
      console.log(response.data);

      if (response.data.status === "success") {
        toast.success("Posted!", toastConfig("post-upload-success"));
        handleClose();
        setState(!state);
        setTitle("");
        setCaption("");
        setImage(null);
      } else {
        toast.error("Error while posting!", toastConfig("post-upload-error"));
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Error while upload post!", toastConfig("post-upload-error"));
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <form className="bg-white p-5 rounded-2xl shadow-lg w-full max-w-xl mx-auto border border-gray-100 relative">
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 3,
          right: 3,
          bgcolor: "black",
          color: "white",
          "&:hover": { bgcolor: "black" },
          ":hover": { rotate: "180deg", scale: "1.1" },
          transition: "all 0.3s ease",
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mt: 3 }}>
        <Avatar sx={{ width: 48, height: 48 }} src={user.profilePicture} />

        <Stack direction="column" spacing={1}>
          <ReactQuill
            value={caption}
            onChange={setCaption}
            style={{
              height: "200px",
              width: "100%",
              paddingLeft: "10px",
              marginBottom: "30px",
            }}
          />
        </Stack>
      </Stack>

      {image && (
        <Box mt={2} position="relative">
          <Chip
            label={` ${image.name || "image.png"}`}
            onDelete={handleRemoveImage}
            deleteIcon={<CloseIcon />}
            variant="outlined"
            sx={{
              pl: 1,
              pr: 0.5,
              py: 2,
              borderRadius: "12px",
              "& .MuiChip-deleteIcon": { fontSize: "18px" },
            }}
          />
        </Box>
      )}

      <Divider sx={{ my: 3, borderColor: "#f0f0f0" }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <IconButton
          component="label"
          sx={{
            color: "#636366",
            backgroundColor: "#f5f5f7",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#ebebed" },
          }}
        >
          <PhotoLibraryIcon />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </IconButton>

        <Button
          className=" bg-blue-500"
          type="submit"
          variant="contained"
          sx={{
            px: 3,
            py: 1,
            borderRadius: "12px",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.875rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            "&:hover": {
              boxShadow: "0 6px 8px rgba(0,0,0,0.08)",
            },
          }}
          onClick={(e) => {
            handlePost(e);
          }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : ""}
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </Stack>
    </form>
  );
};

export default UploadPostModal;
