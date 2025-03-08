import { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, Check, X } from "lucide-react";

const Rejected = ({ open, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for "Re-Alter" button

  // Check for mobile viewport on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleViewDetails = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSave = () => {
    if (!status && isExpanded) {
      alert("Please select a status.");
      return;
    }

    setIsLoading(true); // Show loading state
    setTimeout(() => {
      setIsLoading(false);
      alert("Re-Alter!");
    }, 1000); // Simulate async operation
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`bg-white rounded-lg ${
          isMobile ? "w-full h-full" : "max-w-3xl w-full max-h-[90vh]"
        } overflow-y-auto transition-all duration-300 ease-in-out`}
      >
        {/* Dialog Header */}
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="back"
            >
              <ArrowLeft
                className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-gray-700`}
              />
            </button>
            <h1
              className={`${
                isMobile ? "text-base" : "text-lg"
              } font-medium ml-3 text-gray-800`}
            >
              Log creation
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="close"
          >
            <X
              className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-gray-700`}
            />
          </button>
        </div>

        {/* Dialog Content */}
        <div className={`p-4 ${isMobile ? "space-y-4" : "space-y-6"}`}>
          {/* Reason for rejected */}
          <div className="space-y-3">
            <h2
              className={`${
                isMobile ? "text-base" : "text-lg"
              } font-medium text-red-500`}
            >
              Reason for rejected
            </h2>
            <p
              className={`${
                isMobile ? "text-sm" : "text-base"
              } text-gray-600 p-2 bg-gray-50 rounded-lg`}
            >
              Unintended escape of water from pipes, fixtures, or structures,
              leading to potential damage and waste in AS block.
            </p>

            {/* View Details Button */}
            <button
              onClick={handleViewDetails}
              className="w-full flex items-center justify-between p-3 mt-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-expanded={isExpanded}
            >
              <span
                className={`${
                  isMobile ? "text-sm" : "text-base"
                } text-gray-600 font-medium`}
              >
                View details
              </span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 p-1 m-2 ml-auto transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Full Form (Conditionally Rendered) */}
          {isExpanded && (
            <div className={`${isMobile ? "space-y-4" : "space-y-6"}`}>
              {/* Category */}
              <div>
                <h2
                  className={`${
                    isMobile ? "text-base" : "text-lg"
                  } font-medium text-gray-700 mb-2`}
                >
                  Category
                </h2>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "border border-orange-500 text-orange-500"
                  } ${
                    isMobile ? "text-sm py-1.5 px-3" : "text-base py-2 px-4"
                  } rounded hover:opacity-90 transition-all`}
                >
                  Productivity failure
                </button>
              </div>

              {/* Problem Title */}
              <div>
                <h2
                  className={`${
                    isMobile ? "text-base" : "text-lg"
                  } font-medium text-gray-700 mb-2`}
                >
                  Problem Title
                </h2>
                <p
                  className={`${
                    isMobile ? "text-sm" : "text-base"
                  } text-gray-600 p-2 bg-gray-50 rounded-lg`}
                >
                  Water leakage
                </p>
              </div>

              {/* Description */}
              <div>
                <h2
                  className={`${
                    isMobile ? "text-base" : "text-lg"
                  } font-medium text-gray-700 mb-2`}
                >
                  Description
                </h2>
                <p
                  className={`${
                    isMobile ? "text-sm" : "text-base"
                  } text-gray-600 p-2 bg-gray-50 rounded-lg`}
                >
                  Unintended escape of water from pipes, fixtures, or structures,
                  leading to potential damage and waste in AS block.
                </p>
              </div>

              {/* Media Upload */}
              <div>
                <h2
                  className={`${
                    isMobile ? "text-base" : "text-lg"
                  } font-medium text-gray-700 mb-2`}
                >
                  Media Upload
                </h2>
                <p
                  className={`${
                    isMobile ? "text-xs" : "text-sm"
                  } text-gray-500 mb-3`}
                >
                  Add your documents here, and you can upload up to 5 files max
                </p>
                <div
                  className={`${
                    isMobile ? "flex flex-col space-y-2" : "flex items-center justify-between"
                  } p-3 bg-gray-100 rounded-lg`}
                >
                  <span
                    className={`${
                      isMobile ? "text-sm" : "text-base"
                    } text-gray-600`}
                  >
                    phoenix-document.pdf
                  </span>
                  <div className="flex items-center">
                    <span
                      className={`${
                        isMobile ? "text-xs" : "text-sm"
                      } text-blue-500 mr-2`}
                    >
                      Upload complete
                    </span>
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div>
                <h2
                  className={`${
                    isMobile ? "text-base" : "text-lg"
                  } font-medium text-gray-700 mb-2`}
                >
                  Questions
                </h2>
              </div>

              {/* Additional Questions Section */}
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-1">
                    <p className={`${isMobile ? "text-xs" : "text-sm"}`}>
                      {num}. Have you solve this problem?
                    </p>
                    <input
                      type="text"
                      placeholder="Yes, i try to solve the problem"
                      className={`w-full p-3 bg-gray-100 rounded-md border-none outline-none ${
                        isMobile ? "text-sm" : "text-base"
                      }`}
                      aria-label={`Question ${num} answer`}
                    />
                  </div>
                ))}
              </div>

              {/* Remarks Section */}
              <div className="mt-4">
                <h2
                  className={`${
                    isMobile ? "text-sm" : "text-base"
                  } font-medium mb-2`}
                >
                  Remarks
                </h2>
                <textarea
                  placeholder="Your text goes here"
                  className={`w-full p-3 bg-gray-100 rounded-md border-none outline-none min-h-[100px] ${
                    isMobile ? "text-sm" : "text-base"
                  }`}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  aria-label="Remarks"
                />
              </div>

              {/* Buttons Section */}
              <div
                className={`${
                  isMobile ? "flex flex-col space-y-3" : "flex justify-end space-x-4"
                } mt-6`}
              >
                <button
                  onClick={onClose}
                  className={`${
                    isMobile ? "w-full" : ""
                  } px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 ${
                    isMobile ? "text-sm" : "text-base"
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`${
                    isMobile ? "w-full" : ""
                  } px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 ${
                    isMobile ? "text-sm" : "text-base"
                  } ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Processing..." : "Re-Alter"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rejected;