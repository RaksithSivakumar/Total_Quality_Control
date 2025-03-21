import React, { useState, useRef, useEffect } from "react";
import { IoArrowBack, IoSearchOutline, IoAdd } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import {
  BiBold,
  BiItalic,
  BiUnderline,
  BiListOl,
  BiListUl,
  BiLink,
} from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import Card from "../../components/problem/Card";
import LogCreation from "../../components/Popups/LogCreation";
import Rejected from "../../components/Popups/Rejected";
import Accepted from "../../components/Popups/Accepted";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormDashboard = () => {
  const navigate = useNavigate();

  // State variables
  const [open, setOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fileError, setFileError] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activeTab, setActiveTab] = useState("creation");
  const [categories, setCategories] = useState([]);
  const [problemTitle, setProblemTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState(["", "", "", "", ""]);
  const [cardData, setCardData] = useState([]); // For storing fetched problems
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProblemId, setNewProblemId] = useState(null); // Track newly created problem
  const contentEditableRef = useRef(null);
  const scrollableRef = useRef(null);
  const newCardRef = useRef(null);


  // Fetch categories (including predefined ones)
  useEffect(() => {
    setCategories([
      "Productivity failure",
      "Mismanagement",
      "Time Management",
      "Communication Issues",
    ]);
  }, []);

  // Function to fetch problem data from the API
  const fetchProblems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/master_problem"
      );
      if (response.data && Array.isArray(response.data.data)) {
        // Sort the data with newest first (based on created_at)
        const sortedData = [...response.data.data].sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        setCardData(sortedData);
      } else {
        console.error("API response data is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      toast.error("Failed to fetch problems.");
    }
  };

  // Fetch problems on initial load
  useEffect(() => {
    fetchProblems();
  }, []);

  // Scroll to the newly created problem when it's available
  useEffect(() => {
    if (newProblemId && newCardRef.current) {
      newCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      
      // Highlight the new card briefly
      if (newCardRef.current) {
        newCardRef.current.classList.add("animate-pulse", "bg-orange-50");
        setTimeout(() => {
          if (newCardRef.current) {
            newCardRef.current.classList.remove("animate-pulse", "bg-orange-50");
          }
        }, 3000);
      }
      
      // Clear the newProblemId after scrolling
      setTimeout(() => {
        setNewProblemId(null);
      }, 5000);
    }
  }, [cardData, newProblemId, activeTab]);

  // Handle card click
  const handleCardClick = (card) => {
    if (card.status === "New") {
      setActivePopup("LogCreation");
    } else if (card.status === "Rejected") {
      setActivePopup("Rejected");
    } else if (card.status === "Accepted") {
      setActivePopup("Accepted");
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setProblemTitle("");
    setDescription("");
    setSelectedCategory(null);
    setFiles([]);
    setQuestions(["", "", "", "", ""]);
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = "";
    }
  };

  // Apply formatting to contentEditable
  const applyFormatting = (command, value = null) => {
    if (contentEditableRef.current) {
      document.execCommand(command, false, value);
    }
  };

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  // Add new category
  const handleAddNewCategory = () => {
    if (newCategoryName.trim() !== "") {
      setCategories([...categories, newCategoryName]);
      setNewCategoryName("");
      toast.success("New category added successfully!");
    } else {
      toast.error("Please enter a valid category name.");
    }
  };

  // Handle file upload
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (selectedFiles.length + files.length > 5) {
      setFileError("You can upload a maximum of 5 files.");
      toast.error("You can upload a maximum of 5 files.");
      return;
    }

    const invalidFiles = selectedFiles.filter(
      (file) => !allowedTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFiles.length > 0) {
      setFileError(
        "Invalid file type or size. Only JPEG, PNG, and PDF files under 5MB are allowed."
      );
      toast.error(
        "Invalid file type or size. Only JPEG, PNG, and PDF files under 5MB are allowed."
      );
      return;
    }

    setFileError("");
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    toast.success("Files uploaded successfully!");
  };

  // Remove file
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    toast.info("File removed.");
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate("/Problemrd");
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value); // Update the state with the new value
  };

  // Put this in your component
  useEffect(() => {
    // Only set the content if the ref exists and the value is different
    if (
      contentEditableRef.current &&
      contentEditableRef.current.innerText !== description
    ) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const cursorPosition = range.startOffset;

      contentEditableRef.current.innerText = description;

      // Restore cursor position
      if (selection.rangeCount > 0) {
        const newRange = document.createRange();
        newRange.setStart(
          contentEditableRef.current.childNodes[0] ||
            contentEditableRef.current,
          Math.min(cursorPosition, description.length)
        );
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  }, [description]);

  // Validate form inputs
  const validateForm = () => {
    if (!selectedCategory) {
      toast.error("Please select a category.");
      return false;
    }
    if (!problemTitle.trim()) {
      toast.error("Please enter a problem title.");
      return false;
    }
    if (!description.trim()) {
      toast.error("Please provide a description.");
      return false;
    }
    // Check if at least one question is answered
    if (!questions.some(q => q.trim())) {
      toast.error("Please answer at least one question.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("Category", selectedCategory);
    formData.append("problem_title", problemTitle);
    formData.append("Description", description);
    files.forEach((file) => {
      formData.append("Media_Upload", file);
    });
    formData.append("Questions_1", questions[0]);
    formData.append("Questions_2", questions[1]);
    formData.append("Questions_3", questions[2]);
    formData.append("Questions_4", questions[3]);
    formData.append("Questions_5", questions[4]);
    formData.append("created_by", "YourUser"); // Replace with actual user info

    try {
      const response = await axios.post(
        "http://localhost:4000/api/master_problem",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      toast.success("Problem created successfully!");
      
      // Store the ID of the newly created problem
      if (response.data && response.data.data && response.data.data._id) {
        setNewProblemId(response.data.data._id);
      }
      
      // Reset form after successful submission
      resetForm();
      
      // Refetch problems to update the list
      await fetchProblems();
      
      // Switch to problem bank tab
      setActiveTab("problemBank");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Error submitting form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter cards based on search query
  const filteredCards = cardData.filter(
    (card) =>
      card.problem_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.Description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 scrollbar-hide">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex flex-col lg:flex-row h-screen justify-between w-full bg-white p-4 lg:p-6 border-b border-[#D3E4FF] scrollbar-hide">
        {/* Mobile Tab Navigation */}
        <div className="lg:hidden flex justify-around border-b border-gray-200 mb-4">
          <button
            className={`py-2 px-4 ${
              activeTab === "creation"
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("creation")}
          >
            Creation
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "problemBank"
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("problemBank")}
          >
            Problem Bank
          </button>
        </div>

        {/* Left side - Log creation form */}
        <div
          className={`w-full lg:w-4/5 p-1 overflow-x-auto overflow-y-auto scrollbar-hide ${
            activeTab === "problemBank" && "hidden lg:block"
          }`}
        >
          <div className="flex items-center mb-6">
            <button
              className="text-gray-500 mr-3"
              onClick={handleBackClick}
              aria-label="Go back"
            >
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

            {/* Add New Category */}
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
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Description</h3>
 
            <textarea
              // ref={contentEditableRef} // If you still need a ref
              value={description} // Controlled component
              onChange={(e) => setDescription(e.target.value)} // Handle input changes
              className="w-full p-3 bg-gray-100 rounded-md border-none outline-none min-h-[100px] mb-2"
              placeholder="Enter your description..."
            />
            {/* Formatting Buttons (disabled for textarea) */}
             <div className="flex gap-2 text-gray-500">
              <button
                onClick={() => alert("Formatting not supported in textarea")}
                aria-label="Bold"
              >
                <BiBold />
              </button>
              <button
                onClick={() => alert("Formatting not supported in textarea")}
                aria-label="Italic"
              >
                <BiItalic />
              </button>
              <button
                onClick={() => alert("Formatting not supported in textarea")}
                aria-label="Underline"
              >
                <BiUnderline />
              </button>
              <button
                onClick={() => alert("Formatting not supported in textarea")}
                aria-label="Ordered List"
              >
                <BiListOl />
              </button>
              <button
                onClick={() => alert("Formatting not supported in textarea")}
                aria-label="Unordered List"
              >
                <BiListUl />
              </button>
              <button
                onClick={() => alert("Formatting not supported in textarea")}
                aria-label="Insert Link"
              >
                <BiLink />
              </button>
            </div>
          </div>

          {/* Media Upload */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-1">Media Upload</h3>
            <p className="text-xs text-gray-500 mb-3">
              Add your documents here, and you can upload up to 5 files max
            </p>
            <div className="border border-dashed border-orange-300 rounded-md p-8 flex flex-col items-center justify-center">
              {files.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {files.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded file ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                        onClick={() => handleRemoveFile(index)}
                        aria-label="Remove file"
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
                  <p className="text-sm text-gray-600 mb-1">
                    Drag your file(s) to start uploading
                  </p>
                  <p className="text-xs text-gray-500 mb-3">OR</p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md text-sm cursor-pointer"
                  >
                    Browse files
                  </label>
                </>
              )}
              {fileError && (
                <p className="text-red-500 text-xs mt-2">{fileError}</p>
              )}
            </div>
          </div>

          {/* Questions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Questions</h3>
            {questions.map((question, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm mb-2">
                  {index + 1}. Have you tried to solve the problem?
                </p>
                <input
                  type="text"
                  placeholder="Type your answer"
                  className="w-full p-3 bg-gray-100 rounded-md border-none outline-none"
                  value={question}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index] = e.target.value;
                    setQuestions(newQuestions);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Create button */}
          <div className="bottom-6 bg-white pt-1 pb-20">
            <button
              className={`w-full py-3 ${isSubmitting ? 'bg-gray-400' : 'bg-orange-500'} text-white rounded-md font-medium`}
              onClick={handleCreate}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Create"}
            </button>
          </div>
        </div>

        {/* Right side - Cards */}
        <div
          className={`w-full lg:w-1/3 flex flex-col h-screen ${
            activeTab === "creation" && "hidden lg:block"
          }`}
        >
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

          {/* Scrollable Cards Container with Hidden Scrollbar */}
          <div
            ref={scrollableRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{
              overflow: "auto",
              msOverflowStyle: "none" /* IE and Edge */,
              scrollbarWidth: "none" /* Firefox */,
              maxHeight: "80vh",
            }}
          >
            <style jsx>{`
              #scrollable-container::-webkit-scrollbar {
                display: none;
              }
              
              @keyframes highlight-card {
                0% { background-color: #FFEDD5; }
                50% { background-color: #FED7AA; }
                100% { background-color: #FFEDD5; }
              }
              
              .highlight-new-card {
                animation: highlight-card 2s ease-in-out;
              }
            `}</style>

            {filteredCards.length > 0 ? (
              filteredCards.map((card, index) => (
                <div 
                  key={index}
                  ref={card._id === newProblemId ? newCardRef : null}
                  className={`transition-all duration-500 ${card._id === newProblemId ? 'highlight-new-card border-l-4 border-orange-500' : ''}`}
                >
                  <Card
                    title={card.problem_title}
                    status={card.status || "New"}
                    description={card.Description}
                    date={new Date(card.created_at).toLocaleDateString()}
                    author={card.created_by}
                    imageUrl={
                      "https://bitlinks.bitsathy.ac.in/static/media/user.900505a2e95287f7e05c.jpg"
                    }
                    onClick={() => handleCardClick(card)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                No problems found. Try a different search or create a new problem.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popups */}
      {activePopup === "LogCreation" && (
        <LogCreation open onClose={() => setActivePopup(null)} />
      )}
      {activePopup === "Rejected" && (
        <Rejected open onClose={() => setActivePopup(null)} />
      )}

      {activePopup === "Accepted" && (
        <Accepted open onClose={() => setActivePopup(null)} />
      )}
    </div>
  );
};

export default FormDashboard;