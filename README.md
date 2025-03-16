# Total_Quality_Control
 Student and Maintanence team dashboard

import { useState } from "react"
import Header from "../../components/Header/Header"
import Calender from "../../components/Calender/calender"
import ApprovalsPanel from "../../components/Approval/ApprovalsPanel"
import LogCreation from "../../components/Popups/LogCreation";
import Rejected from "../../components/Popups/Rejected";
import Accepted from "../../components/Popups/Accepted";
import { useNavigate } from "react-router-dom"


function ProblemRaisorDashboard() {
  const navigate = useNavigate()
  const [selectedDay, setSelectedDay] = useState(3) // Wednesday (index 3) selected by default
  const [showFilter, setShowFilter] = useState(false) // State for filter popup visibility // State for filter popup visibility
  
  // Added state variables for popups
  const [openLogCreation, setOpenLogCreation] = useState(false)
  const [openRejected, setOpenRejected] = useState(false)
  const [openAccepted, setOpenAccepted] = useState(false)

  const [filters, setFilters] = useState({
    inprogress: true,
    rejected: false,
    accepted: false,
  }) // State for selected filters

  const days = ["S", "M", "T", "W", "T", "F", "S"]
  const dates = ["21", "22", "23", "24", "25", "26", "27"]
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
  ]

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
  ]

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
      id: 6,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "inprogress",
    },
    {
      id: 7,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "rejected",
    },
    {
      id: 8,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "accepted",
    },
    {
      id: 9,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "inprogress",
    },
    {
      id: 10,
      title: "Productivity failure",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed..",
      date: "10/07/2025",
      status: "accepted",
    },
  ]

  const handleDayClick = (index) => {
    setSelectedDay(index)
  }

  const toggleFilter = () => {
    setShowFilter(!showFilter)
  }

  // Fixed handleCardClick to match the status strings in your data
  const handleCardClick = (card) => {
    console.log("Card clicked:", card); // Debugging
    if (card.status === "inprogress") {
      console.log("Opening LogCreation popup"); // Debugging
      setOpenLogCreation(true); // Open LogCreation popup
    } else if (card.status === "rejected") {
      console.log("Opening Rejected popup"); // Debugging
      setOpenRejected(true); // Open Rejected popup
    } else if (card.status === "accepted") {
      console.log("Opening Accepted popup"); // Debugging
      setOpenAccepted(true); // Open Accepted popup
    }
  };

  const handleFilterChange = (filter) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: !prevFilters[filter],
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      inprogress: false,
      rejected: false,
      accepted: false,
    })
  }

  const handleApplyFilters = () => {
    // Apply filters logic here
    toggleFilter()
  }

  // Function to filter approvals based on selected filters
  const filteredApprovals = approvals.filter(approval => {
    if (!filters.inprogress && !filters.rejected && !filters.accepted) {
      return true; // If no filters selected, show all
    }
    return (
      (filters.inprogress && approval.status === "inprogress") ||
      (filters.rejected && approval.status === "rejected") ||
      (filters.accepted && approval.status === "accepted")
    );
  });

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Mobile and Desktop Layout Container */}
      <div className="flex flex-col md:flex-row h-full overflow-hidden">
        {/* Header and Calendar Section */}
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

        {/* Approvals Panel Section */}
        <div className="w-full md:w-2/5 bg-gray-50 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
            <ApprovalsPanel approvals={filteredApprovals} onCardClick={handleCardClick} />
          </div>

          {/* Mobile Bottom Filter Bar */}
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

      {/* Filter Popup (Desktop only) */}
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

      {/* Popup Components - Fixed onClose for LogCreation */}
      <LogCreation open={openLogCreation} onClick={() => setOpenLogCreation(false)} />
      <Rejected open={openRejected} onClick={() => setOpenRejected(false)} />
      <Accepted open={openAccepted} onClick={() => setOpenAccepted(false)} />
    </div>  
  )
}

export default ProblemRaisorDashboard;