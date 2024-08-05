import React, { useState } from 'react';
import { Container, Grid, ThemeProvider } from '@mui/material';
import TaskCard from './TaskCard';
import HistoryPopup from './HistoryPopup';
import Navbar from './Navbar';
import theme from './theme'; // Import the theme
import './App.css'; // Ensure this import is present

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : Array(6).fill({ name: '', description: '', time: 0 });
  });

  const updateTask = (index, updatedTask) => {
    const newTasks = [...tasks];
    newTasks[index] = updatedTask;
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Navbar onHistoryClick={() => setHistoryOpen(true)} />
      <Container className="container">
        <Grid container spacing={3}>
          {tasks.map((task, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <TaskCard
                task={task}
                onUpdate={(updatedTask) => updateTask(index, updatedTask)}
              />
            </Grid>
          ))}
        </Grid>
        <HistoryPopup open={historyOpen} onClose={() => setHistoryOpen(false)} />
      </Container>
    </ThemeProvider>
  );
};

export default App;
