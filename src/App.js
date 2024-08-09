import React, { useState,useContext } from "react";
import { Container, Grid, ThemeProvider } from "@mui/material";
import TaskCard from "./TaskCard";
import HistoryPopup from "./HistoryPopup";
import Navbar from "./Navbar";
import theme from "./theme"; // Import the theme
import "./App.css"; // Ensure this import is present
import MyProvider from "./context/UserProvider";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MyContext from './context/UserContext';
import Loader from "./components/Loader";


const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? JSON.parse(savedTasks)
      : Array(6).fill({ name: "", description: "", time: 0 });
  });

  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <MyProvider>
      <AppContent tasks={tasks} historyOpen={historyOpen} setHistoryOpen={setHistoryOpen} />
    </MyProvider>
  );
};

const AppContent = ({ tasks, historyOpen, setHistoryOpen }) => {
  const { open, setOpen, snackbarDescription, severity } = useContext(MyContext);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Loader />
      <Navbar onHistoryClick={() => setHistoryOpen(true)} />
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarDescription}
        </Alert>
      </Snackbar>
      <Container className="container">
        <TaskCard />
        <HistoryPopup
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
        />
      </Container>
    </ThemeProvider>
  );
};

export default App;
