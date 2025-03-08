import * as React from "react";
import { Search, Filter } from "lucide-react";
import Card from "../../components/problem/Card"; // Import the Card component
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
import Slide from "@mui/material/Slide"; // Import Slide for the transition
import LogCreation from "../../components/Popups/LogCreation";
import Rejected from "../../components/Popups/Rejected";
import Accepted from "../../components/Popups/Accepted";

// Define the Transition component for the Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Problemsolver() {
  const [showFilter, setShowFilter] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("All"); // State for active tab
  const [searchQuery, setSearchQuery] = React.useState(""); // State for search query
  // Added state variables for popups
  const [openLogCreation, setOpenLogCreation] = React.useState(false);
  const [openRejected, setOpenRejected] = React.useState(false);
  const [openAccepted, setOpenAccepted] = React.useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };
  const handleCardClick = (card) => {
    console.log("Card clicked:", card); // Debugging
    if (card.status === "New") {
      console.log("Opening LogCreation popup"); // Debugging
      setOpenLogCreation(true); // Open LogCreation popup
    } else if (card.status === "Rejected") {
      console.log("Opening Rejected popup"); // Debugging
      setOpenRejected(true); // Open Rejected popup
    } else if (card.status === "Accepted") {
      console.log("Opening Accepted popup"); // Debugging
      setOpenAccepted(true); // Open Accepted popup
    }
  };

  // Example data for cards
  const cardsData = [
    {
      title: "Productivity failure",
      status: "Need to verify",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image1.png",
    },
    {
      title: "Productivity failure",
      status: "Rejected",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image2.png",
    },
    {
      title: "Productivity failure",
      status: "Accepted",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image3.png",
    },
    {
      title: "Productivity failure",
      status: "New",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image4.png",
    },
    {
      title: "Productivity failure",
      status: "Need to verify",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image1.png",
    },
    {
      title: "Productivity failure",
      status: "Rejected",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image2.png",
    },
    {
      title: "Productivity failure",
      status: "Accepted",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image3.png",
    },
    {
      title: "Productivity failure",
      status: "New",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image4.png",
    },
    {
      title: "Productivity failure",
      status: "Need to verify",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image1.png",
    },
    {
      title: "Productivity failure",
      status: "Rejected",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image2.png",
    },
    {
      title: "Productivity failure",
      status: "Accepted",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image3.png",
    },
    {
      title: "Productivity failure",
      status: "New",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image4.png",
    },
    {
      title: "Productivity failure",
      status: "Need to verify",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image1.png",
    },
    {
      title: "Productivity failure",
      status: "Rejected",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image2.png",
    },
    {
      title: "Productivity failure",
      status: "Accepted",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image3.png",
    },
    {
      title: "Productivity failure",
      status: "New",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image4.png",
    },
    {
      title: "Productivity failure",
      status: "Need to verify",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image1.png",
    },
    {
      title: "Productivity failure",
      status: "Rejected",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image2.png",
    },
    {
      title: "Total",
      status: "Accepted",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image3.png",
    },
    {
      title: "Productivity failure",
      status: "New",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image4.png",
    },
    {
      title: "Total",
      status: "Need to verify",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image1.png",
    },
    {
      title: "Productivity failure",
      status: "Rejected",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image2.png",
    },
    {
      title: "Total",
      status: "Accepted",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image3.png",
    },
    {
      title: "Productivity failure",
      status: "New",
      description:
        "Productive failure is a learning design where individuals are allowed to fail in a managed...",
      date: "10/07/2025",
      author: "J. David",
      imageUrl: "https://example.com/image4.png",
    },
    // Add more cards as needed
  ];

  // Filter cards based on active tab and search query
  const filteredCards = cardsData.filter((card) => {
    const matchesTab = activeTab === "All" || card.status === activeTab;
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleFilterChange = (tab) => {
    setActiveTab(tab);
  };

  const handleClearFilters = () => {
    setActiveTab("All");
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Main Content */}
      <div className="flex-1 p-4 h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium text-gray-600">Welcome Admin.</h1>
          <Button
            variant="outlined"
            startIcon={<Filter size={14} />}
            onClick={toggleFilter}
            className="hidden md:flex"
            sx={{
              borderColor: "black", // Black outline
              color: "black", // Black text
              "&:hover": {
                borderColor: "black", // Black outline on hover
                backgroundColor: "rgba(0, 0, 0, 0.04)", // Light background on hover
              },
            }}
          >
            Filter BY
          </Button>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 rounded-2xl p-4 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card, index) => (
            <div key={index}>
              <Card
                title={card.title}
                status={card.status}
                description={card.description}
                date={card.date}
                author={card.author}
                imageUrl={card.imageUrl}
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
        TransitionComponent={Transition} // Add slide transition
        keepMounted // Keep the dialog mounted in the DOM
        aria-describedby="filter-dialog-description" // Improve accessibility
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
                borderColor: "black", // Black outline
                color: "black", // Black text
                "&:hover": {
                  borderColor: "black", // Black outline on hover
                  backgroundColor: "rgba(0, 0, 0, 0.04)", // Light background on hover
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
                backgroundColor: "#FF7622", // Orange background
                color: "white", // White text
                "&:hover": {
                  backgroundColor: "#FF5722", // Darker orange on hover
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
    </div>
  );
}

export default Problemsolver;