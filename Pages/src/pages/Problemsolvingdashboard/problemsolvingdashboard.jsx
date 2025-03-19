import * as React from "react";
import { Search, Filter } from "lucide-react";
import Card from "../../components/problem/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Slide from "@mui/material/Slide";
// import Rejected from "../../components/Popups/Rejected";
// import Accepted from "../../components/Popups/Accepted";
// import Solver from "../../components/Popups/Solver";
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Check,
    Trophy,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    IconButton,
    Box,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import LogCreation from "./LogCreation";
import Rejected from "./Rejected";
import Accepted from "./Accepted";
import Solver from "./Solver";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE_MB = 5;

function Problemsolver() {
    const [showFilter, setShowFilter] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState("All");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [cardsData, setCardsData] = React.useState([]);
    const [openLogCreation, setOpenLogCreation] = React.useState(false);
    const [openRejected, setOpenRejected] = React.useState(false);
    const [openAccepted, setOpenAccepted] = React.useState(false);
    const [openSolver, setOpenSolver] = React.useState(false);
    const defaultImageUrl = "https://bitlinks.bitsathy.ac.in/static/media/user.900505a2e95287f7e05c.jpg";

    // LogCreation Component State
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [isLogExpanded, setIsLogExpanded] = React.useState(false);
    const [logStatus, setLogStatus] = React.useState("");
    const [logRemarks, setLogRemarks] = React.useState("");
    const [logIsActive, setLogIsActive] = React.useState(false);
    const [logQuestions, setLogQuestions] = React.useState(["", "", "", "", ""]);
    const [logFiles, setLogFiles] = React.useState([]);

    const toggleFilter = () => {
        setShowFilter(!showFilter);
    };

    const handleCardClick = (card) => {
        console.log("Card clicked:", card);
        if (card.status === "Need to verify") {
            setOpenLogCreation(true);
        } else if (card.status === "New") {
            setOpenSolver(true);
        } else if (card.status === "Rejected") {
            setOpenRejected(true);
        } else if (card.status === "Accepted") {
            setOpenAccepted(true);
        }
    };

    // Fetch card data from the API
    React.useEffect(() => {
        const fetchCardsData = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/master_problem");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("API Response Data:", data);

                // Check if data.data is an array before attempting to map
                if (Array.isArray(data.data)) {
                    // Filter cards with "Accepted" status and map to change status to "New"
                    const modifiedData = data.data
                        .filter((item) => item.status === "Accepted")
                        .map((item) => ({
                            ...item,
                            status: "New", // Change status to "New" for display purposes
                        }));
                    console.log("Filtered Cards Data:", modifiedData); // Log modified data
                    setCardsData(modifiedData);
                } else {
                    console.error("Data.data is not an array:", data.data);
                    setCardsData([]); // Set to empty array to avoid further errors
                }
            } catch (error) {
                console.error("Failed to fetch cards data:", error);
            }
        };

        fetchCardsData();
    }, []);

    // Filter cards based on active tab and search query
    const filteredCards = cardsData.filter((card) => {
        const matchesTab = activeTab === "All" || card.status === activeTab;
        const matchesSearch =
            card.problem_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.Description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.created_by?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleFilterChange = (tab) => {
        console.log("Filter changed to:", tab);
        setActiveTab(tab);
    };

    const handleClearFilters = () => {
        setActiveTab("All");
        setSearchQuery(""); // Clear search query as well
    };

    // LogCreation Handlers
    const handleLogViewDetails = () => {
        setIsLogExpanded(!isLogExpanded);
    };

    const handleLogQuestionChange = (index, value) => {
        const newQuestions = [...logQuestions];
        newQuestions[index] = value;
        setLogQuestions(newQuestions);
    };

    const handleLogFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);

        for (let i = 0; i < uploadedFiles.length; i++) {
            if (uploadedFiles[i].size > MAX_FILE_SIZE) {
                toast.error(`File ${uploadedFiles[i].name} is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
                return;
            }
        }

        if (logFiles.length + uploadedFiles.length > 5) {
            toast.error("You can upload a maximum of 5 files.");
            return;
        }

        setLogFiles([...logFiles, ...uploadedFiles]);
    };

    const handleLogSave = () => {
        setLogIsActive(!logIsActive);

        if (!logStatus && isLogExpanded) {
            toast.error("Please select a status.");
            return;
        }

        if (!logRemarks.trim()) {
            toast.error("Please add remarks.");
            return;
        }

        // In a real application, you would send the data to an API here
        console.log("Saving data:", {
            status: logStatus,
            remarks: logRemarks,
            questions: logQuestions,
            files: logFiles.map(file => file.name), // just send file names
        });

        toast.success("Saved successfully!");
    };

    const handleLogClose = () => {
        setOpenLogCreation(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar - Mobile Search */}
            <div className="p-4 md:hidden">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search for log"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-100 rounded-md py-2 pl-10 pr-4 text-sm w-full focus:outline-none"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-medium m-4 text-gray-600">Welcome Admin.</h1>
                    <Button
                        variant="outlined"
                        startIcon={<Filter size={14} />}
                        onClick={toggleFilter}
                        className="hidden md:flex"
                        sx={{
                            borderColor: "black",
                            color: "black",
                            "&:hover": {
                                borderColor: "black",
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                        }}
                    >
                        Filter BY
                    </Button>
                </div>

                {/* Grid of Cards */}
                <div className="grid grid-cols-1 rounded-2xl p-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCards.length === 0 ? (
                        <div>No cards available based on current filters.</div>
                    ) : (
                        filteredCards.map((card, index) => (
                            <div key={index}>
                                <Card
                                    title={card.problem_title}
                                    status={card.status}
                                    description={card.Description}
                                    date={card.created_at}
                                    author={card.created_by}
                                    imageUrl={defaultImageUrl} // Always use the specified image URL
                                    onClick={() => handleCardClick(card)}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Filter Popup (Material-UI Dialog) */}
            <Dialog
                onClose={toggleFilter}
                open={showFilter}
                keepMounted
                aria-describedby="filter-dialog-description"
            >
                <DialogTitle>Filter Approvals</DialogTitle>
                <DialogContent>
                    <List>
                        {[
                            { label: "All", value: "All" },
                            { label: "Need to verify", value: "Need to verify" },
                            { label: "Rejected", value: "Rejected" },
                            { label: "Accepted", value: "Accepted" },
                            { label: "New", value: "New" },
                        ].map((filter) => (
                            <ListItem key={filter.value} disablePadding>
                                <ListItemButton onClick={() => handleFilterChange(filter.value)} selected={activeTab === filter.value}>
                                    <Checkbox edge="start" checked={activeTab === filter.value} tabIndex={-1} disableRipple />
                                    <ListItemText primary={filter.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <div className="flex gap-4 p-4 w-84">
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleClearFilters}
                            sx={{
                                borderColor: "black",
                                color: "black",
                                "&:hover": {
                                    borderColor: "black",
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                },
                            }}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={toggleFilter}
                            sx={{
                                backgroundColor: "#FF7622",
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "#FF5722",
                                },
                            }}
                        >
                            Apply
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>

            {/* LogCreation Dialog (Inline) */}
            <Dialog
                open={openLogCreation}
                onClose={handleLogClose}
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
                                        onClick={handleLogClose}
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
                                onClick={handleLogClose}
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
                                onClick={handleLogViewDetails}
                                aria-expanded={isLogExpanded}
                                className="flex items-center justify-between p-3 sm:p-8 bg-gray-50 rounded-lg hover:bg-gray-100 mt-2 sm:mt-4 text-xs sm:text-sm"
                            >
                                <span className="text-gray-600">View details</span>
                                {isLogExpanded ? (
                                    <ChevronUp
                                        className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-500 p-1 ml-auto transition-transform duration-200 ${isLogExpanded ? "rotate-180" : ""
                                            }`}
                                    />
                                ) : (
                                    <ChevronDown
                                        className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-500 p-1 ml-auto transition-transform duration-200 ${isLogExpanded ? "rotate-180" : ""
                                            }`}
                                    />
                                )}
                            </Button>
                        </div>

                        {/* Full Form (Conditionally Rendered) */}
                        {isLogExpanded && (
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
                                        onClick={() => setLogIsActive(!logIsActive)}
                                        variant={logIsActive ? "contained" : "outlined"}
                                        size={isMobile ? "small" : "medium"}
                                        sx={{
                                            color: logIsActive ? "white" : "#FF7622",
                                            backgroundColor: logIsActive ? "#FF7622" : "transparent",
                                            borderColor: "#FF7622",
                                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                                            padding: isMobile ? "4px 10px" : "6px 16px",
                                            "&:hover": {
                                                borderColor: "#E56A1E",
                                                backgroundColor: logIsActive
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
                                    <input
                                        type="file"
                                        onChange={handleLogFileUpload}
                                        multiple
                                        accept=".pdf,.doc,.docx"
                                        style={{ marginTop: 8, width: "100%" }}
                                    />
                                </div>

                                {/* Display Uploaded Files */}
                                <div>
                                    <Typography
                                        variant={isMobile ? "subtitle1" : "h6"}
                                        className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base"
                                    >
                                        Uploaded Files
                                    </Typography>
                                    {logFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-100 rounded-lg mb-2">
                                            <span className="text-gray-600 text-xs sm:text-sm">{file.name}</span>
                                            <button
                                                className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                                                onClick={() => {
                                                    const newFiles = [...logFiles];
                                                    newFiles.splice(index, 1);
                                                    setLogFiles(newFiles);
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
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
                                                value={logQuestions[index]}
                                                onChange={(e) =>
                                                    handleLogQuestionChange(index, e.target.value)
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
                                                checked={logStatus === "Accepted"}
                                                onChange={(e) => setLogStatus(e.target.value)}
                                            />
                                            <span className="text-xs sm:text-sm">Accepted</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="Rejected"
                                                className="mr-1 sm:mr-2"
                                                checked={logStatus === "Rejected"}
                                                onChange={(e) => setLogStatus(e.target.value)}
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
                                        value={logRemarks}
                                        onChange={(e) => setLogRemarks(e.target.value)}
                                        aria-label="Remarks"
                                    />
                                </div>

                                {/* Buttons Section */}
                                <DialogActions className="mt-4 sm:mt-6 flex justify-end gap-2 sm:gap-4 p-0 sm:p-2">
                                    <Button
                                        onClick={handleLogClose}
                                        color="primary"
                                        size={isMobile ? "small" : "medium"}
                                        sx={{
                                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                                        }}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleLogSave}
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

            <Rejected open={openRejected} onClose={() => setOpenRejected(false)} />
            <Accepted open={openAccepted} onClose={() => setOpenAccepted(false)} />
            <Solver open={openSolver} onClose={() => setOpenSolver(false)} />
        </div>
    );
}

export default Problemsolver;
