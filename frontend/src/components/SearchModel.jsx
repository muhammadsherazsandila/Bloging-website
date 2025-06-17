import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { hover } from "framer-motion";
import { usePost } from "../contexts/PostContext";

const SearchModel = ({ onClose }) => {
  const { searchedPosts, setSearchedPosts, posts, state } = usePost();
  const [querry, setQuerry] = useState("");

  useEffect(() => {
    const filteredPosts = posts.filter((post) => {
      return post.tags.includes(querry.toLowerCase());
    });
    setSearchedPosts(filteredPosts);
  }, [querry, posts]);

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: 2,
        p: 3,
        outline: "none",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" component="h2">
          Search Posts
        </Typography>
        <IconButton
          onClick={onClose}
          // when hover rotate it to 180 degree and preserve background black
          sx={{
            bgcolor: "#1c398e",
            color: "white",
            "&:hover": { bgcolor: "#1c398e" },
            ":hover": { rotate: "180deg", scale: "1.1" },
            transition: "all 0.3s ease",
          }}
        >
          <CloseIcon
            fontSize="small"
            sx={{
              color: "white",
            }}
          />
        </IconButton>
      </Box>

      {/* Search Input */}
      <TextField
        fullWidth
        placeholder="Search by keyword..."
        variant="outlined"
        value={querry}
        onChange={(e) => {
          setQuerry(e.target.value);
        }}
      />
    </Box>
  );
};

export default SearchModel;
