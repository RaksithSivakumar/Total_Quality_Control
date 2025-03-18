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
import LogCreation from "../../components/Popups/LogCreation";
import Rejected from "../../components/Popups/Rejected";
import Accepted from "../../components/Popups/Accepted";
import Solver from "../../components/Popups/Solver";


const Transition = React.forwardRef(function Transition(props, ref) {
 return <Slide direction="up" ref={ref} {...props} />;
});


function Problemsolver() {
 const [showFilter, setShowFilter] = React.useState(false);
 const [activeTab, setActiveTab] = React.useState("All");
 const [searchQuery, setSearchQuery] = React.useState("");
 const [cardsData, setCardsData] = React.useState([]);
 const [openLogCreation, setOpenLogCreation] = React.useState(false);
 const [openRejected, setOpenRejected] = React.useState(false);
 const [openAccepted, setOpenAccepted] = React.useState(false);
 const [openSolver, setOpenSolver] = React.useState(false);
 const defaultImageUrl = "https://bitlinks.bitsathy.ac.in/static/media/user.900505a2e95287f7e05c.jpg";


 const toggleFilter = () => {
 setShowFilter(!showFilter);
 };


 const handleCardClick = (card) => {
 console.log("Card clicked:", card);
 if (card.status === "Need to verify") {
 console.log("Opening LogCreation popup");
 setOpenLogCreation(true);
 } else if (card.status === "New") {
 console.log("Opening Solver popup");
 setOpenSolver(true);
 } else if (card.status === "Rejected") {
 console.log("Opening Rejected popup");
 setOpenRejected(true);
 } else if (card.status === "Accepted") {
 console.log("Opening Accepted popup");
 setOpenAccepted(true);
 }
 };


 // Fetch card data from the API
 React.useEffect(() => {
 const fetchCardsData = async () => {
 try {
 const response = await fetch("http://localhost:4000/api/master_problem");
 if (!response.ok) {
 throw new Error(`HTTP error! status: ${response.status}`);
 }
 const data = await response.json();


 // Debug: Log the data to inspect its structure
 console.log("API Response Data:", data);


 // Check if data.data is an array before attempting to map
 if (Array.isArray(data.data)) {
 // Filter for "Accepted" status and map to change status to "New"
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
 }
 };


 fetchCardsData();
 }, []);


 // Filter cards based on active tab and search query
 const filteredCards = cardsData.filter((card) => {
 const matchesTab = activeTab === "All" || card.status === activeTab;
 const matchesSearch =
 card.problem_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 card.Description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 card.created_by?.toLowerCase().includes(searchQuery.toLowerCase());
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
 <h1 className="text-xl font-medium m-4 text-gray-600">Welcome Admin.</h1>
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


 {/* Grid of Cards */}
 <div className="grid grid-cols-1 rounded-2xl p-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {filteredCards.map((card, index) => (
 <div key={index}>
 <Card
 title={card.problem_title}
 status={card.status}
 description={card.Description}
 date={card.created_at}
 author={card.created_by}
 imageUrl={defaultImageUrl} // Always use the specified image URL
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
 <LogCreation open={openLogCreation} onClose={() => setOpenLogCreation(false)} />
 <Rejected open={openRejected} onClose={() => setOpenRejected(false)} />
 <Accepted open={openAccepted} onClose={() => setOpenAccepted(false)} />
 <Solver open={openSolver} onClose={() => setOpenSolver(false)} />
 </div>
 );
}
export default Problemsolver;
