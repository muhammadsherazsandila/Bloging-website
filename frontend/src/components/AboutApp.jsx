import React from "react";
import { FaBookOpen, FaRocket, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeIn, fadeOut, translate } from "../utils/animation";

const AboutApp = () => {
  return (
    <>
      <h1
        className="text-3xl font-bold text-blue-900 mb-4 mx-auto text-center"
        id="about"
      >
        About Blogora
      </h1>
      <section className="bg-white dark:bg-gray-900 py-16 px-6 md:px-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            variants={fadeOut()}
            initial="initial"
            animate="animate"
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
          >
            Welcome to <span className="text-blue-900">Blogora</span>
          </motion.h1>
          <motion.p
            variants={fadeIn()}
            initial="initial"
            animate="animate"
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            A modern space for writers, developers, and storytellers to share
            ideas with the world.
          </motion.p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto mt-16">
          {/* Feature 1 - Slide in from left */}
          <motion.div
            className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800"
            initial={translate("x", "negative", 100)}
            whileInView={translate("x", "positive", 0)}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FaBookOpen className="text-3xl text-blue-700 mb-4" />
            <h3 className="text-gray-600 dark:text-gray-300 text-xl font-semibold mb-2">
              Powerful Editor
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Write rich blogs using a smooth and modern editor.
            </p>
          </motion.div>

          {/* Feature 2 - Slide in from bottom */}
          <motion.div
            className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800"
            initial={translate("y", "positive", 100)}
            whileInView={translate("y", "positive", 0)}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FaUsers className="text-3xl text-blue-700 mb-4" />
            <h3 className="text-gray-600 dark:text-gray-300 text-xl font-semibold mb-2">
              Engaged Community
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Discover and interact with writers and readers.
            </p>
          </motion.div>

          {/* Feature 3 - Slide in from right */}
          <motion.div
            className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800"
            initial={translate("x", "positive", 100)}
            whileInView={translate("x", "positive", 0)}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FaRocket className="text-3xl text-blue-700 mb-4" />
            <h3 className="text-gray-600 dark:text-gray-300 text-xl font-semibold mb-2">
              Fast & Responsive
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Optimized performance and SEO for all devices.
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="/dashboard"
            className="inline-block bg-blue-900 text-white text-lg font-semibold px-6 py-3 rounded-full hover:bg-blue-800 transition"
          >
            Start Writing
          </a>
        </div>
      </section>
    </>
  );
};

const Feature = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition">
    <div className="bg-blue-900 text-white p-4 rounded-full mb-4">
      <Icon className="text-2xl" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
      {title}
    </h3>
    <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export default AboutApp;
