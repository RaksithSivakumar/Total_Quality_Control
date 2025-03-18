import React, { useEffect, useState } from "react";
import {
  IoNotificationsSharp,
  IoSettingsOutline,
  IoSearchOutline,
  IoMenu,
  IoClose,
  IoChevronBackOutline, // Back button icon
} from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectLogo from "./assets/ProjectLogo.jsx";
import { Avatar } from "@mui/material";
import PointSummary from "./components/Popups/PointSummary";
import Card from "./components/problem/Card.jsx";
import Routernav from "./router/Routernav";

// Mock card data for filtering
const cardData = [
  {
    title: "Productivity failure",
    status: "Need to verify",
    description:
      "Productive failure is a learning design where individuals are allowed to fail in a managed...",
    date: "10/07/2025",
    author: "J. David",
    imageUrl: "https://example.com/image1.png",
  },
  // Add more cards as needed
];

const App = ({ image = "/placeholder.svg?height=60&width=60" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";
  const isSurveyCreationPage = location.pathname === "/survey"; // Check if the current page is the survey creation page
  const [openPointsSummary, setOpenPointsSummary] = useState(false); // For Points Summary popup
  const [profileAnchorEl, setProfileAnchorEl] = useState(null); // For positioning the Points Summary popup
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width

  // Update window width when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false); // Close mobile menu on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/login");
    }
  }, [location, navigate]);

  // Handle profile image click
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
    setOpenPointsSummary(true);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Filter cards based on search query
  const filteredCards = cardData.filter(
    (card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle back button click
  // const handleBackClick = () => {
  //   navigate(-1); // Navigate back to the previous page
  // };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Header - Only show if not on login page */}
      {!isLoginPage && (
        <>
          <div className="flex flex-row justify-between items-center bg-white p-4 md:p-6 h-16 md:h-20 border-b border-[#D3E4FF]">
            {/* Left side - Logo and Title */}
            <div className="flex items-center">
              <ProjectLogo className="mr-2 md:mr-6" />
              <h1 className="font-bold text-lg md:text-2xl p-4 hidden md:block text-[#5E5E5E]">
                Total Quality Circle
              </h1>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                className="p-2 rounded-full bg-[#F5F7FA]"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <IoClose size={24} color="#718EBF" />
                ) : (
                  <IoMenu size={24} color="#718EBF" />
                )}
              </button>
            </div>

            {/* Right side icons - Desktop view */}
            <div className="hidden lg:flex flex-row gap-4 md:gap-6 items-center">
              {/* Search bar */}
              <div className="max-w-md">
                <div className="relative flex items-center bg-[#F5F7FA] rounded-full px-4 py-2">
                  <IoSearchOutline className="text-[#718EBF] text-xl" />
                  <input
                    type="text"
                    placeholder="Search any problem"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="bg-transparent border-none outline-none w-full ml-2 text-[#8BA3CB]"
                  />
                </div>
              </div>

              {/* Settings icon */}
              <button
                className="bg-[#F5F7FA] p-2 rounded-full"
                onClick={() => alert("Setting clicked!")}
              >
                <IoSettingsOutline size={20} color="#718EBF" />
              </button>

              {/* Notification icon */}
              <button
                className="bg-[#F5F7FA] p-2 rounded-full"
                onClick={() => alert("Notification clicked!")}
              >
                <IoNotificationsSharp size={20} color="#718EBF" />
              </button>

              {/* Logout button */}
              <button
                className="bg-[#F5F7FA] p-2 rounded-full hover:bg-red-100 transition-all"
                onClick={() => {
                  localStorage.removeItem("user"); // Clear user data from local storage
                  navigate("/login"); // Redirect to login page
                }}
              >
                <span className="text-[#FF7622] font-semibold text-sm px-3">
                  Logout
                </span>
              </button>

              {/* Profile image */}
              <button
                className="w-10 h-10 rounded-full border-4 border-gray-300 overflow-hidden hover:border-gray-500 transition-all duration-200"
                onClick={handleProfileClick}
                aria-label="Profile"
              >
                <Avatar
                  alt="Remy Sharp"
                  src="data:image/jpeg;base64,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"
                  sx={{ width: 30, height: 30 }} // Adjusted size
                >
                  RS {/* Fallback content */}
                </Avatar>
              </button>
            </div>
          </div>

          {/* Mobile menu overlay */}
          {isMenuOpen && (
            <div className="lg:hidden fixed inset-0 bg-white z-50 pt-20">
              <div className="flex flex-col p-6 space-y-6">
                {/* Search bar */}
                <div className="w-full">
                  <div className="relative flex items-center bg-[#F5F7FA] rounded-full px-4 py-3">
                    <IoSearchOutline className="text-[#718EBF] text-xl" />
                    <input
                      type="text"
                      placeholder="Search any problem"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="bg-transparent border-none outline-none w-full ml-2 text-[#8BA3CB]"
                    />
                  </div>
                </div>

                {/* Menu items */}
                <div className="flex flex-col space-y-4">
                  {/* Back Button */}
                  <button
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#F5F7FA]"
                    onClick={() => {
                      //handleBackClick(); // Navigate back
                      setIsMenuOpen(false); // Close the mobile menu
                    }}
                  >
                    <IoChevronBackOutline size={24} color="#718EBF" />
                    <span className="text-[#5E5E5E] font-medium">Back</span>
                  </button>
                  {/* Settings Button */}
                  <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#F5F7FA]">
                    <IoSettingsOutline size={24} color="#718EBF" />
                    <span className="text-[#5E5E5E] font-medium">Settings</span>
                  </button>
                  {/* Notifications Button */}
                  <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#F5F7FA]">
                    <IoNotificationsSharp size={24} color="#718EBF" />
                    <span className="text-[#5E5E5E] font-medium">
                      Notifications
                    </span>
                  </button>
                  {/* Profile Button */}
                  <button
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#F5F7FA]"
                    onClick={handleProfileClick}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                      sx={{ width: 32, height: 32 }}
                    >
                      RS
                    </Avatar>
                    <span className="text-[#5E5E5E] font-medium">Profile</span>
                  </button>
                  <button
                    className="bg-[#F5F7FA] p-2 rounded-full hover:bg-red-100 transition-all"
                    onClick={() => {
                      localStorage.removeItem("user"); // Clear user data from local storage
                      navigate("/login"); // Redirect to login page
                    }}
                  >
                    <span className="text-[#FF7622] font-semibold text-sm px-3">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Render PointSummary only on the survey creation page */}
      {isSurveyCreationPage && (
        <PointSummary
          open={openPointsSummary}
          onClose={() => setOpenPointsSummary(false)}
          anchorEl={profileAnchorEl}
        />
      )}

      {/* Main content area - Full height on login page */}
      <div
        className={`${
          isLoginPage ? "h-full" : "flex-1"
        } overflow-y-auto scrollbar-hidden`}
      >
        <Routernav />
      </div>
    </div>
  );
};

export default App;
