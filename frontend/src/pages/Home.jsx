import { Link } from "react-router-dom";
import HomePosts from "../components/HomePosts";
import { motion } from "framer-motion";
import { fadeIn, fadeOut, scale } from "../utils/animation";
function Home() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0b72e0] to-[#07275f] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <motion.h1
              className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl"
              variants={fadeOut()}
              initial="initial"
              animate="animate"
            >
              Welcome to Blogora Where Ideas Find Their Voice
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
                href="#"
                className="text-sm/6 font-semibold text-gray-900 hover:text-blue-900 hover:scale-105 transition-all duration-300"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#0b72e0] to-[#07275f] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
      <HomePosts />
    </div>
  );
}

export default Home;
