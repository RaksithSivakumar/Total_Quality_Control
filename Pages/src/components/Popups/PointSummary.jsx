import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { Trophy } from "lucide-react";
import { Popover, Box, Typography, IconButton } from "@mui/material";

const PointSummary = ({ open, onClose, anchorEl }) => {
  // Sample data for points summary
  const pointsData = [
    { title: "Water Leakage", points: 150 },
    { title: "Water Leakage", points: 150 },
    { title: "Water Leakage", points: 150 },
    { title: "Water Leakage", points: 150 },
    { title: "Water Leakage", points: 150 },
    { title: "Water Leakage", points: 150 },
    { title: "Water Leakage", points: 150 },
    { title: "Water Leakage", points: 150 },
    { title: "Water Leakage", points: 150 },
    { title: "Water Leakage", points: 150 },
    { title: "Productivity failure", points: 150 },
  ];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        style: {
          width: 320,
          maxWidth: "90vw",
          maxHeight: "80vh",
          scrollbarWidth: "none",
          margin: 0,
          borderRadius: 12,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor: "transparent",
        },
      }}
    >
      <Box className="p-4">
        {/* Header */}
        <Box className="flex items-center mb-4">
          <IconButton
            className="bg-gray-100 mr-4"
            onClick={onClose}
            sx={{
              backgroundColor: "#f3f4f6",
              "&:hover": {
                backgroundColor: "#e5e7eb",
              },
            }}
          >
            <IoArrowBack className="text-gray-700" />
          </IconButton>
          <Typography variant="h6" className="p-4 font-medium text-xl">
            Points summary
          </Typography>
        </Box>

        {/* Points List */}
        <Box className="space-y-3 max-h-[70vh] pr-1">
          {pointsData.map((item, index) => (
            <Box
              key={index}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-xl"
              sx={{ backgroundColor: "#f3f4f6" }}
            >
              <Typography variant="body1" className="text-gray-800 font-medium">
                {item.title}
              </Typography>
              <Box className="flex items-center text-green-500">
                <Trophy className="h-5 w-5 mr-1" />
                <Typography variant="body1" className="font-medium">
                  {item.points}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Popover>
  );
};

export default PointSummary;