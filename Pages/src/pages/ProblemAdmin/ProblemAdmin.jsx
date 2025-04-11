import * as React from "react";
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
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ProblemAdmin() {
  const [showFilter, setShowFilter] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [problems, setProblems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [openProblemDetails, setOpenProblemDetails] = React.useState(false);
  const [selectedProblem, setSelectedProblem] = React.useState(null);

  React.useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/api/master_problem");
        
        // Filter problems to only include those with pr_status = "Accepted"
        let problemsData = [];
        if (Array.isArray(response.data)) {
          problemsData = response.data.filter(problem => problem.pr_status === "Accepted");
        } else if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data.data)) {
            problemsData = response.data.data.filter(problem => problem.pr_status === "Accepted");
          } else if (response.data.problems && Array.isArray(response.data.problems)) {
            problemsData = response.data.problems.filter(problem => problem.pr_status === "Accepted");
          } else if (response.data.pr_status === "Accepted") {
            problemsData = [response.data];
          }
        }
        
        setProblems(problemsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching problems:", err);
        setError("Failed to fetch problems");
        setLoading(false);
      }
    };
    
    fetchProblems();
  }, []);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const mapStatus = (apiStatus, prStatus) => {
    if (prStatus === "Accepted") return "New";
    if (apiStatus === "Rejected") return "Rejected";
    if (apiStatus === "Accepted") return "Accepted";
    return "Need to verify";
  };

  const handleCardClick = (problem) => {
    setSelectedProblem(problem);
    const uiStatus = mapStatus(problem.status, problem.pr_status);
    setOpenProblemDetails(true);
  };

  const transformedCards = Array.isArray(problems)
    ? problems.map(problem => ({
        id: problem.id,
        title: problem.problem_title,
        status: mapStatus(problem.status, problem.pr_status),
        description: problem.Description || "No description available",
        date: new Date(problem.deadline).toLocaleDateString(),
        author: problem.created_by,
        imageUrl: "https://bitlinks.bitsathy.ac.in/static/media/user.900505a2e95287f7e05c.jpg",
        originalData: problem
      }))
    : [];

  const filteredCards = transformedCards.filter((card) => {
    const matchesTab = activeTab === "All" || card.status === activeTab;
    const matchesSearch =
      card.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleFilterChange = (tab) => {
    setActiveTab(tab);
  };

  const handleClearFilters = () => {
    setActiveTab("All");
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading problems...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
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

      {/* Header Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium text-gray-600">Welcome .</h1>
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

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-16">
        {/* Grid of Cards */}
        <div className="grid grid-cols-1 rounded-2xl p-0 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <div key={card.id || Math.random().toString()}>
                <Card
                  title={card.title || "Untitled"}
                  status={card.status || "Unknown"}
                  description={card.description || "No description"}
                  date={card.date || "No date"}
                  author={card.author || "Unknown"}
                  imageUrl={card.imageUrl || ""}
                  onClick={() => handleCardClick(card.originalData)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              No problems match your current filters
            </div>
          )}
        </div>
      </div>

      {/* Filter Popup (Material-UI Dialog) */}
      <Dialog
        onClose={toggleFilter}
        open={showFilter}
        keepMounted
        TransitionComponent={Transition}
        aria-describedby="filter-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Filter Approvals</DialogTitle>
        <DialogContent dividers>
          <List sx={{ pt: 0 }}>
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
          <div className="flex gap-4 p-4 w-full">
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

      {/* Problem Details Popup */}
      <Dialog
        onClose={() => setOpenProblemDetails(false)}
        open={openProblemDetails}
        keepMounted
        TransitionComponent={Transition}
        aria-describedby="problem-details-description"
        maxWidth="sm"
        fullWidth
      >
        {selectedProblem && (
          <>
            <DialogTitle>{selectedProblem.problem_title}</DialogTitle>
            <DialogContent dividers>
              <p>Description:{selectedProblem.Description}</p>
              <p>Severity: {selectedProblem.severity || 'Not specified'}</p>
              {/* <p>Created By: {selectedProblem.created_by}</p> */}
              <p> Deadline: {new Date(selectedProblem.deadline).toLocaleString()}</p>
              {/* <p>Status: {mapStatus(selectedProblem.status, selectedProblem.pr_status)}</p> */}
              {selectedProblem.Media_Upload && selectedProblem.Media_Upload.length > 0 && (
                <div className="mt-4">
                  <p>Attached Media:</p>
                  {selectedProblem.Media_Upload.map((mediaUrl, index) => (
                    <img 
                      key={index} 
                      src={mediaUrl} 
                      alt={`Media ${index + 1}`} 
                      className="max-w-full h-auto mt-2"
                    />
                  ))}
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => setOpenProblemDetails(false)}
                sx={{
                  backgroundColor: "#FF7622",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#FF5722",
                  },
                }}
              >
                Close

              </Button>
              <Button
                variant="contained"
                onClick={() => setOpenProblemDetails(false)}
                sx={{
                  backgroundColor: "#FF7622",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#FF5722",
                  },
                }}
              >
                Request

              </Button>
               
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}

export default ProblemAdmin;
