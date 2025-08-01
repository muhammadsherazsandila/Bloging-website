import React from "react";
import { useAuth } from "../contexts/AuthContext";

function About() {
  const { author } = useAuth();
  return (
    <div className="w-11/12 mb-16 bg-white rounded-lg shadow-md mx-auto overflow-y-auto mt-16 p-7">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">About</h2>
      <p>{author.about}</p>
    </div>
  );
}

export default About;
