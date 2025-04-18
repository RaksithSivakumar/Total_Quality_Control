import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import Card from "../../components/problem/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Slide from "@mui/material/Slide";
import LogCreation from "./LogCreation";
import Rejected from "./Rejected";
import Accepted from "./Accepted";
import Solver from "./Solver";
import CryptoJS from "crypto-js";

const secretKey = "qwertyuiopasdfghjklzxcvbnm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Problemsolver() {
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cardsData, setCardsData] = useState([]);
  const [openLogCreation, setOpenLogCreation] = useState(false);
  const [openRejected, setOpenRejected] = useState(false);
  const [openAccepted, setOpenAccepted] = useState(false);
  const [openSolver, setOpenSolver] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [userName, setUserName] = useState("");
  const [tempStatus, setTempStatus] = useState("");
  const [tempRemarks, setTempRemarks] = useState("");
 
  const defaultImageUrl =
    "https://bitlinks.bitsathy.ac.in/static/media/user.900505a2e95287f7e05c.jpg";

  // Get user name from encrypted localStorage
  useEffect(() => {
    const encryptedUser = localStorage.getItem("user");
    if (encryptedUser) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedUser, secretKey);
        const user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUserName(user?.name || "User"); // Default to "User" if name is not found
      } catch (error) {
        console.error("Error decrypting user data:", error);
      }
    }
  }, []);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleCardClick = (card) => {
    console.log("Card clicked:", card);
    setSelectedCard(card); // Store the entire card data
   
    switch (card.status) {
      case "Need to verify":
        setOpenLogCreation(true);
        break;
      case "New":
        setOpenSolver(true);
        break;
      case "Rejected":
        setOpenRejected(true);
        break;
      case "Accepted":
        setOpenAccepted(true);
        break;
      default:
        console.warn("Unknown card status:", card.status);
    }
  };

  // Debug: Track selectedCard updates
  useEffect(() => {
    console.log("Updated selectedCard:", selectedCard);
  }, [selectedCard]);

  const handleSave = async () => {
    try {
      // Store the current status and remarks into temporary state variables
      setTempStatus(status);
      setTempRemarks(remarks);

      // Prepare data to send to the server
      const data = {
        Category: problem ? problem.Category : "Default Category",
        problem_title: problemTitle,
        status: status || null, // Ensure it's null-safe
        remarks: remarks || "", // Ensure it's always a string
      };

      // Fetch existing problems to check if the problem_title exists
      const response = await fetch("http://localhost:4000/api/master_problem");
      if (!response.ok) throw new Error("Network response was not ok");

      const responseData = await response.json();
      const problems = responseData.data;

      // Check if the problem already exists
      const matchedProblem = problems.find(
        (item) =>
          item.problem_title &&
          item.problem_title.toLowerCase() === problemTitle.toLowerCase()
      );

      let saveResponse;
      if (matchedProblem) {
        // If the problem exists, update it
        const updatedData = {
          ...matchedProblem, // Keep existing data
          status: status, // Update status
          remarks: remarks, // Update remarks
        };

        saveResponse = await fetch(
          `http://localhost:4000/api/master_problem/${matchedProblem.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          }
        );
      } else {
        // If the problem doesn't exist, create a new one
        const newProblemData = {
          Category: problem ? problem.Category : "Default Category",
          problem_title: problemTitle,
          Description: "Description for new problem",
          Media_Upload: "",
          Questions_1: "Default question 1",
          Questions_2: "Default question 2",
          Questions_3: "Default question 3",
          Questions_4: "Default question 4",
          Questions_5: "Default question 5",
          created_at: new Date().toISOString(),
          created_by: "YourUser", // Replace with actual user
          status: status || null,
          remarks: remarks || "",
        };

        saveResponse = await fetch("http://localhost:4000/api/master_problem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProblemData),
        });
      }

      const saveData = await saveResponse.json();
      if (saveResponse.ok) {
        toast.success(saveData.message);
        onClose(); // Close modal
      } else {
        throw new Error("Error saving data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data.");
    }
  };

  // Fetch card data from the API
  useEffect(() => {
    const fetchCardsData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/master_problem"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Debug: Log the data to inspect its structure
        console.log("API Response Data:", data);

        if (Array.isArray(data.data)) {
          const modifiedData = data.data
            .filter((item) => item.status === "Accepted")
            .map((item) => ({
              ...item,
              status: "New", // Change status to "New" for display
            }));
          setCardsData(modifiedData);
        } else {
          console.error("Data.data is not an array:", data.data);
          setCardsData([]); // Set to empty array to avoid further errors
        }
      } catch (error) {
        console.error("Failed to fetch cards data:", error);
        setCardsData([]); // Ensure state is set to empty array on error
      }
    };

    fetchCardsData();
  }, []);

  // Filter cards based on active tab and search query
  const filteredCards = React.useMemo(() => {
    return cardsData.filter((card) => {
      const matchesTab = activeTab === "All" || card.status === activeTab;
      const matchesSearch =
        card.problem_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.Description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.created_by?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [cardsData, activeTab, searchQuery]);

  const handleFilterChange = (tab) => {
    setActiveTab(tab);
  };

  const handleClearFilters = () => {
    setActiveTab("All");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Sidebar - Mobile Search */}
      <div className="p-4 md:hidden">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search for log"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-100 rounded-md py-2 pl-10 pr-4 text-sm w-full focus:outline-none"
          />
        </div>
      </div>

      {/* Fixed Header */}
      <div className="sticky top-0 bg-gray-50 z-10">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-medium text-gray-600">
            Welcome {userName}.
          </h1>
          <Button
            variant="outlined"
            startIcon={<Filter size={14} />}
            onClick={toggleFilter}
            className="hidden md:flex"
            sx={{
              borderColor: "black",
              color: "black",
              "&:hover": {
                borderColor: "black",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Filter BY
          </Button>
        </div>
      </div>

      {/* Scrollable Cards Section Only */}
      <div className="flex-1 p-4 overflow-hidden">
        <div
          className="grid grid-cols-1 rounded-2xl p-2 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto scrollbar-hide"
          style={{ height: "calc(100vh - 150px)" }}
        >
          {filteredCards.map((card, index) => (
            <div key={index}>
              <Card
                title={card.problem_title || "No Title"}
                status={card.status || "Unknown"}
                description={card.Description || "No Description"}
                date={card.created_at || "Unknown Date"}
                author={card.created_by || "Unknown Author"}
                imageUrl={defaultImageUrl}
                onClick={() => handleCardClick(card)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Filter Popup (Material-UI Dialog) */}
      <Dialog
        onClose={toggleFilter}
        open={showFilter}
        keepMounted
        aria-describedby="filter-dialog-description"
      >
        <DialogTitle>Filter Approvals</DialogTitle>
        <DialogContent>
          <List>
            {[
              { label: "All", value: "All" },
              { label: "Need to verify", value: "Need to verify" },
              { label: "Rejected", value: "Rejected" },
              { label: "Accepted", value: "Accepted" },
              { label: "New", value: "New" },
            ].map((filter) => (
              <ListItem key={filter.value} disablePadding>
                <ListItemButton
                  onClick={() => handleFilterChange(filter.value)}
                  selected={activeTab === filter.value}
                >
                  <Checkbox
                    edge="start"
                    checked={activeTab === filter.value}
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

      <LogCreation
        open={openLogCreation}
        onClose={() => setOpenLogCreation(false)}
      />
      <Rejected open={openRejected} onClose={() => setOpenRejected(false)} />
      <Accepted open={openAccepted} onClose={() => setOpenAccepted(false)} />
      <Solver
        open={openSolver}
        onClose={() => setOpenSolver(false)}
        cardData={selectedCard} // Pass selected card as prop
      />
    </div>
  );
}

export default Problemsolver;
