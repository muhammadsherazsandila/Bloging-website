import React, { useEffect, useState } from "react";
import Home from "./pages/Home";
import Top from "./pages/Top";
import Login from "./pages/Login";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import { loadUser } from "./utils/loadUser";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PostProvider, usePost } from "./contexts/PostContext";
import loadPosts from "./utils/loadPosts";
import BlogCard from "./components/BlogCard";
import AuthorPosts from "./pages/AuthorPosts";
import Friends from "./pages/Friends";
import About from "./pages/About";
import SinglePost from "./pages/SinglePost";
import AuthorProfile from "./components/AuthorProfile";
import AllPosts from "./pages/AllPosts";
import SearchedPosts from "./pages/SearchedPosts";
import ResetPass from "./pages/ResetPass";

function App() {
  return (
    <>
      <PostProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            <ToastContainer />
          </BrowserRouter>
        </AuthProvider>
      </PostProvider>
    </>
  );
}

const AppRoutes = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useAuth();
  const { posts, setPosts, state } = usePost();

  useEffect(() => {
    loadUser(setUser, setIsLoggedIn);
    loadPosts(setPosts);
  }, [state]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top" element={<Top />} />
        <Route path="/all" element={<AllPosts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetPassword/:token" element={<ResetPass />} />
        <Route path="/searchPosts" element={<SearchedPosts />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Login />}
        />

        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/author-profile/:id" element={<AuthorProfile />}>
          <Route path="" element={<AuthorPosts />} />
          <Route path="friends" element={<Friends />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
