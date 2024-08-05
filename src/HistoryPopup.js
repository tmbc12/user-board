import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Timer from "./Timer";
import axios from "axios";

const HistoryPopup = ({ open, onClose }) => {
  const [tab, setTab] = useState(0);
  const [time, setTime] = useState(0);
  const [history, setHistory] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    custom: [], // Added for custom range data
  });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(""); // Start date for custom range
  const [endDate, setEndDate] = useState(""); // End date for custom range

  useEffect(() => {
    if (open) {
      fetchHistoryData(tab);
    }
  }, [open, tab]);

  const fetchHistoryData = async (selectedTab) => {
    setLoading(true);
    let endpoint = "";

    switch (selectedTab) {
      case 0:
        endpoint = "/work/today";
        break;
      case 1:
        endpoint = "/work/lastweek";
        break;
      case 2:
        endpoint = "/work/lastmonth";
        break;
      case 3: // Custom Range
        endpoint = `/work/range?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
        break;
      default:
        break;
    }

    try {
      // Prepend the base URL
      const response = await axios.get(`https://api-user-dashboard.vercel.app${endpoint}`);
      console.log(response);
      const data = response.data;

      const updatedHistory = { ...history };
      if (selectedTab === 0) updatedHistory.daily = data;
      else if (selectedTab === 1) updatedHistory.weekly = data;
      else if (selectedTab === 2) updatedHistory.monthly = data;
      else if (selectedTab === 3) updatedHistory.custom = data;

      setHistory(updatedHistory);
    } catch (error) {
      console.error("Error fetching work history:", error);
    } finally {
      setLoading(false);
    }
  };

  function calculateSecondsBetweenDates(pastDate, endDate) {
    const past = new Date(pastDate);
    const current = endDate ? new Date(endDate) : new Date();

    const differenceInMilliseconds = current - past;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    return differenceInSeconds;
  }

  const renderHistoryTable = (data) => (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                borderBottom: "1px solid #ddd",
              }}
            >
              Name
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                borderBottom: "1px solid #ddd",
              }}
            >
              Work Description
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                borderBottom: "1px solid #ddd",
              }}
            >
              Time
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                borderBottom: "1px solid #ddd",
              }}
            >
              Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: "#fff" }}>
          {data.map((entry, index) => (
            <TableRow key={index}>
              <TableCell
                sx={{
                  backgroundColor: "#fff",
                  fontSize: "0.9rem",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {entry.user.name}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#fff",
                  fontSize: "0.9rem",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {entry.description}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#fff",
                  fontSize: "0.9rem",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <Timer
                  isRunning={entry.stopTime ? false : true}
                  onTimeUpdate={setTime}
                  initialTime={calculateSecondsBetweenDates(entry?.startTime, entry?.stopTime)}
                />
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#fff",
                  fontSize: "0.9rem",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {new Date(entry.startTime).toLocaleDateString()}{" "}
                {/* Format date */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          border: "none",
          boxShadow: "none",
          borderRadius: 4,
          backgroundColor: "#fff",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
        >
          Work History
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className="Tab" style={{ display: "flex", flexDirection: "column" }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            aria-label="history tabs"
            sx={{
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            {["Daily", "Weekly", "Monthly", "Custom Range"].map((label, index) => (
              <Tab
                key={label}
                label={label}
                sx={{
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1rem",
                  backgroundColor: tab === index ? "#000" : "#f5f5f5",
                  color: tab === index ? "#fff !important" : "#000",
                  borderRadius:
                    index === 0
                      ? "8px 0 0 8px"
                      : index === 3
                      ? "0 8px 8px 0"
                      : "0",
                  "&:hover": {
                    backgroundColor: tab === index ? "#333" : "#e0e0e0",
                  },
                  padding: "10px 20px",
                  minWidth: 0,
                }}
              />
            ))}
          </Tabs>

          {tab === 3 && (
            <Box sx={{ marginTop: 4, justifyContent: "Left", display: "flex" }}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ 
                fontFamily: "Roboto",
                color: "#fff",
                backgroundColor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fff",
                  "& .MuiInputBase-input": {
                    fontSize: "0.875rem",
                  },
                  "& fieldset": {
                    borderColor: "#ddd",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ccc",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#bbb",
                  },
                },
                marginRight: 2
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ 
                fontFamily: "Roboto",
                color: "#fff",
                backgroundColor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fff",
                  "& .MuiInputBase-input": {
                    fontSize: "0.875rem",
                  },
                  "& fieldset": {
                    borderColor: "#ddd",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ccc",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#bbb",
                  },
                },
                marginRight: 2
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => fetchHistoryData(tab)}
            >
              Apply
            </Button>
          </Box>
          
          )}

          <Box sx={{ marginTop: 2, maxHeight: 400, overflowY: "auto" }}>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <>
                {tab === 0 && renderHistoryTable(history.daily)}
                {tab === 1 && renderHistoryTable(history.weekly)}
                {tab === 2 && renderHistoryTable(history.monthly)}
                {tab === 3 && renderHistoryTable(history.custom)}
              </>
            )}
          </Box>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryPopup;
