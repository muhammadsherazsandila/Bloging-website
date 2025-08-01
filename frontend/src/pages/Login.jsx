import React, { useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
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

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn, user, setUser } = useAuth();
  const { state, setState } = usePost();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [isLoggedIn]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const [mode, setMode] = useState("login");
  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const signup = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all the fields", toastConfig("Signup-Msg-1"));
      return;
    }
    if (!name) {
      toast.error("Please enter name", toastConfig("Signup-Msg-1"));
      return;
    }
    if (!email) {
      toast.error("Please enter email", toastConfig("Signup-Msg-1"));
      return;
    }
    if (!password) {
      toast.error("Please enter password", toastConfig("Signup-Msg-1"));
      return;
    }

    if (password.length < 8) {
      toast.error(
        "Password must be at least 8 characters",
        toastConfig("Signup-Msg-1")
      );
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    try {
      const response = await axios.post(
        `${backendServer}/user/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        if (response.data.status === "success") {
          setName("");
          setEmail("");
          setPassword("");
          setIsLoggedIn(true);
          Cookie.set("token", response.data.token);
          setUser(response.data.user);
          setState(!state);
        } else {
          toast.error(response.data.message, toastConfig("Signup-Msg-1"));
          setLoading(false);
        }
      } else {
        toast.error("Server Error", toastConfig("Signup-Msg-1"));
        setLoading(false);
      }
    } catch (error) {
      toast.error("Server Error", toastConfig("Signup-Msg-1"));
      setLoading(false);
    }
  };

  const Login = async () => {
    if (!email && !password) {
      toast.error(
        "Please enter email and password",
        toastConfig("Login-Msg-1")
      );
      return;
    }
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

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    try {
      const response = await axios.post(
        `${backendServer}/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        if (response.data.status === "success") {
          setName("");
          setEmail("");
          setPassword("");
          setIsLoggedIn(true);
          Cookie.set("token", response.data.token);
          setUser(response.data.user);
          setState(!state);
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

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter email", toastConfig("Login-Msg-1"));
      return;
    }
    try {
      const response = await axios.post(
        `${backendServer}/user/forgot-password`,
        {
          email: email,
        }
      );
      if (response) {
        if (response.data.status === "success") {
          toast.success(response.data.message, toastConfig("Login-Msg-1"));
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

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div dangerouslySetInnerHTML={{ __html: upStyle() }} />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className=" text-2xl font-bold text-center mt-16">Blogora</h1>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <AnimatePresence mode="wait">
          {mode === "login" ? (
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
                        onChange={handleOnChange}
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
                        Password
                      </label>
                      <div className="text-sm">
                        <span
                          onClick={handleForgotPassword}
                          className="font-semibold text-blue-900 hover:text-blue-800 cursor-pointer"
                        >
                          Forgot password?
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handleOnChange}
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
                        Login();
                      }}
                      className="flex w-full justify-center rounded-md bg-blue-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
                    >
                      {loading && (
                        <CircularProgress size={20} color="inherit" />
                      )}
                      {loading ? "Signing in..." : "Sign in"}
                    </button>
                  </div>
                </form>
                <p className="mt-10 text-center text-sm/6 text-gray-500">
                  Not have account?{" "}
                  <button
                    onClick={() => handleModeChange("signup")}
                    type="button"
                    className="font-semibold text-blue-900 hover:text-blue-800 cursor-pointer"
                  >
                    Signup
                  </button>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              variants={translation("x", "negative", 80)}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div>
                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Full Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={handleOnChange}
                        required
                        autoComplete="name"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-900 sm:text-sm/6"
                      />
                    </div>
                  </div>
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
                        onChange={handleOnChange}
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
                        Password
                      </label>
                    </div>
                    <div className="mt-2 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handleOnChange}
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
                        signup();
                      }}
                      className="flex w-full justify-center rounded-md bg-blue-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
                    >
                      {loading && <CircularProgress size={20} />}
                      {loading ? "Signing up..." : "Sign up"}
                    </button>
                  </div>
                </form>
                <p className="mt-10 text-center text-sm/6 text-gray-500">
                  Have account?{" "}
                  <button
                    onClick={() => handleModeChange("login")}
                    type="button"
                    className="font-semibold text-blue-900 hover:text-blue-800 cursor-pointer"
                  >
                    Login
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div dangerouslySetInnerHTML={{ __html: downStyle() }} />
    </div>
  );
}

export default Login;
