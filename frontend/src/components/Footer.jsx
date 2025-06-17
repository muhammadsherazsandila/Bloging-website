import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { translate } from "../utils/animation";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="dark:bg-gray-900 text-gray-200 py-12 px-4 sm:px-6 mb-6 sm:mb-0">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex items-center justify-around mb-4 gap-4">
          {/* Brand Section */}
          <motion.div
            initial={translate("y", "negative", 100)}
            whileInView={translate("y", "negative", 0)}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2"
          >
            <div
              className="flex items-center mb-4 cursor-pointer"
              onClick={() => {
                navigate("/");
                window.scrollTo(0, 0);
              }}
            >
              <img
                src="/images/logo.jpeg"
                alt="logo"
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-950 ml-3">
                Blogora
              </h2>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              A modern blogging platform built with passion to empower writers
              and connect readers worldwide.
            </p>

            <div className="flex space-x-4">
              <a
                href="https://github.com/muhammadsherazsandila"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-900 hover:bg-blue-950 p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaGithub className="text-xl" />
              </a>
              <a
                href="https://www.linkedin.com/in/muhammad-sheraz-800948347/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-900 hover:bg-blue-950 p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href="mailto:msd.sheraz046@gmail.com"
                className="bg-blue-900 hover:bg-blue-950 p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaEnvelope className="text-xl" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={translate("y", "positive", 100)}
            whileInView={translate("y", "positive", 0)}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-white mb-4 tracking-wide uppercase">
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Top", path: "/top" },
                { name: "All", path: "/all" },
                { name: "About", path: "#about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center justify-center text-gray-400 hover:text-blue-900 hover:scale-105 transition-all "
                  >
                    <span className="w-4 h-4 mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-900 my-8"></div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-600 text-sm mt-8">
        © {new Date().getFullYear()} Blogora. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
