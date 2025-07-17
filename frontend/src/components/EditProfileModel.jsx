import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Stack,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { toastConfig } from "../utils/toastConfig";
import { useAuth } from "../contexts/AuthContext";
import { uploadProfilePicture } from "../utils/uploadPicture";
import { usePost } from "../contexts/PostContext";
import { backendServer } from "../utils/backendServer";

const EditProfileModal = ({ handleClose }) => {
  const { setUser, user } = useAuth();
  const { state, setState } = usePost();
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [about, setAbout] = useState(user.about || "");
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user.profilePicture) {
      setPreviewUrl(user.profilePicture);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfilePic(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("about", about);

    try {
      if (profilePic) {
        await uploadProfilePicture(profilePic);
      }
      const response = await axios.put(
        `${backendServer}/user/update-profile`,
        formData,
        {
          headers: {
            Authorization: `${Cookies.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success(
          "Profile updated successfully!",
          toastConfig("update-profile-success")
        );
        setUser(response.data.user);
        handleClose();
        setState(!state);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating profile!",
        toastConfig("update-profile-error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: "background.paper",
        p: 4,
        borderRadius: 3,
        boxShadow: 3,
        width: "100%",
        maxWidth: "500px",
        mx: "auto",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bgcolor: "#1c398e",
            color: "white",
            "&:hover": { bgcolor: "#1c398e" },
            ":hover": { rotate: "180deg", scale: "1.1" },
            transition: "all 0.3s ease",
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>
        Edit Profile
      </Typography>

      <Stack spacing={3} alignItems="center">
        {/* Profile Picture Upload */}
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={
              previewUrl ||
              user.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            sx={{
              width: 120,
              height: 120,
              border: "2px solid",
              borderColor: "divider",
            }}
          />
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <PhotoCameraIcon />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </IconButton>

          {previewUrl && (
            <IconButton
              onClick={handleRemoveImage}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bgcolor: "error.main",
                color: "white",
                "&:hover": { bgcolor: "error.dark" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Name Field */}
        <TextField
          label="Full Name"
          name="name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          size="medium"
          InputProps={{
            sx: { borderRadius: 2, bgcolor: "background.default" },
          }}
        />

        {/* Bio Field */}
        <TextField
          label="Bio"
          name="bio"
          variant="outlined"
          multiline
          minRows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          fullWidth
          size="medium"
          inputProps={{ maxLength: 100 }}
          helperText={`${bio.length}/100 characters`}
          InputProps={{
            sx: { borderRadius: 2, bgcolor: "background.default" },
          }}
        />
        {/* About Field */}
        <TextField
          label="About"
          name="about"
          variant="outlined"
          multiline
          minRows={3}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          fullWidth
          size="medium"
          helperText={`${about.length}/500 characters`}
          InputProps={{
            sx: { borderRadius: 2, bgcolor: "background.default" },
          }}
        />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} width="100%" mt={1}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleClose}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              borderWidth: 2,
              "&:hover": { borderWidth: 2 },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : ""}
            {isLoading ? "updating..." : "Save Changes"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default EditProfileModal;
