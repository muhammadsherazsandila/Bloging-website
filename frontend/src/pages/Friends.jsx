import React, { useEffect, useState } from "react";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";
import { usePost } from "../contexts/PostContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { translate } from "../utils/animation";

const Friends = () => {
  const { state, setState } = usePost();
  const { author } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-11/12 mb-16 bg-white rounded-lg shadow-md mx-auto overflow-y-auto mt-16 p-7 max-h-96">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Friends</h2>
      <ul className="space-y-3">
        {author.friends ? (
          author.friends.length > 0 ? (
            author.friends.map((friend) => (
              <motion.li
                initial={translate(
                  "x",
                  `${index % 2 === 0 ? "negative" : "positive"}`,
                  100
                )}
                animate={translate("x", "positive", 0)}
                key={friend.id}
                className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-2 rounded-md transition"
                onClick={() => {
                  navigate(`/author-profile/${friend.id}`);
                }}
              >
                <div className="flex items-center space-x-3">
                  <Avatar src={friend.profilePicture} alt={friend.name} />
                  <span className="text-sm font-medium text-gray-700">
                    {friend.name}
                  </span>
                </div>
              </motion.li>
            ))
          ) : (
            <span> No friends found.</span>
          )
        ) : (
          <p>loading...</p>
        )}
      </ul>
    </div>
  );
};

export default Friends;
