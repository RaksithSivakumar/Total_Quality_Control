import { useState, useRef } from "react";
import { Search, Filter } from "lucide-react";
import Dialog from '@mui/material/Dialog';
import { IoSearchOutline } from "react-icons/io5"; // Import the correct icon
import ApprovalCard from "./ApprovalCard";
import Input from "../input/Input";

const ApprovalsPanel = ({ approvals }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState([]); // Allow multiple selections
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Control popup visibility
  const filterButtonRef = useRef(null); // Ref for the filter button

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

  const handleClear = () => {
    setSearchTerm("");
    setStatusFilter([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-medium">Approvals</h2>
          <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm">
            {approvals.length}
          </span>
        </div>
        <button
          ref={filterButtonRef} // Attach ref to the filter button
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors relative"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-4 w-4" />
          Filter By
        </button>
      </div>

      {/* 🔹 Filter Popup */}
      {isFilterOpen && (
        <div
          className="absolute bg-white shadow-lg rounded-lg p-6 w-64 z-50"
          style={{
            top: filterButtonRef.current
              ? filterButtonRef.current.offsetTop +
                filterButtonRef.current.offsetHeight +
                8
              : 0, // Position below the button
            left: filterButtonRef.current
              ? filterButtonRef.current.offsetcenter
              : 0, // Align with the button
          }}
        >
          <h3 className="text-lg font-semibold mb-4">Filter Approvals</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="accepted"
                className="w-4 h-4 rounded border-gray-300 text-[#FF7622] focus:ring-[#FF7622]"
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
                className="w-4 h-4 rounded border-gray-300 text-[#FF7622] focus:ring-[#FF7622]"
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
                className="w-4 h-4 rounded border-gray-300 text-[#FF7622] focus:ring-[#FF7622]"
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
              className="flex-1 py-2 bg-[#FF7622] text-white rounded-md text-sm hover:bg-[#FF5722] transition-colors"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Search Bar */}
      <div className="sticky top-0 bg-white z-10 p-4 flex items-center justify-between">
        <div className="flex-1 mr-4">
          <Input
            type="text"
            placeholder="Search any problem"
            icon={<IoSearchOutline className="text-gray-400" />} // Use the imported icon
            value={searchTerm}
            onChange={handleSearch}
            className="rounded-full pl-10 border-gray-300 focus:ring-2 focus:ring-[#FF7622]"
          />
        </div>
      </div>

      {/* 🔹 Approval List */}
      <div className="space-y-4">
        {filteredApprovals.length > 0 ? (
          filteredApprovals.map((approval) => (
            <ApprovalCard  key={approval.id} approval={approval} />
          ))
        ) : (
          <p className="text-gray-500">No approvals found</p>
        )}
      </div>
    </div>
  );
};

export default ApprovalsPanel;