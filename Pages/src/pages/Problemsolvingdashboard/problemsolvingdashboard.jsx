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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterButtonRef = useRef(null);
  const filterPopupRef = useRef(null);
  const scrollableRef = useRef(null);

  // Handle click outside filter popup
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isFilterOpen &&
        filterPopupRef.current &&
        !filterPopupRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  // Calculate filter position
  const [filterPosition, setFilterPosition] = useState({ top: 0, right: 0 });
  
  useEffect(() => {
    if (isFilterOpen && filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      setFilterPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right - window.scrollX
      });
    }
  }, [isFilterOpen]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status) => {
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

  const getStatusStyles = (status) => {
    switch (status) {
      case "Inprogress":
        return "bg-blue-100 text-blue-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
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
      if (isFilterOpen && filterButtonRef.current) {
        const rect = filterButtonRef.current.getBoundingClientRect();
        setFilterPosition({
          top: rect.bottom + window.scrollY + 8,
          right: window.innerWidth - rect.right - window.scrollX
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isFilterOpen]);

  const closeAllPopups = () => {
    setOpenLogCreation(false);
    setOpenRejected(false);
    setOpenAccepted(false);
    setShowFilter(false);
    setIsFilterOpen(false);
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
    title: problem.problem_title || "No Title",
    description: problem.Description || "No Description",
    createdAt: problem.created_at
      ? new Date(problem.created_at).toLocaleDateString()
      : "Unknown Date",
    mediaUpload: problem.Media_Upload || null,
    status: problem.status || "Inprogress",
  }));

  const handleDayClick = (index) => {
    setSelectedDay(index);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleCardClick = (card) => {
    switch (card.status) {
      case "Inprogress":
        setOpenLogCreation(true);
        break;
      case "Rejected":
        setOpenRejected(true);
        break;
      case "Accepted":
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
    toggleFilter();
  };

  const filteredApprovals = mappedApprovals.filter((approval) => {
    const matchesSearch = approval.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(approval.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-screen bg-white">
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
      <div className={`flex ${isMobile ? "flex-col" : "flex-row"} h-full`}>
        {/* Problem Status Section */}
        {!isMobile || selectedTab === "problem" ? (
          <div className="w-full md:w-4/5 flex flex-col h-full">
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
              <div className="flex flex-col mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h2 className="text-lg font-semibold">Approvals</h2>
                    <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm">
                      {mappedApprovals.length}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <button
                        ref={filterButtonRef}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                      >
                        <Filter className="h-4 w-4" />
                        Filter
                      </button>
                    </div>
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
                <div className="bg-white mb-4">
                  <Input
                    type="text"
                    placeholder="Search any problem"
                    icon={<IoSearchOutline className="text-gray-400" />}
                    value={searchTerm}
                    onChange={handleSearch}
                    className="rounded-full pl-10 border-gray-300 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Approval List */}
              <div
                ref={scrollableRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{
                  overflow: "auto",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                  maxHeight: "70vh",
                }}
              >
                <style>
                  {`#scrollable-container::-webkit-scrollbar { display: none; }`}
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
                          {approval.status === "Inprogress"
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
                          {approval.createdAt}
                        </div>
                        {approval.status === "Accepted" && (
                          <div className="flex items-center text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full">
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
                    onClick={handleClearFilters}
                  >
                    Clear
                  </button>
                  <button
                    className="px-4 py-1 bg-orange-500 text-white rounded-md text-sm"
                    onClick={handleApplyFilters}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Filter Popup for Inline Filter */}
      {isFilterOpen && (
        <div
          className="fixed shadow-lg rounded-lg bg-white p-6 w-64 z-50"
          ref={filterPopupRef}
          style={{
            top: filterPosition.top,
            right: filterPosition.right,
          }}
        >
          <h3 className="text-lg font-semibold mb-4">Filter Approvals</h3>
          <div className="space-y-3">
            {["accepted", "rejected", "inprogress"].map((status) => (
              <div key={status} className="flex items-center">
                <input
                  type="checkbox"
                  id={status}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  checked={statusFilter.includes(status)}
                  onChange={() => handleFilterChange(status)}
                />
                <label htmlFor={status} className="ml-2 text-sm">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </label>
              </div>
            ))}
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

      {/* Filter Popup for Desktop */}
      {showFilter && (
        <div
          className="inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={toggleFilter}
        >
          <div
            className="bg-white w-full md:w-auto md:min-w-[400px] rounded-lg p-6 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-3">
              {["accepted", "rejected", "inprogress"].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    checked={statusFilter.includes(status)}
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
