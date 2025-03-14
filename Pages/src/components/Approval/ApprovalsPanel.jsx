import { useState, useRef } from "react";
import { Filter, PlusCircle, Clock } from "lucide-react";
import { IoSearchOutline } from "react-icons/io5";
import Input from "../input/Input";
import { useNavigate } from "react-router-dom";

const ApprovalsPanel = ({ approvals, onCardClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState([]); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterButtonRef = useRef(null);
  const navigate = useNavigate();


  const filteredApprovals = approvals.filter((approval) => {
    const matchesSearch = approval.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(approval.status);
    return matchesSearch && matchesStatus;
  });

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

  // Status badge styling helper
  const getStatusStyles = (status) => {
    switch(status) {
      case "inprogress":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">Approvals</h2>
          <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm">
            {approvals.length}
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
          <button className="flex items-center text-orange-500 text-sm font-medium px-3 py-2 border border-orange-200 rounded-md hover:bg-orange-50 transition-colors" onClick={handleCreate}>
            <PlusCircle className="h-4 w-4 mr-1" />
            Add New
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="sticky top-0 bg-white z-10 mb-4">
        <Input
          type="text"
          placeholder="Search any problem"
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
            right: filterButtonRef.current
              ? 20
              : 0,
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
      <div className="space-y-3 pb-4">
        {filteredApprovals.length > 0 ? (
          filteredApprovals.map((approval) => (
            <div 
              key={approval.id} 
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onCardClick(approval)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{approval.title}</h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${getStatusStyles(approval.status)}`}
                >
                  {approval.status === "inprogress"
                    ? "In Progress"
                    : approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{approval.description}</p>
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
  );
};

export default ApprovalsPanel;