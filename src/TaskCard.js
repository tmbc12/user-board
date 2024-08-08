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
import CreateCard from "./UserCreateCard";
import HistoryIcon from "@mui/icons-material/History";
import HistoryPopup from "./HistoryPopup";

// Importing Google Fonts
import "@fontsource/montserrat/400.css"; // Normal font weight for Montserrat
import "@fontsource/montserrat/700.css"; // Bold font weight for Montserrat
import "@fontsource/roboto/400.css"; // Normal font weight for Roboto
import "@fontsource/roboto/700.css"; // Bold font weight for Roboto

const TaskCard = ({ index, task, onDescriptionChange }) => {
  const [description, setDescription] = useState(task.description || "");
  const [time, setTime] = useState(task.time || 0);
  const [isRunning, setIsRunning] = useState(
    !!task.startTime && !task.stopTime
  );
  const [descriptionError, setDescriptionError] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  const handleStart = () => {
    if (!description.trim()) {
      setDescriptionError(true);
      return; // Stop further execution if the description is empty
    }

    setDescriptionError(false); // Clear the error if validation passes

    setIsRunning(true);
    const newWork = {
      userId: task._id,
      description: description || "",
      startTime: new Date().toISOString(),
    };

    fetch("https://api-user-dashboard.vercel.app/work", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWork),
    }).then((res) => {
      res.json();
      window.location.reload();
    });
  };

  const handleHistory = () => {
    setHistoryOpen(true);
    setCurrentUser(task._id);
  };

  const handleComplete = () => {
    if (!description.trim()) {
      setDescriptionError(true);
      return; // Stop further execution if the description is empty
    }

    setDescriptionError(false); // Clear the error if validation passes

    setIsRunning(false);
    const updatedWork = {
      ...task,
      stopTime: new Date().toISOString(),
    };

    fetch(`https://api-user-dashboard.vercel.app/work/${updatedWork.task_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedWork),
    })
      .then((res) => {
        if (!res.ok) {
          // Handle the error if the response status is not OK
          throw new Error("Failed to update work");
        }
        return res.json(); // Parse the JSON from the response
      })
      .then((data) => {
        alert("Updated successfully");
        window.location.reload(); // Reload the page if needed
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error:", error);
        alert("Failed to update work");
      });
  };

  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <MuiCard
      sx={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        transition: "transform 0.3s ease-in-out",
        marginBottom: 2,
        "&:hover": {
          transform: "translateY(-10px)",
        },
      }}
    >
      <HistoryPopup
        userId={currentUser}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              marginBottom: 1,
              fontWeight: "bold",
              fontFamily: "Roboto",
            }}
          >
            {task.name || "No Name"}
          </Typography>
          <Stack direction="row" alignItems="center" gap="10px">
            <Timer
              isRunning={isRunning}
              onTimeUpdate={setTime}
              initialTime={time}
            />
            <HistoryIcon onClick={handleHistory} sx={{ cursor: "pointer" }} />
          </Stack>
        </Stack>
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
          error={descriptionError}
          helperText={descriptionError ? "Work Description is required" : ""}
          sx={{
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
          }}
          InputLabelProps={{
            className: "MuiInputLabel-outlined",
            style: {
              color: "#555",
              fontFamily: "Roboto",
              fontSize: "0.875rem",
            },
          }}
          InputProps={{
            readOnly: isRunning,
          }}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginTop: 2 }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#555",
              fontFamily: "Roboto",
              fontWeight: 700,
            }}
          ></Typography>
          {!isRunning ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStart}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: 2,
                textTransform: "none",
                padding: "6px 12px",
                fontFamily: "Roboto",
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
                borderRadius: 2,
                textTransform: "none",
                padding: "6px 12px",
                fontFamily: "Roboto",
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

  function calculateSecondsBetweenDates(pastDate, endDate) {
    const past = new Date(pastDate);
    const current = endDate ? new Date(endDate) : new Date();

    const differenceInMilliseconds = current - past;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    return differenceInSeconds;
  }

  function fetchUser() {
    fetch("https://api-user-dashboard.vercel.app/users")
      .then((res) => res.json())
      .then((data) => {
        setCards(
          data.map((user) => ({
            _id: user._id,
            name: user.name,
            task_id: user.lastWork?._id || "",
            description: user.lastWork?.description || "",
            time: user.lastWork?.startTime
              ? calculateSecondsBetweenDates(
                  user.lastWork?.startTime,
                  user.lastWork?.stopTime
                )
              : 0, // Initialize with 0; you can compute the time based on work start and stop times
            startTime: user.lastWork?.startTime || null,
            stopTime: user.lastWork?.stopTime || null,
          }))
        );
      });
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDescriptionChange = (index, newDescription) => {
    const updatedCards = [...cards];
    updatedCards[index].description = newDescription;
    setCards(updatedCards);
  };

  return (
    <div className="app">
      <div className="grid">
        {cards.map((card, index) => (
          <TaskCard
            key={card._id}
            index={index}
            task={card}
            onDescriptionChange={handleDescriptionChange}
          />
        ))}

        <CreateCard fetchUser={fetchUser} />
      </div>
    </div>
  );
};

export default App;
