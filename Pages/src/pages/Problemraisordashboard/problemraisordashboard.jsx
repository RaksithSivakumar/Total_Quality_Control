import { useState } from "react";
import Header from "../../components/Header/Header";
import Calender from "../../components/Calender/calender";
import ApprovalsPanel from "../../components/Approval/ApprovalsPanel";
import { useNavigate } from "react-router-dom";

function ProblemRaisorDashboard() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(3); // Wednesday (index 3) selected by default
  const [showFilter, setShowFilter] = useState(false); // State for filter popup visibility
  const [filters, setFilters] = useState({
    inprogress: false,
    rejected: false,
    accepted: false,
  }); // State for selected filters

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

  const approvals = [
    {
      id: 1,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "inprogress",
    },
    {
      id: 2,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "rejected",
    },
    {
      id: 3,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "accepted",
    },
    {
      id: 4,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "inprogress",
    },
    {
      id: 5,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "accepted",
    },
    {
      id: 1,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "inprogress",
    },
    {
      id: 2,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "rejected",
    },
    {
      id: 3,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "accepted",
    },
    {
      id: 4,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "inprogress",
    },
    {
      id: 5,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "accepted",
    },
  ];

  const handleDayClick = (index) => {
    setSelectedDay(index);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
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
    // Apply filters logic here
    toggleFilter();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-y-auto p-4 space-y-4 scrollbar-hide">
      {/* Header and Calendar Section */}
      <div className="w-full md:w-4/5 p-6 overflow-y-auto scrollbar-hide">
        <Header username="Kiruthika..." onFilterClick={toggleFilter} />
        <Calender
          days={days}
          dates={dates}
          timeSlots={timeSlots}
          events={events}
          selectedDay={selectedDay}
          onDayClick={handleDayClick}
        />
      </div>

      {/* Approvals Panel Section */}
      <div className="w-full md:w-2/5 bg-gray-50 p-6 overflow-y-auto scrollbar-hide">
        <ApprovalsPanel approvals={approvals} />
      </div>

      {/* Filter Popup */}
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
    </div>
  );
}

export default ProblemRaisorDashboard;