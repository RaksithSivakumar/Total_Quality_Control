import { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import Calender from "../../components/Calender/calender";
import { useNavigate, useLocation } from "react-router-dom";
import { Filter, PlusCircle, Clock } from "lucide-react";
import Input from "../../components/input/Input";
import { IoSearchOutline } from "react-icons/io5";
import LogCreation from "./InProgress";
import Rejected from "./Rejected";
import Accepted from "./Accepted";

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
  const [problems, setProblems] = useState([]);
  
  // Approval panel states integrated directly
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterButtonRef = useRef(null);
  const scrollableRef = useRef(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filters = {
    inprogress: statusFilter.includes("inprogress"),
    rejected: statusFilter.includes("rejected"),
    accepted: statusFilter.includes("accepted"),
  };

  const handleFilterChange = (status) => {
    // Toggle selection in statusFilter (array)
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleCreate = () => {
    console.log("Create event");
    navigate("/survey");
  };

  const handleClear = () => {
    setSearchTerm("");
    setStatusFilter([]);
  };

  // Status badge styling helper
  const getStatusStyles = (status) => {
    switch (status) {
      case "inprogress":
      case "Inprogress":
        return "bg-blue-100 text-blue-700";
      case "rejected":
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "accepted":
      case "Accepted":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
        const response = await fetch(
          "http://localhost:4000/api/master_problem"
        );
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
    date: new Date(problem.created_at).toLocaleDateString(),
    mediaUpload: problem.Media_Upload, // Store media uploads
    status: problem.status?.toLowerCase() || "inprogress", // Use the actual status from the API and normalize case
  }));

  const handleDayClick = (index) => {
    setSelectedDay(index);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleCardClick = (card) => {
    const normalizedStatus = card.status.toLowerCase();
    switch (normalizedStatus) {
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

  const handleClearFilters = () => {
    setStatusFilter([]);
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    toggleFilter();
  };

 // Updated search filter logic
const filteredApprovals = mappedApprovals.filter((approval) => {
  // Convert both the search term and strings to compare to lowercase for case-insensitive matching
  const searchLower = searchTerm.toLowerCase().trim();
  
  // Check if search term is empty - return all results when no search term
  if (!searchLower) {
    // Only apply status filter if there are any selected statuses
    return statusFilter.length === 0 || statusFilter.includes(approval.status.toLowerCase());
  }
  
  // Search in multiple fields - title, description, and date
  const matchesTitle = approval.title?.toLowerCase().includes(searchLower);
  const matchesDescription = approval.description?.toLowerCase().includes(searchLower);
  const matchesDate = approval.date?.toLowerCase().includes(searchLower);
  
  // Combined search results across multiple fields
  const matchesSearch = matchesTitle || matchesDescription || matchesDate;
  
  // Apply status filter if there are any selected statuses
  const matchesStatus = statusFilter.length === 0 || statusFilter.includes(approval.status.toLowerCase());
  
  // Return true only if both search and status filters are matched
  return matchesSearch && matchesStatus;
});

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Toggle Buttons - Visible only on small screens */}
      {isMobile && (
        <div className="flex justify-start p-4 space-x-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedTab === "problem"
                ? "bg-[#FF7622] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setSelectedTab("problem")}
          >
            Problem status
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedTab === "resource"
                ? "bg-[#FF7622] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setSelectedTab("resource")}
          >
            Resource status
          </button>
        </div>
      )}

      {/* Main Content Section */}
      <div
        className={`flex ${
          isMobile ? "flex-col" : "flex-row"
        } h-full overflow-hidden`}
      >
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
          <div className="w-full md:w-2/5 bg-gray-50 flex flex-col h-full">
            <div className="flex-1 p-4 md:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold">Approvals</h2>
                  <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm">
                    {mappedApprovals.length}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    ref={filterButtonRef}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors relative"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                  <button
                    className="flex items-center text-orange-500 text-sm font-medium px-3 py-2 border border-orange-200 rounded-md hover:bg-orange-50 transition-colors"
                    onClick={handleCreate}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create New
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="sticky top-0 bg-white z-40 mb-4">
                <Input
                  type="text"
                  placeholder="Search any problems"
                  icon={<IoSearchOutline className="text-gray-400" />}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="rounded-full pl-10 border-gray-300 focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              {/* Filter Popup */}
              {isFilterOpen && (
                <div
                  className="absolute bg-white shadow-lg rounded-lg p-6 w-64 z-50"
                  style={{
                    top: filterButtonRef.current
                      ? filterButtonRef.current.offsetTop +
                        filterButtonRef.current.offsetHeight +
                        8
                      : 0,
                    right: filterButtonRef.current ? 20 : 0,
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4">Filter Approvals</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="accepted"
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        checked={statusFilter.includes("accepted")}
                        onChange={() => handleFilterChange("accepted")}
                      />
                      <label htmlFor="accepted" className="ml-2 text-sm">
                        Accepted
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rejected"
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        checked={statusFilter.includes("rejected")}
                        onChange={() => handleFilterChange("rejected")}
                      />
                      <label htmlFor="rejected" className="ml-2 text-sm">
                        Rejected
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="inprogress"
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        checked={statusFilter.includes("inprogress")}
                        onChange={() => handleFilterChange("inprogress")}
                      />
                      <label htmlFor="inprogress" className="ml-2 text-sm">
                        In Progress
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      className="flex-1 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                      onClick={handleClear}
                    >
                      Clear
                    </button>
                    <button
                      className="flex-1 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {/* Approval List */}
              <div 
                ref={scrollableRef}
                id="scrollable-container"
                className="space-y-3 pb-4 overflow-y-auto"
                style={{
                  overflow: "auto",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                  maxHeight: "calc(100vh - 220px)"
                }}
              >
                <style>
                  {`
                    #scrollable-container::-webkit-scrollbar {
                      display: none;
                    }
                  `}
                </style>
                
                {filteredApprovals.length > 0 ? (
                  filteredApprovals.map((approval) => (
                    <div
                      key={approval.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleCardClick(approval)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{approval.title}</h3>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${getStatusStyles(
                            approval.status
                          )}`}
                        >
                          {approval.status === "inprogress"
                            ? "In Progress"
                            : approval.status.charAt(0).toUpperCase() +
                              approval.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {approval.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {approval.date}
                        </div>
                        {/* Show points badge for accepted items */}
                        {approval.status === "accepted" && (
                          <div className="flex items-center text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            +150 points
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No approvals found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Bottom Filter Bar */}
            {isMobile && (
              <div className="md:hidden flex justify-between items-center p-4 border-t">
                <div className="flex space-x-4">
                  {["accepted", "rejected", "inprogress"].map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 mr-2"
                        checked={statusFilter.includes(status)}
                        onChange={() => handleFilterChange(status)}
                      />
                      <span className="text-sm capitalize">{status}</span>
                    </label>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-1 border border-gray-300 rounded-md text-sm"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    className="px-4 py-1 bg-orange-500 text-white rounded-md text-sm"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

         {/* Filter Popup for Desktop */}
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
              {["Accepted", "Rejected", "Inprogress"].map((status) => (
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
              <button
                className="flex-1 py-2 border border-gray-300 rounded-md text-sm"
                onClick={handleClearFilters}
              >
                Clear
              </button>
              <button
                className="flex-1 py-2 bg-orange-500 text-white rounded-md text-sm"
                onClick={handleApplyFilters}
              >
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