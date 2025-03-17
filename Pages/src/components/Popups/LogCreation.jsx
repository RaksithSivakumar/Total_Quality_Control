import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Check, Trophy } from "lucide-react";
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
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const LogCreation = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [questions, setQuestions] = useState(["", "", "", "", ""]);
  const [files, setFiles] = useState([]);

  const handleViewDetails = () => {
    setIsExpanded(!isExpanded);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    if (files.length + uploadedFiles.length > 5) {
      alert("You can upload a maximum of 5 files.");
      return;
    }
    setFiles([...files, ...uploadedFiles]);
  };

  const handleSave = () => {
    setIsActive(!isActive);

    if (!status && isExpanded) {
      toast.error("Please select a status.");
      return;
    }

    if (!remarks.trim()) {
      toast.error("Please add remarks.");
      return;
    }

    toast.success("Saved successfully!");
  };

  // Simply call onClose without navigating
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
            flexDirection={isMobile ? "row" : "row"}
          >
            <DialogTitle className="p-0 sm:p-2">
              <div className="flex items-center">
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                  size={isMobile ? "small" : "medium"}
                >
                  <ArrowLeft size={isMobile ? 18 : 24} />
                </IconButton>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  component="h1"
                  className="flex justify-between items-center p-4"
                >
                  Log creation
                </Typography>
              </div>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              size={isMobile ? "small" : "medium"}
            >
              <CloseIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Box>

          {/* Status */}
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
              Your problem is submitted. Waiting for the supervisor's approval
            </Typography>

            {/* Points Provided */}
            <Box mb={isMobile ? 2 : 3} px={isMobile ? 1 : 2}>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                Points provided
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={isMobile ? 1 : 2}
                bgcolor="grey.100"
                borderRadius={1}
                border={1}
                borderColor="grey.300"
                mt={1}
              >
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  500 points
                </Typography>
                <Trophy fontSize={isMobile ? "small" : "medium"} color="warning" />
              </Box>
            </Box>

            {/* View Details Button */}
            <Button
              variant="outlined"
              fullWidth
              onClick={handleViewDetails}
              aria-expanded={isExpanded}
              className="flex items-center justify-between p-3 sm:p-8 bg-gray-50 rounded-lg hover:bg-gray-100 mt-2 sm:mt-4 text-xs sm:text-sm"
            >
              <span className="text-gray-600">View details</span>
              {isExpanded ? (
                <ChevronUp
                  className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-500 p-1 ml-auto transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              ) : (
                <ChevronDown
                  className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-500 p-1 ml-auto transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              )}
            </Button>
          </div>

          {/* Full Form (Conditionally Rendered) */}
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
                  Productivity failure
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
                  Water leakage
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
                  Unintended escape of water from pipes, fixtures, or
                  structures, leading to potential damage and waste in AS block.
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
                    phoenix-document.pdf
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
                <input
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.doc,.docx"
                  style={{ marginTop: 8, width: "100%" }}
                />
              </div>

              {/* Questions */}
              <div className="mb-6">
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  className="text-gray-700 font-medium mb-3 text-sm sm:text-base"
                >
                  Questions
                </Typography>
                {[
                  "HAVE YOU TRIED TO SOLVE THE PROBLEM?",
                  "WHEN DID THE PROBLEM ARISE?",
                  "VENUE OF THE PROBLEM ARISE?",
                  "SPECIFICATION OF THE PROBLEM?",
                  "PROBLEM ARISE TIME?",
                ].map((question, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-sm mb-2">
                      {index + 1}. {question}
                    </p>
                    <input
                      type="text"
                      placeholder="Type your answer"
                      className="w-full p-3 bg-gray-100 rounded-md border-none outline-none"
                      value={questions[index]}
                      onChange={(e) =>
                        handleQuestionChange(index, e.target.value)
                      }
                    />
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

              {/* Buttons Section */}
              <DialogActions className="mt-4 sm:mt-6 flex justify-end gap-2 sm:gap-4 p-0 sm:p-2">
                <Button
                  onClick={handleClose}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                  }}
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
      <ToastContainer />
    </Dialog>
  );
};

export default LogCreation;