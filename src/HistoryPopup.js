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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const HistoryPopup = ({ open, onClose }) => {
  const [tab, setTab] = useState(0);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("history");
    return savedHistory ? JSON.parse(savedHistory) : { daily: [], weekly: [], monthly: [] };
  });

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const newHistory = { ...history };

    const today = new Date().toLocaleDateString();
    const thisWeek = new Date().toISOString().slice(0, 10);
    const thisMonth = new Date().toISOString().slice(0, 7);

    tasks.forEach((task) => {
      if (task.time > 0) {
        newHistory.daily.push({ date: today, ...task });
        newHistory.weekly.push({ date: thisWeek, ...task });
        newHistory.monthly.push({ date: thisMonth, ...task });
      }
    });

    setHistory(newHistory);
    localStorage.setItem("history", JSON.stringify(newHistory));
  }, [open]);

  const renderHistoryTable = (data) => (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}> {/* Grey background for table head */}
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                borderBottom: "1px solid #ddd", // Light border for table header
              }}
            >
              Project
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                borderBottom: "1px solid #ddd", // Light border for table header
              }}
            >
              Description
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                borderBottom: "1px solid #ddd", // Light border for table header
              }}
            >
              Time
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                borderBottom: "1px solid #ddd", // Light border for table header
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
                  borderBottom: "1px solid #ddd", // Light border for table cells
                }}
              >
                {entry.name}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#fff",
                  fontSize: "0.9rem",
                  borderBottom: "1px solid #ddd", // Light border for table cells
                }}
              >
                {entry.description}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#fff",
                  fontSize: "0.9rem",
                  borderBottom: "1px solid #ddd", // Light border for table cells
                }}
              >
                {entry.time} minutes
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#fff",
                  fontSize: "0.9rem",
                  borderBottom: "1px solid #ddd", // Light border for table cells
                }}
              >
                {entry.date}
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
          border: "none", // Remove border
          boxShadow: "none", // Remove shadow if needed
          borderRadius: 4, // Optional: keep border-radius for smooth edges
          backgroundColor: "#fff", // White background
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
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          Work History
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          aria-label="history tabs"
          sx={{
            "& .MuiTabs-indicator": {
              display: "none", // Remove default bottom indicator
            },
          }}
        >
          {["Daily", "Weekly", "Monthly"].map((label, index) => (
            <Tab
              key={label}
              label={label}
              sx={{
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem", // Increase font size for tabs
                backgroundColor: tab === index ? "#000" : "#f5f5f5",
                color: tab === index ? "#fff !important" : "#000",
                borderRadius: index === 0 ? "8px 0 0 8px" : index === 2 ? "0 8px 8px 0" : "0", // Rounded corners for first and last tabs
                "&:hover": {
                  backgroundColor: tab === index ? "#333" : "#e0e0e0",
                },
                padding: "10px 20px", // Adjust padding
                minWidth: 0, // Remove default min-width to ensure no extra margins
              }}
            />
          ))}
        </Tabs>
        <Box sx={{ marginTop: 2, maxHeight: 400, overflowY: "auto" }}>
          {tab === 0 && renderHistoryTable(history.daily)}
          {tab === 1 && renderHistoryTable(history.weekly)}
          {tab === 2 && renderHistoryTable(history.monthly)}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryPopup;
