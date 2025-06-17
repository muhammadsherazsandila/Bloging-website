import { Link } from "react-router-dom";
import HomePosts from "../components/HomePosts";
import { motion } from "framer-motion";
import { fadeIn, fadeOut, scale } from "../utils/animation";
import AboutApp from "../components/AboutApp";
import Footer from "../components/Footer";
import { downStyle, upStyle } from "../utils/styles";
function Home() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* upStyle */}
        <div dangerouslySetInnerHTML={{ __html: upStyle() }} />
        <div className="mx-auto max-w-2xl sm:max-w-8/12 py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <motion.h1
              className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl"
              variants={fadeOut()}
              initial="initial"
              animate="animate"
            >
              Welcome to <span className="text-blue-900">Blogora</span> Where
              Ideas Find Their Voice
            </motion.h1>
            <motion.p
              className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8"
              variants={fadeIn()}
              initial="initial"
              animate="animate"
            >
              Join a growing community of curious minds, storytellers, and
              creators. Whether you write to inform, inspire, or express —
              Blogora gives your thoughts a home.
            </motion.p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to={"/login"}
                className="rounded-md bg-blue-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
              >
                Get started
              </Link>
              <a
                href="#about"
                className="text-sm/6 font-semibold text-gray-900 hover:text-blue-900 hover:scale-105 transition-all duration-300"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        {/* StyleDown*/}
        <div dangerouslySetInnerHTML={{ __html: downStyle() }} />
      </div>
      <HomePosts />
      <AboutApp />
      <Footer />
    </div>
  );
}

export default Home;
