import React, { useState, useEffect } from 'react';

const Timer = ({ isRunning, onTimeUpdate, initialTime }) => {
  const [seconds, setSeconds] = useState(initialTime);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && seconds !== initialTime) {
      onTimeUpdate(seconds);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds, initialTime, onTimeUpdate]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return <span>{formatTime(seconds)}</span>;
};

export default Timer;
