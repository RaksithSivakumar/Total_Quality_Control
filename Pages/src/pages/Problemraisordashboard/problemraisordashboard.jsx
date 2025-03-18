import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Calender from "../../components/Calender/calender";
import ApprovalsPanel from "../../components/Approval/ApprovalsPanel";
import LogCreation from "../../components/Popups/LogCreation";
import Rejected from "../../components/Popups/Rejected";
import Accepted from "../../components/Popups/Accepted";
import { useNavigate, useLocation } from "react-router-dom";

function ProblemRaisorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTab, setSelectedTab] = useState("problem");
  const [selectedDay, setSelectedDay] = useState(3); // Wednesday selected by default
  const [showFilter, setShowFilter] = useState(false);
  const [openLogCreation, setOpenLogCreation] = useState(false);
  const [openRejected, setOpenRejected] = useState(false);
  const [openAccepted, setOpenAccepted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [filters, setFilters] = useState({
    inprogress: true,
    rejected: false,
    accepted: false,
  });
  const [problems, setProblems] = useState([]);

  // Handle popstate event for back button behavior
  useEffect(() => {
    const handlePopState = (event) => {
      if (openLogCreation || openRejected || openAccepted || showFilter) {
        event.preventDefault();
        closeAllPopups();
        window.history.pushState(null, document.title, location.pathname);
      }
    };

    window.addEventListener("popstate", handlePopState);

    if (openLogCreation || openRejected || openAccepted || showFilter) {
      window.history.pushState(null, document.title, location.pathname);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [openLogCreation, openRejected, openAccepted, showFilter, location]);

  // Handle screen resize
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

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const dates = ["21", "22", "23", "24", "25", "26", "27"];
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

  // Fetch problems from the API
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/master_problem");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        const data = result.data;

        if (Array.isArray(data)) {
          setProblems(data);
        } else {
          console.error("API response data is not an array:", data);
          setProblems([]);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
        setProblems([]);
      }
    };

    fetchProblems();
  }, []);

  // Map problems to approvals format based on the provided API structure
  const mappedApprovals = problems.map((problem) => ({
    id: problem.id,
    title: problem.problem_title,
    description: problem.Description,
    createdAt: new Date(problem.created_at).toLocaleDateString(),
    mediaUpload: problem.Media_Upload, // Store media uploads
    status: problem.status || "inprogress", // Use the actual status from the API
  }));

  const handleDayClick = (index) => {
    setSelectedDay(index);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleCardClick = (card) => {
    switch (card.status) {
      case "inprogress":
        setOpenLogCreation(true);
        break;
      case "rejected":
        setOpenRejected(true);
        break;
      case "accepted":
        setOpenAccepted(true);
        break;
      default:
        break;
    }
  };

  const handleCloseLogCreation = () => {
    setOpenLogCreation(false);
  };

  const handleCloseRejected = () => {
    setOpenRejected(false);
  };

  const handleCloseAccepted = () => {
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
  // If no specific filters are set, show all
  if (!filters.inprogress && !filters.rejected && !filters.accepted) {
    return true; // Display all approvals
  }
  // Apply specific filter logic
  return (
    (filters.inprogress && approval.status === "inprogress") ||
    (filters.rejected && approval.status === "rejected") ||
    (filters.accepted && approval.status === "accepted")
  );
});


  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Toggle Buttons - Visible only on small screens */}
      {isMobile && (
        <div className="flex justify-start p-4 space-x-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedTab === "problem" ? "bg-[#FF7622] text-white" : "bg-gray-100 text-gray-600"}`}
            onClick={() => setSelectedTab("problem")}
          >
            Problem status
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedTab === "resource" ? "bg-[#FF7622] text-white" : "bg-gray-100 text-gray-600"}`}
            onClick={() => setSelectedTab("resource")}
          >
            Resource status
          </button>
        </div>
      )}

      {/* Main Content Section */}
      <div className={`flex ${isMobile ? "flex-col" : "flex-row"} h-full overflow-hidden`}>
        {/* Problem Status Section */}
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
                events={mappedApprovals}
                selectedDay={selectedDay}
                onDayClick={handleDayClick}
              />
            </div>
          </div>
        ) : null}

        {/* Resource Status Section */}
        {!isMobile || selectedTab === "resource" ? (
          <div className="w-full md:w-2/5 bg-gray-50 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
              <ApprovalsPanel approvals={filteredApprovals} onCardClick={handleCardClick} />
            </div>
          </div>
        ) : null}
      </div>

      {/* Filter Popup for Desktop */}
      {showFilter && (
        <div className="relative inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={toggleFilter}>
          <div className="bg-white w-full md:w-auto md:min-w-[400px] rounded-lg p-6 z-50" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-3">
              {["inprogress", "rejected", "accepted"].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    checked={filters[status]}
                    onChange={() => handleFilterChange(status)}
                  />
                  <span className="text-sm capitalize">{status}</span>
                </label>
              ))}
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

      {/* Popups */}
      <LogCreation open={openLogCreation} onClose={handleCloseLogCreation} />
      <Rejected open={openRejected} onClose={handleCloseRejected} />
      <Accepted open={openAccepted} onClose={handleCloseAccepted} />
    </div>
  );
}


export default ProblemRaisorDashboard;
