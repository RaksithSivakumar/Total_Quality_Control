"use client";

import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import { format, differenceInDays } from "date-fns";
import "react-date-range/dist/styles.css"; // Main CSS
import "react-date-range/dist/theme/default.css"; // Theme CSS
import {
  ArrowLeft,
  ChevronDown,
  Check,
  Calendar,
  Trophy,
  User,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify"; // Import toast
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
  Menu,
  MenuItem,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import dayjs from "dayjs";

const Solver = ({ open, onClose, cardData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [isExpanded, setIsExpanded] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [problem, setProblem] = useState(null);
  const [activeStates, setActiveStates] = useState({
    category: false,
    small: true, // Default to small selected
    medium: false,
    large: false,
  });

  const customTheme = createTheme({
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "#FF7622",
            fontWeight: "bold",
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            color: "#FF7622", // Apply theme color to buttons
            "&:hover": {
              backgroundColor: "rgba(255, 118, 34, 0.1)", // Light hover effect
            },
          },
        },
      },
    },
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const [points, setPoints] = useState(500);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [assignToAnchorEl, setAssignToAnchorEl] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePointsChange = (event) => {
    setPoints(event.target.value === "" ? 0 : Number(event.target.value));
  };

  const handleSliderChange = (event, newValue) => {
    setPoints(newValue);
  };

  const handleAssignToClick = (event) => {
    setAssignToAnchorEl(event.currentTarget);
  };

  const handleAssignToClose = () => {
    setAssignToAnchorEl(null);
  };

  const handleAssignToSelect = (assignee) => {
    setAssignedTo(assignee);
    handleAssignToClose();
  };

  const handleSave = () => {
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

    if (!assignedTo) {
      toast.error("Please assign the problem to someone.");
      return;
    }

    toast.success("Problem details saved successfully!");
  };

  const getProblemRating = () => {
    if (activeStates.small) return "Small";
    if (activeStates.medium) return "Medium";
    if (activeStates.large) return "Large";
    return "Not selected";
  };

  const defaultQuestions = [
    "Have you tried to solve the Problem?",
    "When did the problem arise?",
    "Venue of the problem arise?",
    "Specifications of the problem?",
    "Problem arise time?",
  ];

  // Extract answers from backend (cardData)
  const answers = cardData
    ? [
        cardData.Questions_1 || "No answer provided",
        cardData.Questions_2 || "No answer provided",
        cardData.Questions_3 || "No answer provided",
        cardData.Questions_4 || "No answer provided",
        cardData.Questions_5 || "No answer provided",
      ]
    : Array(5).fill("No answer provided");

  const handleDateRangeChange = (ranges) => {
    setDateRange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  const formatDateRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) return "Select deadline";

    const start = format(dateRange.startDate, "MMM dd");
    const end = format(dateRange.endDate, "MMM dd");
    const days = differenceInDays(dateRange.endDate, dateRange.startDate) + 1;

    return `${start} - ${end} (${days} days)`;
  };

  if (!cardData) return null;

  return (
    <ThemeProvider theme={theme}>
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
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                className="flex items-center justify-between p-3 sm:p-8 bg-gray-50 rounded-lg hover:bg-gray-100 mt-2 sm:mt-4 text-xs sm:text-sm"
                sx={{
                  justifyContent: "space-between",
                  display: "flex",
                  alignItems: "center",
                }}
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
                        onClick={() =>
                          setActiveStates((prev) => ({
                            ...prev,
                            category: !prev.category,
                          }))
                        }
                        variant={
                          activeStates.category ? "contained" : "outlined"
                        }
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
                        {cardData.Category}
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
                    {cardData.problem_title || "No title available"}
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
                    {cardData.Description}
                  </Typography>
                </div>

                {/* Media Upload */}
                <div>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base"
                  >
                    Media Uploaded by PR
                  </Typography>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-100 rounded-lg">
                    <a
                      href={cardData.Media_Upload}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-0 underline hover:text-blue-500"
                    >
                      {cardData.Media_Upload}
                    </a>
                  </div>
                </div>

                {/* Questions */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Questions</h3>
                  {defaultQuestions.map((question, index) => (
                    <div key={index} className="mb-4">
                      {/* Question */}
                      <p className="text-sm font-medium mb-1">
                        {index + 1}. {question}
                      </p>

                      {/* Answer */}
                      <Typography
                        variant="body2"
                        className="text-gray-600 p-1 sm:p-2 text-sm sm:text-base"
                      >
                        {answers[index]}
                      </Typography>
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
                          <div className="flex gap-4 p-4">
                            {/* Small Button */}
                            <Button
                              onClick={() =>
                                setActiveStates((prev) => ({
                                  ...prev,
                                  small: true,
                                  medium: false,
                                  large: false,
                                }))
                              }
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
                              onClick={() =>
                                setActiveStates((prev) => ({
                                  ...prev,
                                  small: false,
                                  medium: true,
                                  large: false,
                                }))
                              }
                              variant={
                                activeStates.medium ? "contained" : "outlined"
                              }
                              size={isMobile ? "small" : "medium"}
                              sx={{
                                flex: 1,
                                color: activeStates.medium
                                  ? "white"
                                  : "#FF7622",
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
                              onClick={() =>
                                setActiveStates((prev) => ({
                                  ...prev,
                                  small: false,
                                  medium: false,
                                  large: true,
                                }))
                              }
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
                      <div className="relative">
                        <Typography
                          variant="h6"
                          className="text-gray-800 font-semibold mb-2 text-sm sm:text-base"
                        >
                          Select Deadline for the Problem
                        </Typography>

                        <div
                          className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={toggleCalendar}
                        >
                          <Typography
                            variant="body1"
                            className="text-gray-700"
                            sx={{ color: "#4B5563" }}
                          >
                            {formatDateRange()}
                          </Typography>
                          <div className="text-[#FF7622]">
                            <Calendar size={22} />
                          </div>
                        </div>

                        {showCalendar && (
                          <div
                            ref={calendarRef}
                            className="absolute mt-2 z-50 bg-white p-3 shadow-lg rounded-lg border border-gray-200"
                            style={{
                              width: isMobile ? "100%" : "auto",
                              minWidth: "300px",
                            }}
                          >
                            <DateRange
                              ranges={[
                                {
                                  startDate: dateRange.startDate,
                                  endDate: dateRange.endDate,
                                  key: "selection",
                                },
                              ]}
                              onChange={handleDateRangeChange}
                              moveRangeOnFirstSelection={false}
                              rangeColors={["#FF7622"]}
                              showMonthAndYearPickers={true}
                              months={1}
                              direction="vertical"
                            />
                            <div className="flex justify-end mt-2">
                              <Button
                                onClick={() => setShowCalendar(false)}
                                variant="contained"
                                sx={{
                                  backgroundColor: "#FF7622",
                                  "&:hover": {
                                    backgroundColor: "#E56A1E",
                                  },
                                }}
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        )}
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
                                inputProps: { min: 0 },
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

                {/* Assign To Section */}
                <div className="mt-4 sm:mt-6">
                  <Typography
                    variant="subtitle2"
                    className="text-xs sm:text-sm font-medium mb-2 sm:mb-4"
                  >
                    Assign To
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleAssignToClick}
                    startIcon={<User size={16} />}
                    sx={{
                      color: "#FF7622",
                      borderColor: "#FF7622",
                      "&:hover": {
                        borderColor: "#E56A1E",
                        backgroundColor: "rgba(255, 118, 34, 0.04)",
                      },
                    }}
                  >
                    {assignedTo || "Assign To"}
                  </Button>
                  <Menu
                    anchorEl={assignToAnchorEl}
                    open={Boolean(assignToAnchorEl)}
                    onClose={handleAssignToClose}
                  >
                    {[
                      "John Doe",
                      "Jane Smith",
                      "Alice Johnson",
                      "Bob Brown",
                    ].map((assignee) => (
                      <MenuItem
                        key={assignee}
                        onClick={() => handleAssignToSelect(assignee)}
                      >
                        {assignee}
                      </MenuItem>
                    ))}
                  </Menu>
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

      {/* Date Range Dialog - Alternative calendar implementation */}
      <Dialog
        open={dateDialogOpen}
        onClose={() => setDateDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            "& .MuiPickersLayout-root::before": {
              display: "none !important",
            },
          },
        }}
      >
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateRangeCalendar"]}>
              <DateRangeCalendar
                value={[dayjs(dateRange.startDate), dayjs(dateRange.endDate)]}
                onChange={(newValue) => {
                  if (newValue[0] && newValue[1]) {
                    setDateRange({
                      startDate: newValue[0].toDate(),
                      endDate: newValue[1].toDate(),
                    });
                  }
                }}
                calendars={1}
              />
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDateDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => setDateDialogOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: "#FF7622",
              "&:hover": {
                backgroundColor: "#E56A1E",
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Solver;
