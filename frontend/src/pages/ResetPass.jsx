import React, { useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Cookie from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { toastConfig } from "../utils/toastConfig";
import { usePost } from "../contexts/PostContext";
import { CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { translation } from "../utils/animation";
import { downStyle, upStyle } from "../utils/styles";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { backendServer } from "../utils/backendServer";

function ResetPass() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState(useParams().token);

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter email", toastConfig("Login-Msg-1"));
      return;
    }

    if (!password) {
      toast.error("Please enter password", toastConfig("Login-Msg-1"));
      return;
    }
    if (password.length < 8) {
      toast.error(
        "Password must be at least 8 characters",
        toastConfig("Login-Msg-1")
      );
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        "${backendServer}/user/reset-password/" +
          encodeURIComponent(token),
        {
          email: email,
          password: password,
        }
      );
      if (response) {
        if (response.data.status === "success") {
          toast.success(response.data.message, toastConfig("Login-Msg-1"));
          navigate("/login");
        } else {
          toast.error(response.data.message, toastConfig("Login-Msg-1"));
          setLoading(false);
        }
      } else {
        toast.error("Server Error", toastConfig("Login-Msg-2"));
        setLoading(false);
      }
    } catch (error) {
      toast.error("Server Error", toastConfig("Login-Msg-3"));
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    try {
      const response = await axios.post(
        "${backendServer}/user/verify-token",
        {
          token: token,
        }
      );
      if (response) {
        if (response.data.status === "success") {
          toast.success(response.data.message, toastConfig("Login-Msg-1"));
        } else {
          toast.error(response.data.message, toastConfig("Login-Msg-1"));
          navigate("/login");
        }
      } else {
        toast.error("Server Error", toastConfig("Login-Msg-2"));
        navigate("/login");
      }
    } catch (error) {
      toast.error("Server Error", toastConfig("Login-Msg-3"));
      navigate("/login");
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div dangerouslySetInnerHTML={{ __html: upStyle() }} />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className=" text-2xl font-bold text-center mt-16">Blogora</h1>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <motion.div
          key="login"
          variants={translation("x", "positive", 80)}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div>
            {" "}
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-900 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    New Password
                  </label>
                </div>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-900 sm:text-sm/6"
                  />
                  {showPassword && (
                    <span
                      className="absolute right-2 top-2 cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    >
                      <IoEyeOffSharp className="text-2xl" />
                    </span>
                  )}
                  {!showPassword && (
                    <span
                      className="absolute right-2 top-2 cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    >
                      <IoEyeSharp className="text-2xl" />
                    </span>
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handlePasswordReset();
                  }}
                  className="flex w-full justify-center rounded-md bg-blue-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
                >
                  {loading && <CircularProgress size={20} color="inherit" />}
                  {loading ? "Redirecting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      <div dangerouslySetInnerHTML={{ __html: downStyle() }} />
    </div>
  );
}

export default ResetPass;
