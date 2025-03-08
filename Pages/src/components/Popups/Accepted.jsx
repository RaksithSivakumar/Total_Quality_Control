import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Check, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  IconButton,
  Box,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const Accepted = ({ open, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [files, setFiles] = useState([]); // State for uploaded files
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleViewDetails = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    if (files.length + uploadedFiles.length > 5) {
      alert("You can upload a maximum of 5 files.");
      return;
    }
    setFiles([...files, ...uploadedFiles]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
    >
      <DialogContent
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          p: isMobile ? 2 : 4,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Dialog Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={isMobile ? 2 : 4}
        >
          <DialogTitle sx={{ p: 0 }}>
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                color="inherit"
                onClick={onClose}
                aria-label="close"
                sx={{ p: isMobile ? 1 : 2 }}
              >
                <ArrowLeft fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
              <Typography variant="h6" component="h1">
                Log creation
              </Typography>
            </Box>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ p: isMobile ? 1 : 2 }}
          >
            <CloseIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>

        {/* Accepted Status */}
        <Box mb={isMobile ? 2 : 3} px={isMobile ? 1 : 2}>
          <Typography
            variant="h6"
            sx={{ color: "success.main", fontWeight: "medium" }}
          >
            Accepted
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
            Your problem is forwarded to the problem-solving team by the supervisor.
          </Typography>
        </Box>

        {/* Points Provided */}
        <Box mb={isMobile ? 2 : 3} px={isMobile ? 1 : 2}>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            Points provided
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={isMobile ? 1 : 2}
            bgcolor="grey.100"
            borderRadius={1}
            border={1}
            borderColor="grey.300"
            mt={1}
          >
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              500 points
            </Typography>
            <Trophy fontSize={isMobile ? "small" : "medium"} color="warning" />
          </Box>
        </Box>

        {/* View Details Button */}
        <Button
          variant="outlined"
          fullWidth
          onClick={handleViewDetails}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
          sx={{
            justifyContent: "space-between",
            textTransform: "none",
            color: "text.secondary",
            borderColor: "grey.300",
            bgcolor: "grey.100",
            p: isMobile ? 1 : 2,
            mt: isMobile ? 2 : 3,
            mx: isMobile ? 1 : 2,
            "&:hover": {
              bgcolor: "grey.200",
              borderColor: "grey.400",
            },
          }}
        >
          <Typography variant="body1">View details</Typography>
          {isExpanded ? (
            <ChevronUp fontSize={isMobile ? "small" : "medium"} />
          ) : (
            <ChevronDown fontSize={isMobile ? "small" : "medium"} />
          )}
        </Button>

        {/* Expanded Details */}
        {isExpanded && (
          <Box mt={isMobile ? 2 : 4} px={isMobile ? 1 : 2}>
            {/* Category */}
            <Box mb={isMobile ? 2 : 3}>
              <Typography variant="h6" sx={{ fontWeight: "medium", mb: 1 }}>
                Category
              </Typography>
              <Button
                variant={isActive ? "contained" : "outlined"}
                size={isMobile ? "small" : "medium"}
                onClick={() => setIsActive(!isActive)}
                sx={{
                  color: isActive ? "common.white" : "#FF7622",
                  bgcolor: isActive ? "#FF7622" : "transparent",
                  borderColor: "#FF7622",
                  "&:hover": {
                    bgcolor: isActive ? "#FF7622" : "grey.100",
                  },
                }}
              >
                Productivity failure
              </Button>
            </Box>

            {/* Problem Title */}
            <Box mb={isMobile ? 2 : 3}>
              <Typography variant="h6" sx={{ fontWeight: "medium", mb: 1 }}>
                Problem Title
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value="Water leakage"
                disabled
                size={isMobile ? "small" : "medium"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "grey.100",
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                  },
                }}
              />
            </Box>

            {/* Description */}
            <Box mb={isMobile ? 2 : 3}>
              <Typography variant="h6" sx={{ fontWeight: "medium", mb: 1 }}>
                Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  bgcolor: "grey.100",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                Unintended escape of water from pipes, fixtures, or structures,
                leading to potential damage and waste in AS block.
              </Typography>
            </Box>

            {/* Media Upload */}
            <Box mb={isMobile ? 2 : 3}>
              <Typography variant="h6" sx={{ fontWeight: "medium", mb: 1 }}>
                Media Upload
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                Add your documents here, and you can upload up to 5 files max
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={2}
                bgcolor="grey.100"
                borderRadius={1}
              >
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  phoenix-document.pdf
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{ color: "primary.main", mr: 1 }}
                  >
                    Upload complete
                  </Typography>
                  <Box bgcolor="success.main" borderRadius="50%" p={0.5}>
                    <Check fontSize="small" sx={{ color: "common.white" }} />
                  </Box>
                </Box>
              </Box>
              <input
                type="file"
                onChange={handleFileUpload}
                multiple
                accept=".pdf,.doc,.docx"
                style={{ marginTop: 8, width: "100%" }}
              />
            </Box>

            {/* Questions */}
            <Box>
              {[1, 2, 3, 4, 5].map((num) => (
                <Box key={num} mb={isMobile ? 2 : 3}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {num}. Have you solved this problem?
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Yes, I tried to solve the problem"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "grey.100",
                        "& fieldset": {
                          borderColor: "transparent",
                        },
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Accepted;