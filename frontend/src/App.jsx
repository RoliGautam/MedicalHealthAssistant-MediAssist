// Import required libraries
import React, { useState } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Button,
  TextField,
  Modal,
  Tab,
  Tabs,
  Typography,
  CssBaseline,
  Switch,
  FormControlLabel,
} from '@mui/material';

const lightTheme = createTheme({
  typography: {
    fontFamily: 'San Francisco, Arial, sans-serif',
    h3: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6F91',
    },
    background: {
      default: 'linear-gradient(to bottom, #e3f2fd, #ffffff)',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
  },
});

const darkTheme = createTheme({
  typography: lightTheme.typography,
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6F91',
    },
    background: {
      default: 'linear-gradient(to bottom, #2b5876, #4e4376)',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

function App() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null
  );
  const [showModal, setShowModal] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  const handlePredict = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/get_predict?symptoms=${symptoms}`
      );
      setResult(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch prediction. Please try again.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClose = () => setShowModal(false);

  const handleDarkModeToggle = () => setDarkMode((prev) => !prev);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          width:'200vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // justifyContent: 'center',
          p: 2,
          backgroundImage: darkMode
            ? 'linear-gradient(to bottom, #2b5876, #4e4376)'
            : 'linear-gradient(to bottom, #e3f2fd, #ffffff)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h5" color="primary">
          MediAssist
          </Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
            label="Dark Mode"
          />
        </Box>
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            textAlign: 'center',
            p: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: darkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="h3" gutterBottom>
          Health Care Assistant
          </Typography>
          <TextField
            fullWidth
            label="Enter Symptoms"
            placeholder="e.g., itching, skin rash, nodal skin eruptions"
            variant="outlined"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            sx={{ mb: 3, input: { color: darkMode ? '#fff' : '#000' } }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handlePredict}
            sx={{
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Predict
          </Button>
        </Box>

        <Modal
          open={showModal}
          onClose={handleClose}
          aria-labelledby="result-modal-title"
          aria-describedby="result-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              animation: 'fadeIn 0.5s ease',




            }}
          >
            <Typography
              id="result-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ textAlign: 'center', mb: 2 }}
            >
              {/* Prediction Result */}
              See the summary of your health
            </Typography>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Prediction Tabs"
              centered
              sx={{
                '& .MuiTab-root': {
                  color: darkMode ? '#FF6F91' : '#4CAF50',
                },
                '& .Mui-selected': {
                  color: darkMode ? '#FF4081' : '#388E3C',
                  fontWeight: 'bold',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: darkMode ? '#FF4081' : '#388E3C',
                },
              }}
            >
              <Tab label="Diet" />
              <Tab label="Medications" />
              <Tab label="Precautions" />
              <Tab label="Workout" />
            </Tabs>
            <Box sx={{ mt: 2 }}>
              {tabValue === 0 && (
                // Jaha result.diet hai uski jagah result.diet[0]
                <Typography>
                  <ul>
                    {result?.diet?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Typography>
              )}
              {tabValue === 1 && (
                <Typography>
                  <ul>
                    {result?.medications?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Typography>
              )}
              {tabValue === 2 && (
                <Typography>
                  <ul>
                    {result?.precautions?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Typography>
              )}
              {tabValue === 3 && (
                <Typography>
                  <ul>
                    {result?.workout?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Typography>
              )}
            </Box>
            <Typography sx={{ mt: 2 }}>
              <strong>Predicted Disease:</strong> {result?.predicted_disease}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClose}
              sx={{ mt: 2, mx: 'auto', display: 'block' }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default App;
