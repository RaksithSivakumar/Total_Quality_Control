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
  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Header - Only show if not on login page */}
      {!isLoginPage && (
        <>
          <div className="flex flex-row justify-between items-center bg-white p-4 md:p-6 h-16 md:h-20 border-b border-[#D3E4FF]">
            {/* Left side - Logo and Title */}
            <div className="flex items-center">
              <ProjectLogo className="mr-2 md:mr-6" />
              <h1 className="font-bold text-lg md:text-2xl hidden md:block text-[#5E5E5E]">
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

              {/* Profile image */}
              <button
                className="w-10 h-10 rounded-full border-4 border-gray-300 overflow-hidden hover:border-gray-500 transition-all duration-200"
                onClick={handleProfileClick}
                aria-label="Profile"
              >
                <Avatar
                  alt="Remy Sharp"
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 40, height: 40 }} // Adjusted size
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
                      handleBackClick(); // Navigate back
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
