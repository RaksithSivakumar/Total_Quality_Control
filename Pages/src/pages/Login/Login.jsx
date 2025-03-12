import { useState } from "react";
import bookImage from "../../assets/Images/treeswing.svg";
import readingTimeImage from "../../assets/Images/reading.svg";
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <rect x="8" y="11" width="8" height="10" rx="1" strokeWidth={2} />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 11V7a4 4 0 118 0v4"
    />
  </svg>
);

const EnvelopeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
  </svg>
);

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
  </svg>
);

function LoginPage() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const handleSignUpClick = (e) => {
    e.preventDefault(); // Prevent default button behavior
    setIsSignUpMode(true);
  };

  const handleSignInClick = (e) => {
    e.preventDefault(); // Prevent default button behavior
    setIsSignUpMode(false);
  };

  return (
    <div
      className={`relative w-full min-h-screen overflow-hidden bg-[#efc8b1] ${
        isSignUpMode ? "sign-up-mode" : ""
      }`}
    >
      {/* Circle background */}
      <div
        className={`absolute h-[2000px] w-[2000px] top-[-10%] right-[48%] transform -translate-y-1/2 
          bg-gradient-to-tr from-[#993441] to-[#efc8b1] transition-all duration-[1.8s] ease-in-out 
          rounded-full z-[6] ${
            isSignUpMode ? "translate-x-full right-[52%]" : ""
          }`}
      ></div>

      {/* Forms Container */}
      <div className="absolute w-full h-full top-0 left-0">
        <div
          className={`absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 
          transition-all duration-1000 delay-700 ease-in-out grid grid-cols-1 z-[5] 
          ${isSignUpMode ? "left-1/4" : "left-3/4"}`}
        >
          {/* Sign In Form */}
          <form
            action="#"
            className={`flex flex-col items-center justify-center px-20 py-0 
            transition-all duration-[0.2s] delay-700 overflow-hidden col-start-1 col-end-2 
            row-start-1 row-end-2 ${
              isSignUpMode ? "opacity-0 z-[1]" : "z-[2]"
            }`}
          >
            <h2 className="text-[2.2rem] text-[#993441] mb-[10px]">Sign in</h2>
            <div
              className="max-w-[380px] w-full bg-[#f0f0f0] my-[10px] h-[55px] rounded-[55px] 
              grid grid-cols-[15%_85%] px-[0.4rem] relative"
            >
              <div className="text-center flex items-center justify-center h-full text-[#acacac] transition-all duration-500 text-[1.1rem]">
                <UserIcon />
              </div>
              <input
                type="text"
                placeholder="Username"
                className="bg-transparent outline-none border-none leading-none font-semibold 
                  text-[1.1rem] text-[#333] placeholder:text-[#aaa] placeholder:font-medium"
              />
            </div>
            <div
              className="max-w-[380px] w-full bg-[#f0f0f0] my-[10px] h-[55px] rounded-[55px] 
              grid grid-cols-[15%_85%] px-[0.4rem] relative"
            >
              <div className="text-center flex items-center justify-center h-full text-[#acacac] transition-all duration-500 text-[1.1rem]">
                <LockIcon />
              </div>
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent outline-none border-none leading-none font-semibold 
                  text-[1.1rem] text-[#333] placeholder:text-[#aaa] placeholder:font-medium"
              />
            </div>
            <input
              type="submit"
              value="Login"
              className="w-[150px] bg-[#514644] border-none outline-none h-[49px] rounded-[49px] 
                text-white uppercase font-semibold my-[10px] cursor-pointer transition-all 
                duration-500 hover:bg-[#efc8b1]"
            />
            <p className="py-[0.7rem] text-[1rem]">
              Or Sign in with social platforms
            </p>
            <div className="flex justify-center">
              <a
                href="#"
                className="h-[46px] w-[46px] flex justify-center items-center mx-[0.45rem] 
                text-[#333] rounded-full border border-[#333] no-underline text-[1.1rem] 
                transition-all duration-300 hover:text-[#ffb8b1] hover:border-[#efc8b1]"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                className="h-[46px] w-[46px] flex justify-center items-center mx-[0.45rem] 
                text-[#333] rounded-full border border-[#333] no-underline text-[1.1rem] 
                transition-all duration-300 hover:text-[#ffb8b1] hover:border-[#efc8b1]"
              >
                <TwitterIcon />
              </a>
              <a
                href="#"
                className="h-[46px] w-[46px] flex justify-center items-center mx-[0.45rem] 
                text-[#333] rounded-full border border-[#333] no-underline text-[1.1rem] 
                transition-all duration-300 hover:text-[#ffb8b1] hover:border-[#efc8b1]"
              >
                <GoogleIcon />
              </a>
              <a
                href="#"
                className="h-[46px] w-[46px] flex justify-center items-center mx-[0.45rem] 
                text-[#333] rounded-full border border-[#333] no-underline text-[1.1rem] 
                transition-all duration-300 hover:text-[#ffb8b1] hover:border-[#efc8b1]"
              >
                <LinkedInIcon />
              </a>
            </div>
          </form>

          {/* Sign Up Form */}
          <form
            action="#"
            className={`flex flex-col items-center justify-center px-20 py-0 
            transition-all duration-[0.2s] delay-700 overflow-hidden col-start-1 col-end-2 
            row-start-1 row-end-2 ${
              isSignUpMode ? "opacity-100 z-[2]" : "opacity-0 z-[1]"
            }`}
          >
            <h2 className="text-[2.2rem] text-[#993441] mb-[10px]">Sign up</h2>
            <div
              className="max-w-[380px] w-full bg-[#f0f0f0] my-[10px] h-[55px] rounded-[55px] 
              grid grid-cols-[15%_85%] px-[0.4rem] relative"
            >
              <div className="text-center flex items-center justify-center h-full text-[#acacac] transition-all duration-500 text-[1.1rem]">
                <UserIcon />
              </div>
              <input
                type="text"
                placeholder="Username"
                className="bg-transparent outline-none border-none leading-none font-semibold 
                  text-[1.1rem] text-[#333] placeholder:text-[#aaa] placeholder:font-medium"
              />
            </div>
            <div
              className="max-w-[380px] w-full bg-[#f0f0f0] my-[10px] h-[55px] rounded-[55px] 
              grid grid-cols-[15%_85%] px-[0.4rem] relative"
            >
              <div className="text-center flex items-center justify-center h-full text-[#acacac] transition-all duration-500 text-[1.1rem]">
                <EnvelopeIcon />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent outline-none border-none leading-none font-semibold 
                  text-[1.1rem] text-[#333] placeholder:text-[#aaa] placeholder:font-medium"
              />
            </div>
            <div
              className="max-w-[380px] w-full bg-[#f0f0f0] my-[10px] h-[55px] rounded-[55px] 
              grid grid-cols-[15%_85%] px-[0.4rem] relative"
            >
              <div className="text-center flex items-center justify-center h-full text-[#acacac] transition-all duration-500 text-[1.1rem]">
                <LockIcon />
              </div>
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent outline-none border-none leading-none font-semibold 
                  text-[1.1rem] text-[#333] placeholder:text-[#aaa] placeholder:font-medium"
              />
            </div>
            <input
              type="submit"
              value="Sign up"
              className="w-[150px] bg-[#514644] border-none outline-none h-[49px] rounded-[49px] 
                text-white uppercase font-semibold my-[10px] cursor-pointer transition-all 
                duration-500 hover:bg-[#efc8b1]"
            />
            <p className="py-[0.7rem] text-[1rem]">
              Or Sign up with social platforms
            </p>
            <div className="flex justify-center">
              <a
                href="#"
                className="h-[46px] w-[46px] flex justify-center items-center mx-[0.45rem] 
                text-[#333] rounded-full border border-[#333] no-underline text-[1.1rem] 
                transition-all duration-300 hover:text-[#ffb8b1] hover:border-[#efc8b1]"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                className="h-[46px] w-[46px] flex justify-center items-center mx-[0.45rem] 
                text-[#333] rounded-full border border-[#333] no-underline text-[1.1rem] 
                transition-all duration-300 hover:text-[#ffb8b1] hover:border-[#efc8b1]"
              >
                <TwitterIcon />
              </a>
              <a
                href="#"
                className="h-[46px] w-[46px] flex justify-center items-center mx-[0.45rem] 
                text-[#333] rounded-full border border-[#333] no-underline text-[1.1rem] 
                transition-all duration-300 hover:text-[#ffb8b1] hover:border-[#efc8b1]"
              >
                <GoogleIcon />
              </a>
              <a
                href="#"
                className="h-[46px] w-[46px] flex justify-center items-center mx-[0.45rem] 
                text-[#333] rounded-full border border-[#333] no-underline text-[1.1rem] 
                transition-all duration-300 hover:text-[#ffb8b1] hover:border-[#efc8b1]"
              >
                <LinkedInIcon />
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Panels Container */}
      <div className="absolute h-full w-full top-0 left-0 grid grid-cols-2">
        {/* Left Panel */}
        <div
          className={`flex flex-col items-end justify-around text-center z-[6] px-[12%] py-12 
        ${isSignUpMode ? "pointer-events-none" : "pointer-events-auto"}`}
        >
          <div
            className={`text-white transition-transform duration-[0.9s] ease-in-out delay-[0.6s] 
          ${isSignUpMode ? "transform -translate-x-[800px]" : ""}`}
          >
            <h3 className="font-semibold leading-none text-[1.5rem]">
              New here ?
            </h3>
            <p className="text-[0.95rem] py-[0.7rem]">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
              ex ratione. Aliquid!
            </p>
            <button
              className="m-0 bg-transparent border-2 border-white w-[130px] h-[41px] font-semibold 
              text-[0.8rem] text-white cursor-pointer"
              onClick={handleSignUpClick}
            >
              Sign up
            </button>
          </div>
          <img
            src={bookImage}
            className={`w-full transition-transform duration-[1.1s] ease-in-out delay-[0.4s] 
            ${isSignUpMode ? "transform -translate-x-[800px]" : ""}`}
            alt="Person on tree swing"
          />
        </div>

        {/* Right Panel */}
        <div
          className={`flex flex-col items-end justify-around text-center z-[6] px-[12%] py-12 
        ${isSignUpMode ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <div
            className={`text-white transition-transform duration-[0.9s] ease-in-out delay-[0.6s] 
          ${
            isSignUpMode
              ? "transform translate-x-0"
              : "transform translate-x-[800px]"
          }`}
          >
            <h3 className="font-semibold leading-none text-[1.5rem]">
              One of us ?
            </h3>
            <p className="text-[0.95rem] py-[0.7rem]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button
              className="m-0 bg-transparent border-2 border-white w-[130px] h-[41px] font-semibold 
              text-[0.8rem] text-white cursor-pointer"
              onClick={handleSignInClick}
            >
              Sign in
            </button>
          </div>
          <img
            src={readingTimeImage}
            className={`w-full transition-transform duration-[1.1s] ease-in-out delay-[0.4s] 
            ${
              isSignUpMode
                ? "transform translate-x-0"
                : "transform translate-x-[800px]"
            }`}
            alt="Person reading"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;