 import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, Check } from "lucide-react";
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
import { Close as CloseIcon } from "@mui/icons-material";
// ------------------ LogCreation Popup Component ------------------
const LogCreation = ({ open, onClose, storedProblemTitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [problem, setProblem] = useState(null);
  // When the dialog opens, fetch the problems and find the one that matches the storedProblemTitle.
  useEffect(() => {
    if (open) {
      fetch("http://localhost:5000/api/master_problem")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const matchedProblem = Array.isArray(data)
            ? data.find(
                (item) =>
                  item["Problem Title"].toLowerCase() ===
                  storedProblemTitle.toLowerCase()
              )
            : data["Problem Title"].toLowerCase() === storedProblemTitle.toLowerCase()
            ? data
            : null;
          if (matchedProblem) {
            setProblem(matchedProblem);
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
  const handleSave = () => {
    setIsActive(!isActive);
    if (!status && isExpanded) {
      alert("Please select a status.");
      return;
    }
    // Your save logic here
    alert("Saved!");
  };
  // Prepare the questions array. Use fetched data if available; otherwise, default questions.
  const defaultQuestions = [
    "HAVE YOU TRIED TO SOLVE THE PROBLEM?",
    "WHEN DID THE PROBLEM ARISE?",
    "VENUE OF THE PROBLEM ARISE?",
    "SPECIFICATION OF THE PROBLEM?",
    "PROBLEM ARISE TIME?"
  ];
  const questions = problem
    ? [
        problem["Questions 1"],
        problem["Questions 2"],
        problem["Questions 3"],
        problem["Questions 4"],
        problem["Questions 5"]
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <DialogTitle className="p-0 sm:p-2">
              <div className="flex items-center">
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={onClose}
                  aria-label="close"
                  size={isMobile ? "small" : "medium"}
                >
                  <ArrowLeft size={isMobile ? 18 : 24} />
                </IconButton>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  component="h1"
                  className="flex items-center p-4"
                >
                  Log creation
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
              Problem submitted
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-600 p-1 sm:p-2 text-sm sm:text-base"
            >
              Your problem is submitted. Waiting for the supervisor's approval.
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
                className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-500 p-1 ml-auto transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
          {/* Render the full form if expanded */}
          {isExpanded && (
            <div className="space-y-4 sm:space-y-6">
              {/* Category */}
              <div>
                <Typography variant={isMobile ? "subtitle1" : "h6"} className="text-gray-700 font-medium mb-2 p-1 sm:p-3 text-sm sm:text-base">
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
                      backgroundColor: isActive ? "#E56A1E" : "rgba(255, 118, 34, 0.04)",
                    },
                  }}
                >
                  {problem ? problem.Category : "Productivity failure"}
                </Button>
              </div>
              {/* Problem Title */}
              <div>
                <Typography variant={isMobile ? "subtitle1" : "h6"} className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                  Problem Title
                </Typography>
                <Typography variant="body1" className="text-gray-600 p-2 sm:p-4 text-sm sm:text-base">
                  {problem ? problem["Problem Title"] : storedProblemTitle}
                </Typography>
              </div>
              {/* Description */}
              <div>
                <Typography variant={isMobile ? "subtitle1" : "h6"} className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                  Description
                </Typography>
                <Typography variant="body1" className="text-gray-600 p-1 sm:p-2 text-sm sm:text-base">
                  {problem
                    ? problem.Description
                    : "Unintended escape of water from pipes, fixtures, or structures, leading to potential damage and waste in AS block."}
                </Typography>
              </div>
              {/* Media Upload */}
              <div>
                <Typography variant={isMobile ? "subtitle1" : "h6"} className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                  Media Upload
                </Typography>
                <Typography variant="body2" className="text-gray-500 p-1 sm:p-2 mb-2 sm:mb-3 text-xs sm:text-sm">
                  Add your documents here, and you can upload up to 5 files max
                </Typography>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-100 rounded-lg">
                  <span className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-0">
                    {problem ? problem.Media_Upload : "phoenix-document.pdf"}
                  </span>
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2 text-xs sm:text-sm">Upload complete</span>
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Questions */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Questions</h3>
                {questions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-sm mb-2">{index + 1}. {question}</p>
                    <input
                      type="text"
                      placeholder="Type your answer"
                      className="w-full p-3 bg-gray-100 rounded-md border-none outline-none"
                    />
                  </div>
                ))}
              </div>
              {/* Status Section */}
              <div className="mt-4 sm:mt-6">
                <Typography variant="subtitle2" className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">
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
                <Typography variant="subtitle2" className="text-xs sm:text-sm font-medium mb-2 sm:mb-4">
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
// ------------------ SupervisorDashboard Component ------------------
const StatusBadge = ({ status }) => {
  const badgeColors = {
    New: "text-blue-500",
    Rejected: "text-red-500",
    Accepted: "text-green-500",
  };
  return (
    <span className={`px-3 py-1 text-sm font-medium ${badgeColors[status]}`}>
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
  // Fetch the problems when the dashboard mounts.
  useEffect(() => {
    fetch("http://localhost:5000/api/master_problem")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const problemsWithStatus = data.map((problem) => ({
          ...problem,
          // Set a dummy status ("New") for each problem.
          status: "New",
        }));
        setProblems(problemsWithStatus);
      })
      .catch((error) => {
        console.error("Error fetching problems:", error);
      });
  }, []);
  const filteredProblems = problems.filter((item) => {
    if (activeTab === "All") return true;
    return item.status === activeTab;
  });
  const handleCardClick = (card) => {
    if (card.status === "New") {
      // Save the clicked problem's title then open LogCreation.
      setSelectedProblemTitle(card["Problem Title"]);
      setOpenLogCreation(true);
    } else if (card.status === "Rejected") {
      setOpenRejected(true);
    } else if (card.status === "Accepted") {
      setOpenAccepted(true);
    }
  };
  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-2xl font-semibold mb-4">Welcome Supervisor...</h2>
      {/* Tabs */}
      <div className="flex space-x-6 mb-6 text-lg font-medium bg-gray-100 p-2 rounded-lg">
        <span
          className={`cursor-pointer pb-1 ${activeTab === "All" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
          onClick={() => setActiveTab("All")}
        >
          All <span className="text-gray-500 text-sm">({problems.length})</span>
        </span>
        <span
          className={`cursor-pointer pb-1 ${activeTab === "Accepted" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
          onClick={() => setActiveTab("Accepted")}
        >
          Accepted{" "}
          <span className="text-gray-500 text-sm">
            ({problems.filter((p) => p.status === "Accepted").length})
          </span>
        </span>
        <span
          className={`cursor-pointer pb-1 ${activeTab === "Rejected" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
          onClick={() => setActiveTab("Rejected")}
        >
          Rejected{" "}
          <span className="text-gray-500 text-sm">
            ({problems.filter((p) => p.status === "Rejected").length})
          </span>
        </span>
      </div>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProblems.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-gray-50 rounded-2xl p-4 shadow-md cursor-pointer"
            onClick={() => handleCardClick(item)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{item["Problem Title"]}</h3>
              <StatusBadge status={item.status} />
            </div>
            <div className="text-gray-500 text-xs mb-1">Category: {item.Category}</div>
            <p className="text-gray-600 text-sm">{item.Description}</p>
            <div className="text-gray-500 text-xs mt-3">
              {new Date(item.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-700 ml-2 flex items-center">
                <img
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQDxEQDxAVFRAREBAVEBUSEA8VFRIQGBUWFhUSExUYHSggGBsmGxMTITEhJSkrLi4uFx8zODotNygtLisBCgoKDg0OGxAQGi0iICY3LyswLy0tLS0tLTA3Kys3LS0vLTctLy0tKy0wLy0rKy0tLS0tLS0tLS0rLS0tLS0tK//AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABggBBQcEAgP/xABMEAACAQICBQcFDAYIBwAAAAAAAQIDBAURBgcSITETIkFRYXGBcpGUodIIFBYyUlRigpKxwdFCQ1VzorIjJCUzRWN0oxVTs8Lh8PH/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAgMEAQUG/8QAJREBAAICAQQBBAMAAAAAAAAAAAECAxESBBMxQSEGIlGxBWGB/9oADAMBAAIRAxEAPwDuIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGq0k0gt8Pt5XF1U2YLcklnKc+iEI9LYGzqVFGLlJpRSbbbSSXS23wOYaWa6bS2bp2UPfVRPJyUnCjF9k8m5+G7tOVae6xbrFZOGbpWifMowk+cuutJfHfZwXrIaBP8S1x4rVb2KtOjF8I0qMW0vKnmzUz1kYs/8AEKvgqS+6JFQHUvttZ2L03mr+cuycKMl5nEk+Da872nkrq3pV47s3Byozy6/0ln4I5SALR6L60cOv3GCq8jWeSVOvlBt9UZ/Fl3J5k2TKTZE/0B1oXWHSjSrylXs80nCcm50l10pPq+Tw7g4s0DyYViNK6oU7ihNTpVYqUJLpT610PsPWAAAAAAAAAAAAAAAAAAAAAAAAAKv639J5X+J1YRl/V7WUqNFJ7nKLyqVMutyzXdFFitK8U96WF1c55clQqSj5eWUfW0U9zb3t5t72+tviwAADrAAAAAAAAOye570kcatbDqkuZUTq266pr+8iu9ZPwfWd1KeaJ4q7O/tbpfqq0HLyHzZr7MpFwoyTSa3prNdqDjIAAAAAAAAAAAAAAAAAAAAAAAIXrkz/AOBXuXyaHm5elmVbLZ6ybblcHv4ZZv3tUkl9KK2164oqYot7lvb3JLpb3JIDb3mjN1StqV3Ki3b1YKcZx5yjF55col8XNb83u3moLUWVqqVGnRSWzCnCGWSyaikssurcRLHtWVjcyc4RlQqS4ujlst9bpvd5sjPXPHtonDPpwMHWo6mFnvxB7OfBWqTy73Vf3EnwDVxYWslNwdapHepVmpJPrUFzfUyU56oxhtLl+iGr25v8qk/6C2f6ycXtTX+XB8V2vd3k7nqfs3HJV7hS+VtUnm+1bP3HRDJRbNaZ+F0YqxDhek+q+5tYSq28vfFKKbkoxcasV17G/aXc/AgRbE4pre0VjbVY3lCOVKvJqrFLdCtx2l1KW/xXaW4su51KrJi18w5yy3mgt66+F2NaXxp2tHa8pQSfrTKiMtZqpf8AYlh+4X80jQoSwAAAAAAAAAAAAAAAAAAAAAAAHjxekp29am2lylKpDf8ASi1+JVLV/hvvjE7SlJbo1NufYqac8n4xS8S0mN8YdW/z7jn70bhRxqnfUoqMa9GvCqlkly+SkppfSipZ+T2lN8upmq6mPcRZLAZBja2AZMAAZAGDW6SYRG9tK1tP9ZB7L+TUW+EvBpGyMiJ18uTG1V8QsatvUnSrwcKlOTUlJPiulda7VxLW6u7dUsJsKX6UbSi5LPepSipST8ZMiON6PQvMTtatVbVK0oSk4tZqdSc/6NPrS2JSy7ETfBv7x+S8/OjZXNuYhlti1Ey3QALlIAAAAAAAAAAAAAAAAAAAAA8eKUNuGa4x3+HSaFwTyzXB5rseWX4slRr77D005R3S45dDKM2LfzC/Fk18S0wMgyNTAMmAABkDABkDGys8+l5Z+H/03OEW7jFyfGXDuPmxw+OSlLe3vS6EbI1YcWvully5N/EAANCgAAAAAAAAAAAAAAAAAAAAAAABoL+32JvL4r3r8jzEhvLdVI5dK4PtI8+oxZacZbMV+UMMyYZkqWsMyYZkDB6bGhtzS6FvfceZkgsLbYh9J73+RbipylVlvxh6QAbWMAAAAAAAAAAAAAAAAAAAAAAAAAAAhc6kqVSUaiaTlJrPqbzzXWiS22LUa1StSo1YzqUJRjWUXnsSazUX2n3cW8akdmcU193an0FeTHzhZjvxlok81mjJi6wqpSzlRe1Dpi+K/M8sL+P6SafnMdqzWflrraLeHqZk8k7+PQm/Uei2w+rXyc+ZT9b7l+ZysTadQTaIjcvJWrSqPk6Sbz6un/wTSHBdyPHaWkKSyhHLrfS+9mL/ABajbKDuKsacalSNODm8k6ks8o59GeRtxY+EMmTJyl7wAWKwAAAAAAAAAAAAAAAAAAACL6R6f4fYNxr3CdVfq6S5SefU1HdHxyAlAOJ4vr1ebVnZLLonXqevYivxIdietTFa+a988lF9FGEYZfW3y9ZOKSbWXu7unSi51qkKcFxlOcYxS7W9xxnWVra2lK0wqpue6rcx6euFD2/N1nIr7EK1eW1XrVKsuupUnP72eYlFNObT/UpjnvbFFSnLKneU3TebWXLJ7VOTb6fjrt2yxhTehWlTnGpB5ThKMov6Sea+4tFoppFG4oUZyfNqwjKEs+GfGL7nu8Dtq+4V2yRWYifaTGtxbD6c4ynLmOMW3NdSW/aXSbIiesPE+Tt1Ri+fWeTy4qmsm/PuXnM+WYiszLZ0uK2XLWlfbZYDY0ZU4V4vb24qUW1w7Euh95uiEatsTzjUtpPfHn0/Je6UV3Pf4k3I4ZrNImEusw5rUt6/QcL1/42qlzb2UJZxoQlUqpZNcpU3QT7VFS+2dcxnFlTThB70nty6IrLf4lXNIMRd1d167efKVJOPkJ5Q/hSNVa+5YYyRa0xHpPtXOtapZbNtfuVW1WShU3yqUEuC65w7OK6M+B3fCsWoXdNVbatCrB9MJJ5dj6n2Mp0fvaXlSjLao1Z05ddOcoPzxYmm1m1ywVdwzWditvklduol0Voxqet7/WTDCNelWLSvLOE10yo1HF9+xJNPzkOEm3cgQ/RzWVh181CFfk6rySp11ybbfRFvmy8GTAhp0AAAAAAAAAAAAw3ks+oDjeujT6rRqPDbObhLYTuakW1JbXClBrhuybfajiX/r7X1mx0ixF3V5c3DefLV6k15Lk9n1ZGuL6xqHAAEnAAADrGqXE9u2qWzfOoT2o/u6jb9UtrznJyR6AYp72xCk28oVXyM+rntbLfdLZ87OxPyp6inPHMLF4RiuWVOo93CMn0dj/ADIHrAv4u8zlLdsJQWTeSTaz8eJIiAabzzu8vk0oL1yf4ozdZjjg2/Tma89VFfxEvVo5i8aV3QlCW/lFF7pb4y3NM6pi2KqK2KTzk1vkuhdnacIs6mzVpy6qkH4KSzOsMr6Kkalr+p8lq3pMe4RvWFiXvfD6zT59ZclHfvznmpP7O0zh5PtbuJbdxRtovdSg5zX058P4V/EQE2z5eL0tOOPf5AAcaAAADrmprT+rGvTw67m50qvNt5zbcqc8m1TbfGLyyXUzkZ+tpculUp1Y7pU6kJxfVKMlJfccmNw6uaDz4fdKtRpVY/FqU4TWXVKKa+89BndAAAAAAAADV6UXfI2N3V+RbVpeOw8jaEP1u13TwO9aeTcKcPCdWEGvNJnY8irkFuXcjIBoRAAAAAAym1vTya3p9T6GYAFgdGsSV1Z0K/TOC2+youbNedMhOlNTavK3Y4rzRRnVBiear2knwyq0u582ovPsP6zPHi1TauK8uutVy7tp5erIz9XP2Q3fTuHj1WSfxH7l5JcGdbhVTgpt5LYUm+pZZs5KSzSvFuRwZSTynXpU6MN+/OUec13RjIr6OfmWn6nxcq4p/uYcrxzEHc3Va4f62o2vJ4RX2VE8IBseREajQAAAAAAAC1WrC7dXBrGTebVCMH3wbhv+yiUHPdRVxt4NCP8Ayq9eHrU/+86EZ58pAAOAAAAAAHP9ec8sEqr5Va2X+4n+B0A5rr+qZYTFfKuqK820/wADtfIruADQiAAAAAAAA22ieJu1vaFb9FTUZ/u582XmzT8CS3KaqTUvjKcs+/N5/iQRk2o3HLUaNbi5U1Go+l1afNk32tbMvrGXqq7rEvZ/hckVzTWfcfoPHpviDlCztuijRc5L6U23HPuhl9o2NpR5SpGDeSk1m+qPGT8FmyH4tfe+LirXyyVSbcV1Q4Qj4RUV4EOkr5lo/nMkTwp/ryAA2vngAAAAAAAHfvc8Vs8OuYfJvZNfWpUvyOqHIvc6S/qt6uq5g/PTX5HXSi3lIABEAAAAAA5h7oJ/2ZS/1dP+SZ085b7oR/2bQ/1kP+nUJV8iv4AL0QAAAAAAAAkOi9fOFag+OSrU12x5tRL6rT+oR49WF3fIV6dXLNQlnJdcHzZrxi5IjevKswtwZZxZK3j0lN9X5K2r1M8pSiqVPyqme1l3QjU85DCSaaSVOdO2jLajCLqyafGVT4n+3GD+uyNkMNOFdSv67qIz5pvHj0AAtYwAAAAAAAHb/c5y/or9f5tF/wADOxnGPc5Pm36+nQ/lkdnKL+UgAEQAAAAADnOvPCq9zh1JW9KdWVO6hKUacJTlsbOEU5qKWfGSOjA7E6kVBWjd98wuvRLj2TD0cvVxsbn0Wv7Jb8E+45pT74P3nzK59Fr+yZ+D958yufRbj2S4AHcNKgfB69+Y3Xotx7I+Dl78xuvRLj2S34HcNKhx0Yv3ww+69EuPZM/BXEP2fd+iXHsluwO4aVFWimIfs679EuPZPpaI4i/8ADrr0Wv7JbgDuGlSqmiWJN5yw+6bySzdtWe5LJLh1JH5PRTEP2fd+iXHslugO5JpUP4L3/wCz7r0S49kPRi/+YXXolx7JbwDuGlQXo3ffMLr0S49k+fg9e/Mbn0W49kuAB3DSn3/Abz5lc+i1/ZM/B+8+ZXPotx7JcADuGlQFo7evhY3Xotx7Jn4NX3zC69FuPZLfAdw05RqDwavbUryVzQqUnUqUlBVac4OSjF5tKSW7nHVwCEzudugAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z"
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
        storedProblemTitle={selectedProblemTitle}
      />
      <Rejected open={openRejected} onClose={() => setOpenRejected(false)} />
      <Accepted open={openAccepted} onClose={() => setOpenAccepted(false)} />
      <ToastContainer />
    </div>
  );
};
export default SupervisorDashboard;