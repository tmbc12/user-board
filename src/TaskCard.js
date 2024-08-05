import React, { useState, useEffect } from "react";
import {
  Card as MuiCard,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import Timer from "./Timer";
import "./App.css";

// Importing Google Fonts
import "@fontsource/montserrat/400.css"; // Normal font weight for Montserrat
import "@fontsource/montserrat/700.css"; // Bold font weight for Montserrat
import "@fontsource/roboto/400.css"; // Normal font weight for Roboto
import "@fontsource/roboto/700.css"; // Bold font weight for Roboto

const TaskCard = ({ index, task, onDescriptionChange, onSave, isLoading }) => {
  const [description, setDescription] = useState(task.description);
  const [time, setTime] = useState(task.time || 0);
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleComplete = () => {
    setIsRunning(false);
    onSave(index, description, time);
  };

  return (
    <MuiCard
      sx={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
        borderRadius: 2, // Consistent 2px border radius
        backgroundColor: "#f9f9f9", // Light background color for the card
        transition: "transform 0.3s ease-in-out", // Smooth transition for hover effect
        marginBottom: 2, // Add margin between cards
        "&:hover": {
          transform: "translateY(-10px)", // Move up on hover
        },
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{
            marginBottom: 1,
            fontWeight: "bold", // Bolder user name
            fontFamily: "Roboto", // Use Roboto font
          }}
        >
          {task.name || "No Name"} {/* User name displayed in bold with modern font */}
        </Typography>
        <TextField
          label="Work Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            onDescriptionChange(index, e.target.value);
          }}
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          margin="normal"
          sx={{
            backgroundColor: "#fff", // White background for input
            borderRadius: 2, // Smooth corners for text input
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff", // Ensure white background
              "& .MuiInputBase-input": {
                fontSize: "0.875rem", // Reduced font size
              },
              "& fieldset": {
                borderColor: "#ddd", // Very light border color
              },
              "&:hover fieldset": {
                borderColor: "#ccc", // Slightly darker on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#bbb", // Slightly darker when focused
              },
            },
          }}
          InputLabelProps={{
            className: "MuiInputLabel-outlined",
            style: { color: "#555", fontFamily: "Roboto", fontSize: "0.875rem" }, // Lighter color for label and Roboto font
          }}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginTop: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#555",
              fontFamily: "Roboto", // Apply Roboto font
              fontWeight: 700, // Bolder font weight for the timer
            }}
          >
            <Timer isRunning={isRunning} onTimeUpdate={setTime} initialTime={time} />
          </Typography>
          {!isRunning ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStart}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: 2, // Reduced border radius for the Start button
                textTransform: "none", // No uppercase
                padding: "6px 12px", // Consistent padding
                fontFamily: "Roboto", // Apply Roboto font to button text
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              Start
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleComplete}
              sx={{
                backgroundColor: "#555",
                color: "#fff",
                borderRadius: 2, // Consistent border radius for the Complete button
                textTransform: "none", // No uppercase
                padding: "6px 12px", // Consistent padding
                fontFamily: "Roboto", // Apply Roboto font to button text
                "&:hover": {
                  backgroundColor: "#777",
                },
              }}
            >
              Complete
            </Button>
          )}
        </Stack>
      </CardContent>
    </MuiCard>
  );
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);

  useEffect(() => {
    fetch("https://api-user-dashboard.vercel.app/cards")
      .then((res) => res.json())
      .then((data) => {
        // Remove duplicate cards based on _id or another unique property
        const uniqueCards = Array.from(
          new Set(data.map((card) => card._id))
        ).map((id) => data.find((card) => card._id === id));
        setCards(uniqueCards);
      });
  }, []);

  const handleSave = (index, description, time) => {
    setLoadingIndex(index);

    const card = { ...cards[index], description, time };

    fetch(`https://api-user-dashboard.vercel.app/cards/${card._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    })
      .then((res) => res.json())
      .then((updatedCard) => {
        const updatedCards = cards.map((c, i) =>
          i === index ? updatedCard : c
        ); // Update only the modified card
        setCards(updatedCards);
        setLoadingIndex(null);
        alert(`${cards[index].name} Work Updated!`);
      });
  };

  const handleDescriptionChange = (index, newDescription) => {
    const updatedCards = [...cards];
    updatedCards[index].description = newDescription;
    setCards(updatedCards);
  };

  return (
    <div className="app">
      <div className="grid" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {cards.map((card, index) => (
          <TaskCard
            key={card._id || index}
            index={index}
            task={card}
            onDescriptionChange={handleDescriptionChange}
            onSave={handleSave}
            isLoading={loadingIndex === index}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
