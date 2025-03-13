import React, { useState, useRef, useEffect } from "react";
import { IoArrowBack, IoSearchOutline, IoAdd } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { BiBold, BiItalic, BiUnderline, BiListOl, BiListUl, BiLink } from "react-icons/bi";
import Input from "../../components/input/Input";
import Card from "../../components/problem/Card";
import LogCreation from "../../components/Popups/LogCreation";
import Rejected from "../../components/Popups/Rejected";
import Accepted from "../../components/Popups/Accepted";
import axios from 'axios'; // Import Axios
const Dashboard = () => {
  // State variables
  const [open, setOpen] = useState(false);
  const [openLogCreation, setOpenLogCreation] = useState(false); // For LogCreation popup
  const [openRejected, setOpenRejected] = useState(false); // For Rejected popup
  const [openAccepted, setOpenAccepted] = useState(false); // For Accepted popup
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fileError, setFileError] = useState("");
  const [newCategoryName, setNewCategoryName] = useState(""); // Declare newCategoryName
  const [categories, setCategories] = useState([
    "Productivity failure",
    "Mismanagement",
    "Time Management",
    "Communication Issues",
  ]); // Declare categories
  const contentEditableRef = useRef(null);
  const scrollableRef = useRef(null);
  
  // Card data
  const cardData = [
    {
      title: "Productivity failure",
      status: "New",
      description: "Productive failure is a learning design where individuals are allowed to fail in a managed way.",
      date: "2023-10-15",
      author: "J. David",
      imageUrl: "/user1.jpg",
    },
    {
      title: "Task Management",
      status: "Accepted",
      description: "Effective task management strategies to improve productivity and focus.",
      date: "2023-10-14",
      author: "A. Smith",
      imageUrl: "/user2.jpg",
    },
    {
      title: "Time Tracking",
      status: "Rejected",
      description: "Tools and techniques for tracking time and improving efficiency.",
      date: "2023-10-13",
      author: "M. Johnson",
      imageUrl: "/user3.jpg",
    },
    // Additional card data...
  ];
  // Filter cards based on search query
  const filteredCards = cardData.filter(
    (card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  // Handle card click
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
  const applyFormatting = (command, value = null) => {
    if (contentEditableRef.current) {
      document.execCommand(command, false, value);
    }
  };
  const toggleCategory = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };
  const handleAddNewCategory = () => {
    if (newCategoryName.trim() !== "") {
      setCategories([...categories, newCategoryName]); // Add new category
      setNewCategoryName(""); // Clear the input field
    }
  };
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length + files.length > 5) {
      setFileError("You can upload a maximum of 5 files.");
      return;
    }
    setFileError("");
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleCreate = async () => {
    const problemTitle = document.querySelector("input[placeholder='Enter the problem']").value;
    const description = contentEditableRef.current.innerText;
    const questions = Array.from(document.querySelectorAll("input[placeholder='Type your answer']")).map(
      (input) => input.value,
    );
    
    // Prepare form data
    const formData = new FormData();
    formData.append('Category', selectedCategory);
    formData.append('Problem_Title', problemTitle);
    formData.append('Description', description);
    files.forEach(file => {
      formData.append('Media_Upload', file); // Append each file to the form data
    });
    formData.append('Questions', JSON.stringify(questions)); // Convert questions to JSON string
    formData.append('created_by', 'YourUser'); // Replace with actual user info
    // Send POST request
    // console.log("Form Dataaa:", formData);
    try {
      const response = await axios.post('http://localhost:5000/api/master_problem', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
         },
 
      });
      console.log("Responsess:", response.data);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    }
  };
  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [cardData]);
  return (
    <div className="min-h-screen bg-gray-50 scrollbar-hide" style={{ overflow: "hidden" }}>
      <div className="flex flex-col lg:flex-row h-screen justify-between w-full bg-white p-4 lg:p-6 border-b border-[#D3E4FF] scrollbar-hide">
        {/* Left side - Log creation form */}
        <div className="w-full lg:w-4/5 p-1 overflow-x-auto overflow-y-auto scrollbar-hide">
          <div className="flex items-center mb-6">
            <button className="text-gray-500 mr-3" onClick={() => setOpen(false)}>
              <IoArrowBack />
            </button>
            <h2 className="text-lg font-medium">Log creation</h2>
          </div>
          {/* Category */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    selectedCategory === category
                      ? "bg-[#FF7622] text-white border-[#FF7622]"
                      : "bg-white text-[#5E5E5E] border-[#FF7622]"
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            {/* Add New Button (Full Width) */}
            <div className="w-full mt-4 flex flex-col lg:flex-row items-center">
              <input
                type="text"
                className="flex-1 px-3 py-2 text-sm rounded-md border border-[#FF7622] mr-0 lg:mr-2 mb-2 lg:mb-0"
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button
                className="px-3 py-2 text-sm rounded-md border border-[#FF7622] text-[#FF7622] flex items-center justify-center"
                onClick={handleAddNewCategory}
              >
                <IoAdd className="mr-1" /> Add New
              </button>
            </div>
          </div>
          {/* Problem Title */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Problem Title</h3>
            <input
              type="text"
              placeholder="Enter the problem"
              className="w-full p-3 bg-gray-100 rounded-md border-none outline-none"
            />
          </div>
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Description</h3>
            <div
              ref={contentEditableRef}
              contentEditable
              placeholder="Describe the issue..."
              className="w-full p-3 bg-gray-100 rounded-md border-none outline-none min-h-[100px] mb-2"
            ></div>
            <div className="flex gap-2 text-gray-500">
              <button onClick={() => applyFormatting("bold")}>
                <BiBold />
              </button>
              <button onClick={() => applyFormatting("italic")}>
                <BiItalic />
              </button>
              <button onClick={() => applyFormatting("underline")}>
                <BiUnderline />
              </button>
              <button onClick={() => applyFormatting("insertOrderedList")}>
                <BiListOl />
              </button>
              <button onClick={() => applyFormatting("insertUnorderedList")}>
                <BiListUl />
              </button>
              <button
                onClick={() => {
                  const url = prompt("Enter the URL:");
                  if (url) applyFormatting("createLink", url);
                }}
              >
                <BiLink />
              </button>
            </div>
          </div>
          {/* Media Upload */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-1">Media Upload</h3>
            <p className="text-xs text-gray-500 mb-3">Add your documents here, and you can upload up to 5 files max</p>
            <div className="border border-dashed border-orange-300 rounded-md p-8 flex flex-col items-center justify-center">
              {files.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {files.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Uploaded file ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                        onClick={() => handleRemoveFile(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="bg-orange-100 p-3 rounded-full text-orange-500 mb-3">
                    <FiUpload size={24} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Drag your file(s) to start uploading</p>
                  <p className="text-xs text-gray-500 mb-3">OR</p>
                  {/* File Input */}
                  <input type="file" id="file-upload" className="hidden" multiple onChange={handleFileChange} />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md text-sm cursor-pointer"
                  >
                    Browse files
                  </label>
                </>
              )}
              {fileError && <p className="text-red-500 text-xs mt-2">{fileError}</p>}
            </div>
          </div>
          {/* Questions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Questions</h3>
            {[
              "HAVE YOU TRIED TO SOLVE THE PROBLEM?",
              "WHEN DID THE PROBLEM ARISE?",
              "VENUE OF THE PROBLEM ARISE?",
              "SPECIFICATION OF THE PROBLEM?",
              "PROBLEM ARISE TIME?"
            ].map((question, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm mb-2">{index + 1}. {question}</p>
                <input
                  type="text"
                  placeholder="Type your answer"
                  className="w-full p-3 bg-gray-100 rounded-md border-none outline-none"
                />
              </div>
            ))}
          </div>
          {/* Create button */}
          <div className="bottom-6 bg-white pt-1 pb-20">
            <button className="w-full py-3 bg-orange-500 text-white rounded-md font-medium" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>
        {/* Right side - Cards */}
        <div className="w-full lg:w-1/3 flex flex-col h-screen">
          {/* Sticky Search Bar and Profile */}
          <div className="sticky top-0 bg-white z-10 p-4 flex items-center justify-between">
            <div className="flex-1 mr-4">
              <Input
                type="text"
                placeholder="Search any problem"
                icon={<IoSearchOutline className="text-gray-400" />}
                value={searchQuery}
                onChange={handleSearchChange}
                className="rounded-full pl-10 border-gray-300 focus:ring-2 focus:ring-[#FF7622]"
              />
            </div>
          </div>
          {/* Scrollable Cards Container */}
          <div
            ref={scrollableRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            style={{
              overflow: "auto",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {filteredCards.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                status={card.status}
                description={card.description}
                date={card.date}
                author={card.author}
                imageUrl={card.imageUrl}
                onClick={() => handleCardClick(card)} // Handle card click
              />
            ))}
          </div>
        </div>
      </div>
      <LogCreation open={openLogCreation} onClose={() => setOpenLogCreation(false)} />
      <Rejected open={openRejected} onClose={() => setOpenRejected(false)} />
      <Accepted open={openAccepted} onClose={() => setOpenAccepted(false)} />
    </div>
  );
};
export default Dashboard;