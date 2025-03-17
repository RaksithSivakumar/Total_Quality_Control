import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Calender from "../../components/Calender/calender";
import ApprovalsPanel from "../../components/Approval/ApprovalsPanel";
import LogCreation from "../../components/Popups/LogCreation";
import Rejected from "../../components/Popups/Rejected";
import Accepted from "../../components/Popups/Accepted";
  
  // Added state variables for popups
  const [openLogCreation, setOpenLogCreation] = useState(false)
  const [openRejected, setOpenRejected] = useState(false)
  const [openAccepted, setOpenAccepted] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

import { useNavigate } from "react-router-dom";

function ProblemRaisorDashboard() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(3); // Wednesday (index 3) selected by default
  const [showFilter, setShowFilter] = useState(false); // State for filter popup visibility
  const [openLogCreation, setOpenLogCreation] = useState(false);
  const [openRejected, setOpenRejected] = useState(false);
  const [openAccepted, setOpenAccepted] = useState(false);
  const [filters, setFilters] = useState({
    inprogress: true,
    rejected: false,
    accepted: false,
  }) // State for selected filters

  // Handle popstate event to prevent default back button behavior
  useEffect(() => {
    const handlePopState = (event) => {
      // If any popup is open, close it instead of navigating back
      if (openLogCreation || openRejected || openAccepted || showFilter) {
        event.preventDefault();
        closeAllPopups();
        // Push the same state to replace the history entry
        window.history.pushState(null, document.title, location.pathname);
        return;
      }
    };

    // Add popstate event listener
    window.addEventListener('popstate', handlePopState);

    // Add history state when opening any popup
    if (openLogCreation || openRejected || openAccepted || showFilter) {
      window.history.pushState(null, document.title, location.pathname);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [openLogCreation, openRejected, openAccepted, showFilter, location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeAllPopups = () => {
    setOpenLogCreation(false);
    setOpenRejected(false);
    setOpenAccepted(false);
    setShowFilter(false);
  };

  const days = ["S", "M", "T", "W", "T", "F", "S"]
  const dates = ["21", "22", "23", "24", "25", "26", "27"]
  });
  const [problems, setProblems] = useState([]); // State to store fetched problems
  const [username, setUsername] = useState(""); // Add state for username

 
  const timeSlots = [
    { time: "8 am" },
    { time: "9 am" },
    { time: "10 am" },
    { time: "11 am" },
    { time: "12 pm" },
    { time: "1 pm" },
    { time: "2 pm" },
    { time: "3 pm" },
    { time: "4 pm" },
  ];

  const events = [
    {
      id: 1,
      title: "Learnt SQL",
      category: "Personal",
      location: "IT101",
      startTime: "9:00",
      endTime: "10:00",
      timePosition: 1, // Position based on timeSlots index
      profileImage: null,
    },
    {
      id: 2,
      title: "DSA QP verification",
      category: "QP",
      location: "IT lab101",
      startTime: "10:00",
      endTime: "11:00",
      timePosition: 2, // Position based on timeSlots index
      profileImage: "/placeholder.svg?height=40&width=40",
    },
  ];

  // Fetch problems from the API
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/master_problem");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        
        // Access the 'data' property inside the result object
        const data = result.data;

        // Ensure the response data is an array
        if (Array.isArray(data)) {
          setProblems(data); // Store the fetched data in the state
        } else {
          console.error("API response data is not an array:", data);
          setProblems([]); // Set to an empty array if the response data is not an array
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
        setProblems([]); // Set to an empty array in case of an error
      }
    };

    fetchProblems();
  }, []); // Empty dependency array means this runs once on mount

  // Map problems to approvals format
  const mappedApprovals = problems.map((problem) => ({
    id: problem.id,
    title: problem.problem_title,
    description: problem.Description,
    date: new Date(problem.created_at).toLocaleDateString(), // Format the date
    status: "inprogress", // Default status (you can adjust this based on your data)
  }));

  const handleDayClick = (index) => {
    setSelectedDay(index);
  };



  // Modified handleCardClick to prevent navigation and use our custom close behavior
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleCardClick = (card) => {
    console.log("Card clicked:", card);
    if (card.status === "inprogress") {
      setOpenLogCreation(true);
    } else if (card.status === "rejected") {
      setOpenRejected(true);
    } else if (card.status === "accepted") {
      setOpenAccepted(true);
    }
  };

  // Modified close handlers to prevent default behavior
  const handleCloseLogCreation = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenLogCreation(false);
  };

  const handleCloseRejected = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenRejected(false);
  };

  const handleCloseAccepted = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenAccepted(false);
  };

  const handleFilterChange = (filter) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: !prevFilters[filter],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      inprogress: false,
      rejected: false,
      accepted: false,
    });
  };

  const handleApplyFilters = () => {
    toggleFilter();
  };

  const filteredApprovals = mappedApprovals.filter((approval) => {
    if (!filters.inprogress && !filters.rejected && !filters.accepted) {
      return true;
    }
    return (
      (filters.inprogress && approval.status === "inprogress") ||
      (filters.rejected && approval.status === "rejected") ||
      (filters.accepted && approval.status === "accepted")
    );
  });

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <div className="flex flex-col md:flex-row h-full overflow-hidden">
        <div className="w-full md:w-4/5 flex flex-col h-full overflow-hidden">
          <div className="p-4 md:p-6">
            <Header username="Kiruthika..." onFilterClick={toggleFilter} />
          </div>
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-6 scrollbar-hide">
            <Calender
              days={days}
              dates={dates}
              timeSlots={timeSlots}
              events={events}
              selectedDay={selectedDay}
              onDayClick={handleDayClick}
            />
          </div>
        </div>

      {/* Main Content Section */}
      <div className={`flex ${isMobile ? "flex-col" : "flex-row"} h-full overflow-hidden`}>
        {/* Problem Status Section - Shown in mobile only when selectedTab is "problem" */}
        {!isMobile || selectedTab === "problem" ? (
          <div className="w-full md:w-4/5 flex flex-col h-full overflow-hidden">
            <div className="p-4 md:p-6">
              <Header username="Kiruthika..." onFilterClick={toggleFilter} />
            </div>
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-6 scrollbar-hide">
              <Calender
                days={days}
                dates={dates}
                timeSlots={timeSlots}
                events={events}
                selectedDay={selectedDay}
                onDayClick={handleDayClick}
              />
            </div>

          </div>

          <div className="md:hidden flex justify-between items-center p-4 border-t">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-2"
                  checked={filters.accepted}
                  onChange={() => handleFilterChange("accepted")}
                />
                <span className="text-sm">Accepted</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-2"
                  checked={filters.rejected}
                  onChange={() => handleFilterChange("rejected")}
                />
                <span className="text-sm">Rejected</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-2"
                  checked={filters.inprogress}
                  onChange={() => handleFilterChange("inprogress")}
                />
                <span className="text-sm">Inprogress</span>
              </label>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-1 border border-gray-300 rounded-md text-sm" onClick={handleClearFilters}>
                Clear
              </button>
              <button className="px-4 py-1 bg-orange-500 text-white rounded-md text-sm" onClick={handleApplyFilters}>
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFilter && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={toggleFilter}
        >
          <div
            className="bg-white w-full md:w-auto md:min-w-[400px] rounded-lg p-6 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded"
                  checked={filters.inprogress}
                  onChange={() => handleFilterChange("inprogress")}
                />
                <span className="text-sm">In Progress</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded"
                  checked={filters.rejected}
                  onChange={() => handleFilterChange("rejected")}
                />
                <span className="text-sm">Rejected</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded"
                  checked={filters.accepted}
                  onChange={() => handleFilterChange("accepted")}
                />
                <span className="text-sm">Accepted</span>
              </label>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="flex-1 py-2 border border-gray-300 rounded-md text-sm" onClick={handleClearFilters}>
                Clear
              </button>
              <button className="flex-1 py-2 bg-orange-500 text-white rounded-md text-sm" onClick={handleApplyFilters}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <LogCreation open={openLogCreation} onClick={() => setOpenLogCreation(false)} />
      <Rejected open={openRejected} onClick={() => setOpenRejected(false)} />
      <Accepted open={openAccepted} onClick={() => setOpenAccepted(false)} />
    </div>
  );
}

export default ProblemRaisorDashboard;
