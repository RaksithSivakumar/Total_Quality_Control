import React, { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CryptoJS from "crypto-js";
import {
  Close as CloseIcon,
  KeyboardArrowLeftRounded,
} from "@mui/icons-material";

const secretKey = "qwertyuiopasdfghjklzxcvbnm";

// ------------------ LogCreation Popup Component ------------------
const LogCreation = ({ open, onClose, storedProblemTitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [problem, setProblem] = useState(null);
  const [problemTitle, setProblemTitle] = useState(storedProblemTitle); // Initialize with storedProblemTitle
  const [tempStatus, setTempStatus] = useState(""); // Temporary status state
  const [tempRemarks, setTempRemarks] = useState(""); // Temporary remarks state

  // Fetch problem details when the dialog opens
  useEffect(() => {
    if (open) {
      fetch("http://localhost:4000/api/master_problem")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((response) => {
          console.log("API Response:", response);
          const problems = response.data;
          console.log("Problems:", problems);
          if (!storedProblemTitle) {
            console.warn("storedProblemTitle is undefined or null");
            return;
          }
          const matchedProblem = problems.find(
            (item) =>
              item["problem_title"] &&
              item["problem_title"].toLowerCase() ===
                storedProblemTitle.toLowerCase()
          );
          if (matchedProblem) {
            setProblem(matchedProblem);
            setProblemTitle(matchedProblem.problem_title); // Set problemTitle from fetched data
            setStatus(matchedProblem.status || ""); // Set status from fetched data
            setRemarks(matchedProblem.Remarks || ""); // Set remarks from fetched data
          } else {
            console.warn(
              "No matching problem found for title:",
              storedProblemTitle
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching problem details:", error);
        });
    }
  }, [open, storedProblemTitle]);

  const handleViewDetails = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSave = async () => {
    try {
      // Store the current status and remarks into temporary state variables
      setTempStatus(status);
      setTempRemarks(remarks);

      // Prepare data to send to the server
      const data = {
        Category: problem ? problem.Category : "Default Category",
        problem_title: problemTitle,
        status: status || null, // Ensure it's null-safe
        remarks: remarks || "", // Ensure it's always a string
      };

      // Fetch existing problems to check if the problem_title exists
      const response = await fetch("http://localhost:4000/api/master_problem");
      if (!response.ok) throw new Error("Network response was not ok");

      const responseData = await response.json();
      const problems = responseData.data;

      // Check if the problem already exists
      const matchedProblem = problems.find(
        (item) =>
          item.problem_title &&
          item.problem_title.toLowerCase() === problemTitle.toLowerCase()
      );

      let saveResponse;
      if (matchedProblem) {
        // If the problem exists, update it
        const updatedData = {
          ...matchedProblem, // Keep existing data
          status: status, // Update status
          remarks: remarks, // Update remarks
        };

        saveResponse = await fetch(
          `http://localhost:4000/api/master_problem/${matchedProblem.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          }
        );
      } else {
        // If the problem doesn't exist, create a new one
        const newProblemData = {
          Category: problem ? problem.Category : "Default Category",
          problem_title: problemTitle,
          Description: "Description for new problem",
          Media_Upload: "",
          Questions_1: "Default question 1",
          Questions_2: "Default question 2",
          Questions_3: "Default question 3",
          Questions_4: "Default question 4",
          Questions_5: "Default question 5",
          created_at: new Date().toISOString(),
          created_by: "YourUser", // Replace with actual user
          status: status || null,
          remarks: remarks || "",
        };

        saveResponse = await fetch("http://localhost:4000/api/master_problem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProblemData),
        });
      }

      const saveData = await saveResponse.json();
      if (saveResponse.ok) {
        toast.success(saveData.message);
        onClose(); // Close modal
      } else {
        throw new Error("Error saving data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data.");
    }
  };

  const defaultQuestions = [
    "Have you tried to solve the Problem?",
    "When did the problem arise?",
    "Venue of the problem arise?",
    "Specifications of the problem?",
    "Problem arise time?",
  ];

  const questions = problem
    ? [
        problem["Questions_1"] || defaultQuestions[0],
        problem["Questions_2"] || defaultQuestions[1],
        problem["Questions_3"] || defaultQuestions[2],
        problem["Questions_4"] || defaultQuestions[3],
        problem["Questions_5"] || defaultQuestions[4],
      ]
    : defaultQuestions;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : "12px",
          margin: isMobile ? 0 : "32px",
          height: isMobile ? "100%" : "auto",
          maxHeight: isMobile ? "100%" : "90vh",
        },
      }}
    >
      <DialogContent className="bg-white p-3 sm:p-6 overflow-y-auto scrollbar-hide">
        <div className="overflow-y-auto scrollbar-hide">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <DialogTitle className="p-0 sm:p-2">
              <div className="flex items-center">
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={onClose}
                  aria-label="close"
                  size={isMobile ? "small" : "medium"}
                >
                  <KeyboardArrowLeftRounded size={isMobile ? 16 : 20} />
                </IconButton>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  component="h1"
                  className="flex items-center font-bold text-[#303030]"
                >
                  Problem Log
                </Typography>
              </div>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={onClose}
              size={isMobile ? "small" : "medium"}
            >
              <CloseIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Box>

          {/* Status message */}
          <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              className="text-blue-500 font-semibold"
            >
              Problem
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-600 p-1 sm:p-2 text-sm sm:text-base"
            >
              {/* Your problem is submitted. Waiting for the supervisor's approval. */}
            </Typography>

            {/* View Details Button */}
            <Button
              variant="outlined"
              fullWidth
              onClick={handleViewDetails}
              aria-expanded={isExpanded}
              className="flex items-center justify-between p-3 sm:p-8 bg-gray-50 rounded-lg hover:bg-gray-100 mt-2 sm:mt-4 text-xs sm:text-sm"
            >
              <span className="text-gray-600">View details</span>
              <ChevronDown
                className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-500 p-1 ml-auto transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {/* Render the full form if expanded */}
          {isExpanded && (
            <div className="space-y-4 sm:space-y-6">
              {/* Category */}
              <div>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  className="text-gray-700 font-medium mb-2 p-1 sm:p-3 text-sm sm:text-base"
                >
                  Category
                </Typography>
                <Button
                  onClick={() => setIsActive(!isActive)}
                  variant={isActive ? "contained" : "outlined"}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    color: isActive ? "white" : "#FF7622",
                    backgroundColor: isActive ? "#FF7622" : "transparent",
                    borderColor: "#FF7622",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    padding: isMobile ? "4px 10px" : "6px 16px",
                    "&:hover": {
                      borderColor: "#E56A1E",
                      backgroundColor: isActive
                        ? "#E56A1E"
                        : "rgba(255, 118, 34, 0.04)",
                    },
                  }}
                >
                  {problem ? problem.Category : "Productivity failure"}
                </Button>
              </div>

              {/* Problem Title */}
              <div>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base"
                >
                  Problem Title
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-600 p-2 sm:p-4 text-sm sm:text-base"
                >
                  {problemTitle} {/* Display problemTitle */}
                </Typography>
              </div>

              {/* Description */}
              <div>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base"
                >
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-600 p-1 sm:p-2 text-sm sm:text-base"
                >
                  {problem
                    ? problem.Description
                    : "Unintended escape of water from pipes, fixtures, or structures, leading to potential damage and waste in AS block."}
                </Typography>
              </div>

              {/* Media Upload */}
              <div>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base"
                >
                  Media Upload
                </Typography>
                <Typography
                  variant="body2"
                  className="text-gray-500 p-1 sm:p-2 mb-2 sm:mb-3 text-xs sm:text-sm"
                >
                  Add your documents here, and you can upload up to 5 files max
                </Typography>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-100 rounded-lg">
                  <span className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-0">
                    {problem ? problem.Media_Upload : "phoenix-document.pdf"}
                  </span>
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2 text-xs sm:text-sm">
                      Upload complete
                    </span>
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions */}
              {/* Questions */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Questions</h3>
                {questions.map((answer, index) => (
                  <div key={index} className="mb-4">
                    {/* Question */}
                    <p className="text-sm font-medium mb-1">
                      {index + 1}. {defaultQuestions[index]}
                    </p>

                    {/* Answer */}
                    <Typography
                      variant="body2"
                      className="text-gray-600 p-1 sm:p-2 text-sm sm:text-base"
                    >
                      {answer ? answer : "No answer provided"}
                    </Typography>
                  </div>
                ))}
              </div>

              {/* Status Section */}
              <div className="mt-4 sm:mt-6">
                <Typography
                  variant="subtitle2"
                  className="text-xs sm:text-sm font-medium mb-1 sm:mb-2"
                >
                  Status
                </Typography>
                <div className="flex gap-3 sm:gap-4 p-2 sm:p-4 flex-wrap">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="Accepted"
                      className="mr-1 sm:mr-2"
                      checked={status === "Accepted"}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <span className="text-xs sm:text-sm">Accepted</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="Rejected"
                      className="mr-1 sm:mr-2"
                      checked={status === "Rejected"}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <span className="text-xs sm:text-sm">Rejected</span>
                  </label>
                </div>
              </div>

              {/* Remarks Section */}
              <div className="mt-4 sm:mt-6">
                <Typography
                  variant="subtitle2"
                  className="text-xs sm:text-sm font-medium mb-2 sm:mb-4"
                >
                  Remarks
                </Typography>
                <textarea
                  placeholder="Your text goes here"
                  className="w-full p-2 sm:p-3 bg-gray-100 rounded-md border-none outline-none min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  aria-label="Remarks"
                />
              </div>
              <DialogActions className="mt-4 sm:mt-6 flex justify-end gap-2 sm:gap-4 p-0 sm:p-2">
                <Button
                  onClick={onClose}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    backgroundColor: "#FF7622",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    "&:hover": {
                      backgroundColor: "#E56A1E",
                    },
                  }}
                >
                  Save
                </Button>
              </DialogActions>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ------------------ Dummy Rejected & Accepted Components ------------------
const Rejected = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h6">Rejected Popup</Typography>
      </DialogContent>
    </Dialog>
  );
};

const Accepted = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h6">Accepted Popup</Typography>
      </DialogContent>
    </Dialog>
  );
};

const StatusBadge = ({ status }) => {
  const badgeColors = {
    New: "text-blue-500", // blue for New
    Rejected: "text-red-500", // red for Rejected
    Accepted: "text-green-500", // green for Accepted
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-medium ${
        badgeColors[status] || "text-gray-500"
      }`}
    >
      {status}
    </span>
  );
};

const SupervisorDashboard = () => {
  const [problems, setProblems] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [openLogCreation, setOpenLogCreation] = useState(false);
  const [openRejected, setOpenRejected] = useState(false);
  const [openAccepted, setOpenAccepted] = useState(false);
  const [selectedProblemTitle, setSelectedProblemTitle] = useState("");

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const encryptedUser = localStorage.getItem("user");
    if (encryptedUser) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedUser, secretKey);
        const user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUserName(user?.name || "User"); // Default to "User" if name is not found
      } catch (error) {
        console.error("Error decrypting user data:", error);
      }
    }
  }, []);

  // Fetch the problems when the dashboard mounts
  useEffect(() => {
    fetch("http://localhost:4000/api/master_problem")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((response) => {
        console.log("API Response:", response); // Log the API response
        const problems = response.data; // Access the `data` key

        // Ensure that problems is an array before mapping
        if (Array.isArray(problems)) {
          const problemsWithStatus = problems.map((problem) => ({
            ...problem,
            status: problem.status || "New", // Use the status from the API, default to "New"
          }));
          setProblems(problemsWithStatus);
        } else {
          console.error("API returned invalid data format:", problems);
        }
      })
      .catch((error) => {
        console.error("Error fetching problems:", error);
      });
  }, []);

  const filteredProblems = problems.filter((item) => {
    if (activeTab === "All") return true;
    return item.status === activeTab;
  });

  const handleCardClick = (item) => {
    setSelectedProblemTitle(item.problem_title); // Store problem title in state
    setOpenLogCreation(true);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#868686]">
        Welcome {userName} ...
      </h2>
      {/* Tabs */}
      <div className="flex space-x-6 mb-6 text-lg font-medium p-2 rounded-lg">
        <span
          className={`cursor-pointer pb-1 ${
            activeTab === "All"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("All")}
        >
          All <span className="text-gray-500 text-sm">({problems.length})</span>
        </span>
        <span
          className={`cursor-pointer pb-1 ${
            activeTab === "Accepted"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Accepted")}
        >
          Accepted{" "}
          <span className="text-gray-500 text-sm">
            ({problems.filter((p) => p.status === "Accepted").length})
          </span>
        </span>
        <span
          className={`cursor-pointer pb-1 ${
            activeTab === "Rejected"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Rejected")}
        >
          Rejected{" "}
          <span className="text-gray-500 text-sm">
            ({problems.filter((p) => p.status === "Rejected").length})
          </span>
        </span>
      </div>

      {/* Grid Layout */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto"
        style={{
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE and Edge */,
          maxHeight: "70vh" /* Set a maximum height to enable scrolling */,
        }}
      >
        {/* Add a style tag to hide WebKit scrollbars */}
        <style>
          {`
      .grid::-webkit-scrollbar {
        display: none;
      }
    `}
        </style>
        {filteredProblems.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-[#F0F4F8] rounded-2xl p-4 shadow-md cursor-pointer"
            onClick={() => handleCardClick(item)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-bold text-[#3D3B3B]">
                {item["problem_title"]}
              </h3>

              {/* Status Badge with Border */}
              <span
                className={`px-2 py-1 text-xs font-bold rounded-md ${
                  item.status === "New"
                    ? "text-purple-500 border border-purple-500 bg-[#F3F2FF]"
                    : item.status === "Rejected"
                    ? "text-red-500 border border-red-500 bg-[#FFEBED]"
                    : item.status === "Accepted"
                    ? "text-[#1FC16B] border border-[#1FC16B] bg-[#E6FFF1]"
                    : "text-gray-500 border border-gray-300"
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="text-gray-500 text-xs font-bold mb-1">
              Category: {item.Category}
            </div>
            <p className="text-gray-600 text-sm">{item.Description}</p>
            <div className="text-gray-500 text-xs mt-3">
              {new Date(item.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center mt-2">
              <span className="text-xs text-gray-700 flex items-center">
                <img
                  src="https://bitlinks.bitsathy.ac.in/static/media/user.900505a2e95287f7e05c.jpg"
                  alt="Avatar"
                  className="w-5 h-5 rounded-full mr-2"
                />
                By: {item.created_by}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Popups */}
      <LogCreation
        open={openLogCreation}
        onClose={() => setOpenLogCreation(false)}
        storedProblemTitle={selectedProblemTitle} // Pass the selected problem title
      />
      <Rejected open={openRejected} onClose={() => setOpenRejected(false)} />
      <Accepted open={openAccepted} onClose={() => setOpenAccepted(false)} />
      <ToastContainer />
    </div>
  );
};

export default SupervisorDashboard;
