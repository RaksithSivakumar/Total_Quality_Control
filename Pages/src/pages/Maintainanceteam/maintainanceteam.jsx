import React, { useState } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Checkbox, 
  Slide 
} from "@mui/material";
import { Search, Tune } from "@mui/icons-material";

// Import your popup components
import LogCreation from "../../components/Popups/LogCreation";
import Rejected from "../../components/Popups/Rejected";
import Accepted from "../../components/Popups/Accepted";

// Transition component for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Sample data for productivity failures
const productivityFailures = [
  {
    id: 1,
    title: "Productivity failure",
    description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
    date: "10/07/2025",
    requestedBy: "J. David",
    status: "New",
  },
  {
    id: 2,
    title: "Productivity failure",
    description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
    date: "10/07/2025",
    requestedBy: "J. David",
    status: "Rejected",
  },
  {
    id: 3,
    title: "Productivity failure",
    description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
    date: "10/07/2025",
    requestedBy: "J. David",
    status: "Accepted",
  },
  {
    id: 4,
    title: "Productivity failure",
    description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
    date: "10/07/2025",
    requestedBy: "J. David",
    status: "Resolved",
  },
];

// Sample data for schedules
const schedules = {
  today: [
    {
      name: "Mahesh Kumar",
      time: "10.00 AM to 11.00 AM",
      contact: "9654781231",
      venue: "Library front",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Mahesh Kumar",
      time: "10.00 AM to 11.00 AM",
      contact: "9654781231",
      venue: "Library front",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Mahesh Kumar",
      time: "10.00 AM to 11.00 AM",
      contact: "9654781231",
      venue: "Library front",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Mahesh Kumar",
      time: "10.00 AM to 11.00 AM",
      contact: "9654781231",
      venue: "Library front",
      image: "/api/placeholder/60/60",
    },
  ],
  accepted: [
    {    // State for filter popup visibility
      name: "Mahesh Kumar",
      time: "11.00 AM to 12.00 PM",
      contact: "9654781231",
      venue: "Library front",
      date: "15/02/25",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Mahesh Kumar",
      time: "11.00 AM to 12.00 PM",
      contact: "9654781231",
      venue: "Library front",
      date: "15/02/25",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Mahesh Kumar",
      time: "11.00 AM to 12.00 PM",
      contact: "9654781231",
      venue: "Library front",
      date: "15/02/25",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Mahesh Kumar",
      time: "11.00 AM to 12.00 PM",
      contact: "9654781231",
      venue: "Library front",
      date: "15/02/25",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Mahesh Kumar",
      time: "11.00 AM to 12.00 PM",
      contact: "9654781231",
      venue: "Library front",
      date: "15/02/25",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Mahesh Kumar",
      time: "11.00 AM to 12.00 PM",
      contact: "9654781231",
      venue: "Library front",
      date: "15/02/25",
      image: "/api/placeholder/60/60",
    },
  ],
  rejected: [
    {
      name: "Mahesh Kumar",
      time: "11.00 AM to 12.00 PM",
      contact: "9654781231",
      venue: "Library front",
      date: "15/02/25",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Mahesh Kumar",
      time: "11.00 AM to 12.00 PM",
      contact: "9654781231",
      venue: "Library front",
      date: "15/02/25",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Mahesh Kumar",
      time: "11.00 AM to 12.00 PM",
      contact: "9654781231",
      venue: "Library front",
      date: "15/02/25",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Mahesh Kumar",
      time: "11.00 AM to 12.00 PM",
      contact: "9654781231",
      venue: "Library front",
      date: "15/02/25",
      image: "/api/placeholder/60/60",
    },
  ],
  
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const badgeStyles = {
    New: "bg-blue-100 text-blue-600",
    Rejected: "bg-red-100 text-red-500",
    Accepted: "bg-green-100 text-green-500",
    Resolved: "bg-green-100 text-green-500",
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeStyles[status]}`}>
      {status}
    </span>
  );
};

// Schedule Card Component
const ScheduleCard = ({ schedule, status }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3 flex">
      <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
        <img
          src={schedule.image}
          alt={schedule.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="text-sm mb-1">
          <span className="font-medium">Name:</span> {schedule.name}
        </div>
        <div className="text-sm mb-1">
          <span className="font-medium">Time:</span> {schedule.time}
        </div>
        <div className="text-sm mb-1">
          <span className="font-medium">Contact number:</span> {schedule.contact}
        </div>
        <div className="text-sm">
          <span className="font-medium">Venue:</span> {schedule.venue}
        </div>
      </div>
      {schedule.date && (
        <div className={`${status === 'accepted' ? 'text-green-500' : 'text-red-500'} text-sm whitespace-nowrap flex items-center`}>
          {schedule.date} <span className="ml-1">{status === 'accepted' ? '✓' : '✕'}</span>
        </div>
      )}
    </div>
  );
};

// Main Component
const MaintenanceTeam = () => {
  // State management
  const [activeTab, setActiveTab] = useState("requests");
  const [activeFilter, setActiveFilter] = useState("All");
  const [openLogCreation, setOpenLogCreation] = useState(false);
  const [openRejected, setOpenRejected] = useState(false);
  const [openAccepted, setOpenAccepted] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Functions
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleCardClick = (card) => {
    if (card.status === "New") {
      setOpenLogCreation(true);
    } else if (card.status === "Rejected") {
      setOpenRejected(true);
    } else if (card.status === "Accepted") {
      setOpenAccepted(true);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    toggleFilter();
  };

  const handleClearFilters = () => {
    setActiveFilter("All");
  };

  // Filter failures based on active filter
  const filteredFailures = productivityFailures.filter((failure) => {
    if (activeFilter === "All") return true;
    return failure.status === activeFilter;
  });

  // Search and Filter UI
  const renderSearchAndFilter = () => (
    <div className="px-4 py-2 flex space-x-2">
      <div className="flex-1 bg-gray-100 rounded-md flex items-center px-3 py-2">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search for log"
          className="bg-transparent border-none outline-none w-full text-sm text-gray-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button
        className="border border-gray-300 rounded-md px-3 py-2 flex items-center text-gray-600 text-sm"
        onClick={toggleFilter}
      >
        <Tune className="w-4 h-4 mr-1" />
        Filter By
      </button>
    </div>
  );

  // Requests Section UI
  const renderRequests = () => (
    <div className="h-[calc(100vh-200px)] overflow-y-auto hidden-scrollbar">
      {/* Filter Pills */}
      <div className="sticky flex overflow-x-auto py-3 px-4 space-x-4 bg-white">
        <button
          className={`px-4 flex items-center ${
            activeFilter === "All"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveFilter("All")}
        >
          All <span className="ml-1 bg-gray-200 rounded px-1 text-xs">{productivityFailures.length}</span>
        </button>
        <button
          className={`px-4 flex items-center ${
            activeFilter === "New"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveFilter("New")}
        >
          New <span className="ml-1 bg-gray-200 rounded px-1 text-xs">
            {productivityFailures.filter((f) => f.status === "New").length}
          </span>
        </button>
        <button
          className={`px-4 flex items-center ${
            activeFilter === "Accepted"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveFilter("Accepted")}
        >
          Accepted <span className="ml-1 bg-gray-200 rounded px-1 text-xs">
            {productivityFailures.filter((f) => f.status === "Accepted").length}
          </span>
        </button>
        <button
          className={`px-4 flex items-center ${
            activeFilter === "Rejected"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveFilter("Rejected")}
        >
          Rejected <span className="ml-1 bg-gray-200 rounded px-1 text-xs">
            {productivityFailures.filter((f) => f.status === "Rejected").length}
          </span>
        </button>
        <button
          className={`px-4 flex items-center ${
            activeFilter === "Resolved"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveFilter("Resolved")}
        >
          Resolved <span className="ml-1 bg-gray-200 rounded px-1 text-xs">
            {productivityFailures.filter((f) => f.status === "Resolved").length}
          </span>
        </button>
      </div>

      {/* Request Cards */}
      <div className="px-4 py-4 grid grid-cols-1 gap-4">
        {filteredFailures.map((failure) => (
          <div
            key={failure.id}
            className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick(failure)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{failure.title}</h3>
              <StatusBadge status={failure.status} />
            </div>
            <p className="text-gray-600 text-sm mb-2">{failure.description}</p>
            <div className="text-gray-500 text-xs">{failure.date}</div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src="/api/placeholder/24/24"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-gray-600 ml-2">
                Requested by {failure.requestedBy}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Schedules Section UI
  const renderSchedules = () => (
    <div className="h-[calc(100vh-200px)] overflow-y-auto hidden-scrollbar px-4 py-4">
      {/* Today Schedules */}
      <div className="mb-6">
        <h3 className="text-gray-600 mb-2">Today schedules</h3>
        {schedules.today.map((schedule, index) => (
          <ScheduleCard key={index} schedule={schedule} status="today" />
        ))}
      </div>

      {/* Accepted Schedules */}
      <div className="mb-6">
        <h3 className="text-gray-600 mb-2">Accepted schedules</h3>
        {schedules.accepted.map((schedule, index) => (
          <ScheduleCard key={index} schedule={schedule} status="accepted" />
        ))}
      </div>

      {/* Rejected Schedules */}
      <div>
        <h3 className="text-gray-600 mb-2">Rejected schedules</h3>
        {schedules.rejected.map((schedule, index) => (
          <ScheduleCard key={index} schedule={schedule} status="rejected" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Welcome Text */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-gray-500 text-base">Welcome Supervisor. . .</h2>
      </div>

      {/* Mobile: Search Bar - Only visible on mobile */}
      <div className="lg:hidden">{renderSearchAndFilter()}</div>

      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col lg:flex-row h-full">
        {/* Mobile Tabs - Only visible on small screens */}
        <div className="flex lg:hidden">
          <button
            className={`flex-1 py-3 text-center ${
              activeTab === "requests"
                ? "text-orange-500 border-b-2 border-orange-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Requests
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              activeTab === "schedules"
                ? "text-orange-500 border-b-2 border-orange-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("schedules")}
          >
            Schedules
          </button>
        </div>

        {/* Mobile: Content Area - Only visible on mobile */}
        <div className="lg:hidden">
          {activeTab === "requests" ? renderRequests() : renderSchedules()}
        </div>

        {/* Desktop Layout - Hidden on small screens, visible on lg and above */}
        <div className="hidden lg:flex w-full h-[calc(100vh-100px)]">
          {/* Left side (3/5 width) - Requests */}
          <div className="w-3/5 pr-4">
            <div className="font-medium text-gray-700 px-4 py-2">Requests</div>
            {renderRequests()}
          </div>
          {/* Right side (2/5 width) - Schedules */}
          <div className="w-2/5 flex flex-col">
            {/* Search Bar and Filter - Desktop position */}
            {renderSearchAndFilter()}
            <div className="font-medium text-gray-700 px-4 py-2">Schedules</div>
            {renderSchedules()}
          </div>
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog
        onClose={toggleFilter}
        open={showFilter}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="filter-dialog-description"
      >
        <DialogTitle>Filter Approvals</DialogTitle>
        <DialogContent>
          <List>
            {[
              { label: "All", value: "All" },
              { label: "New", value: "New" },
              { label: "Rejected", value: "Rejected" },
              { label: "Accepted", value: "Accepted" },
              { label: "Resolved", value: "Resolved" },
            ].map((filter) => (
              <ListItem key={filter.value} disablePadding>
                <ListItemButton
                  onClick={() => handleFilterChange(filter.value)}
                  selected={activeFilter === filter.value}
                >
                  <Checkbox
                    edge="start"
                    checked={activeFilter === filter.value}
                    tabIndex={-1}
                    disableRipple
                  />
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

      {/* Popups */}
      <LogCreation
        open={openLogCreation}
        onClose={() => setOpenLogCreation(false)}
      />
      <Rejected 
        open={openRejected} 
        onClose={() => setOpenRejected(false)} 
      />
      <Accepted 
        open={openAccepted} 
        onClose={() => setOpenAccepted(false)} 
      />
    </div>
  );
};

export default MaintenanceTeam;