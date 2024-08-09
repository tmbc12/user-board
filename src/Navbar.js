import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const Navbar = ({ onHistoryClick }) => {
  return (
    <AppBar
      position="static"
      className="navbar"
      sx={{
        backgroundColor: '#000', // Black background
        color: '#fff',           // White text color
        boxShadow: 'none',       // Remove box shadow for a cleaner look
        borderBottom: '2px solid #fff', // Optional white border at the bottom
      }}
    >
      <Toolbar className="navbar-toolbar">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`} // Path to the logo in the public folder
            alt="Logo"
            style={{ width: '40px', height: '40px', marginRight: '8px' }} // Adjust size and spacing
          />
          <Typography
            variant="h6"
            className="navbar-title"
            sx={{
              flexGrow: 1, // Use flexGrow for alignment
              color: '#fff', // White text color
            }}
          >
            Work Tracker
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onHistoryClick}
          sx={{
            transition: 'none', // Remove hover and click animations
            '&:hover': {
              backgroundColor: 'transparent', // Ensure no background color on hover
            },
            '&:active': {
              backgroundColor: 'transparent', // Ensure no background color on click
            },
            '&:focus': {
              outline: 'none', // Remove focus outline if needed
              backgroundColor: 'transparent', // Ensure no background color on focus
            },
          }}
        >
          <HistoryIcon sx={{ color: 'white' }} />
          <Typography
            variant="body1"
            className="navbar-history-text"
            sx={{
              marginLeft: 1,
              color: '#fff', // White text color for history label
            }}
          >
            History
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
