import { useState } from "react";
import { ArrowLeft, ChevronDown, Check, Calendar, Trophy } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
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
  Slider,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import dayjs from "dayjs";

const Solver = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [isExpanded, setIsExpanded] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [activeStates, setActiveStates] = useState({
    category: false,
    small: true, // Default to small selected
    medium: false,
    large: false,
  });

  // Points state
  const [points, setPoints] = useState(500);

  // Date range states and functions
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs().add(5, "day")]);

  // Status state
  const [status, setStatus] = useState(""); // "Accepted" or "Rejected"

  // Calculate days between dates
  const getDaysDifference = () => {
    if (!dateRange[0] || !dateRange[1]) return 0;
    return dateRange[1].diff(dateRange[0], "day");
  };

  // Function to toggle the date dialog
  const toggleDateDialog = () => {
    setDateDialogOpen(!dateDialogOpen);
  };

  const handleViewDetails = () => {
    setIsExpanded(!isExpanded);
  };

  // Modified to ensure only one size button can be active at a time
  const toggleActiveState = (buttonKey) => {
    if (buttonKey === "category") {
      // For category, just toggle its state
      setActiveStates((prevStates) => ({
        ...prevStates,
        category: !prevStates.category,
      }));
    } else {
      // For size buttons, ensure only one is active
      setActiveStates((prevStates) => ({
        ...prevStates, // Preserve all states
        small: buttonKey === "small",
        medium: buttonKey === "medium",
        large: buttonKey === "large",
      }));
    }
  };

  // Handle points change
  const handlePointsChange = (event) => {
    setPoints(event.target.value === "" ? 0 : Number(event.target.value));
  };

  // Handle slider change
  const handleSliderChange = (event, newValue) => {
    setPoints(newValue);
  };

  const handleSave = () => {
    // Validation
    if (!activeStates.category && isExpanded) {
      toast.error("Please select a category.");
      return;
    }

    if (!activeStates.small && !activeStates.medium && !activeStates.large) {
      toast.error("Please select a problem rating.");
      return;
    }

    if (points <= 0) {
      toast.error("Please set points greater than 0.");
      return;
    }

    // Your save logic here
    toast.success("Problem details saved successfully!");
  };

  // Get the current problem rating
  const getProblemRating = () => {
    if (activeStates.small) return "Small";
    if (activeStates.medium) return "Medium";
    if (activeStates.large) return "Large";
    return "Not selected";
  };

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
                  <ArrowLeft size={isMobile ? 18 : 24} />
                </IconButton>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  component="h1"
                  className="flex justify-between items-center p-4"
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
                <div className="flex flex-wrap gap-2">
                  {["Productivity failure"].map((category) => (
                    <Button
                      key={category}
                      onClick={() => toggleActiveState("category")}
                      variant={activeStates.category ? "contained" : "outlined"}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        color: activeStates.category ? "white" : "#FF7622",
                        backgroundColor: activeStates.category
                          ? "#FF7622"
                          : "transparent",
                        borderColor: "#FF7622",
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                        padding: isMobile ? "4px 10px" : "6px 16px",
                        "&:hover": {
                          borderColor: "#E56A1E",
                          backgroundColor: activeStates.category
                            ? "#E56A1E"
                            : "rgba(255, 118, 34, 0.04)",
                        },
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
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
                    />
                  </div>
                ))}
              </div>

              {/* Status Selection */}
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
                      className="mr-1 sm:mr-2 custom-radio"
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
                      className="mr-1 sm:mr-2 custom-radio"
                      checked={status === "Rejected"}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <span className="text-xs sm:text-sm">Rejected</span>
                  </label>
                </div>
              </div>

              {/* Conditionally Render Sections Based on Status */}
              {status === "Accepted" && (
                <>
                  {/* Problem Rating UI */}
                  <div className="space-y-4 sm:space-y-6 mb-6">
                    <div>
                      <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        className="text-gray-700 font-medium mb-2 text-sm sm:text-base"
                      >
                        Problem rating
                      </Typography>
                      <div className="flex flex-col space-y-3">
                        {/* Rating buttons */}
                        <div className="flex gap-4">
                          {/* Small Button */}
                          <Button
                            onClick={() => toggleActiveState("small")}
                            variant={
                              activeStates.small ? "contained" : "outlined"
                            }
                            size={isMobile ? "small" : "medium"}
                            sx={{
                              flex: 1,
                              color: activeStates.small ? "white" : "#FF7622",
                              backgroundColor: activeStates.small
                                ? "#FF7622"
                                : "transparent",
                              borderColor: "#FF7622",
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              padding: isMobile ? "4px 10px" : "6px 16px",
                              "&:hover": {
                                borderColor: "#E56A1E",
                                backgroundColor: activeStates.small
                                  ? "#E56A1E"
                                  : "rgba(255, 118, 34, 0.04)",
                              },
                            }}
                          >
                            Small
                          </Button>
                          {/* Medium Button */}
                          <Button
                            onClick={() => toggleActiveState("medium")}
                            variant={
                              activeStates.medium ? "contained" : "outlined"
                            }
                            size={isMobile ? "small" : "medium"}
                            sx={{
                              flex: 1,
                              color: activeStates.medium ? "white" : "#FF7622",
                              backgroundColor: activeStates.medium
                                ? "#FF7622"
                                : "transparent",
                              borderColor: "#FF7622",
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              padding: isMobile ? "4px 10px" : "6px 16px",
                              "&:hover": {
                                borderColor: "#E56A1E",
                                backgroundColor: activeStates.medium
                                  ? "#E56A1E"
                                  : "rgba(255, 118, 34, 0.04)",
                              },
                            }}
                          >
                            Medium
                          </Button>
                          {/* Large Button */}
                          <Button
                            onClick={() => toggleActiveState("large")}
                            variant={
                              activeStates.large ? "contained" : "outlined"
                            }
                            size={isMobile ? "small" : "medium"}
                            sx={{
                              flex: 1,
                              color: activeStates.large ? "white" : "#FF7622",
                              backgroundColor: activeStates.large
                                ? "#FF7622"
                                : "transparent",
                              borderColor: "#FF7622",
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              padding: isMobile ? "4px 10px" : "6px 16px",
                              "&:hover": {
                                borderColor: "#E56A1E",
                                backgroundColor: activeStates.large
                                  ? "#E56A1E"
                                  : "rgba(255, 118, 34, 0.04)",
                              },
                            }}
                          >
                            Large
                          </Button>
                        </div>

                        {/* Current selection display */}
                        <div className="w-full border border-gray-200 rounded-lg p-3 sm:p-4">
                          <Typography
                            variant="body1"
                            className="text-center text-gray-600"
                          >
                            {getProblemRating()}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* Deadline with DateRangeCalendar */}
                    <div>
                      <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        className="text-gray-700 font-medium mb-2 text-sm sm:text-base"
                      >
                        Deadline for solving the problem
                      </Typography>
                      <div
                        className="w-full border border-gray-200 rounded-lg p-3 sm:p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={toggleDateDialog}
                      >
                        <Typography variant="body1" className="text-gray-600">
                          {dateRange[0] && dateRange[1]
                            ? `${dateRange[0].format(
                                "MMM DD"
                              )} - ${dateRange[1].format(
                                "MMM DD"
                              )} (${getDaysDifference()} days)`
                            : "Select deadline"}
                        </Typography>
                        <div className="text-orange-500">
                          <Calendar size={20} />
                        </div>
                      </div>
                    </div>

                    {/* Points for solving the problem */}
                    <div>
                      <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        className="text-gray-700 font-medium mb-2 text-sm sm:text-base"
                      >
                        Points provided for solving the problem
                      </Typography>
                      <div className="space-y-3">
                        <div className="w-full border border-gray-200 rounded-lg p-3 sm:p-4 flex justify-between items-center">
                          <TextField
                            value={points}
                            onChange={handlePointsChange}
                            type="number"
                            variant="standard"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  points
                                </InputAdornment>
                              ),
                              disableUnderline: true,
                            }}
                            sx={{
                              width: "100%",
                              "& input": {
                                fontSize: isMobile ? "0.875rem" : "1rem",
                                padding: 0,
                                color: "#4B5563",
                              },
                            }}
                          />
                          <div className="text-orange-500 ml-2">
                            <Trophy size={20} />
                          </div>
                        </div>

                        {/* Slider for points */}
                        <Slider
                          value={points}
                          onChange={handleSliderChange}
                          aria-labelledby="points-slider"
                          min={100}
                          max={1000}
                          step={50}
                          sx={{
                            color: "#FF7622",
                            "& .MuiSlider-thumb": {
                              height: 20,
                              width: 20,
                            },
                            "& .MuiSlider-rail": {
                              opacity: 0.5,
                              backgroundColor: "#E5E7EB",
                            },
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>100 pts</span>
                          <span>500 pts</span>
                          <span>1000 pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

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
                  onClick={onClose}
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
    </Dialog>
  );
};

export default Solver;
