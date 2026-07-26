/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  // Leemos el tema guardado en localStorage o usamos 'dark' por defecto
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('app_theme') || 'dark';
  });

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('app_theme', mode);
    if (mode === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [mode]);

  // Configuración dinámica del tema para Material UI
  const muiTheme = createTheme({
    palette: {
      mode: mode,
      primary: { main: '#ec4899' },
      secondary: { main: '#2563eb' },
      text: {
        primary: mode === 'dark' ? '#f3f4f6' : '#0f172a',
        secondary: mode === 'dark' ? '#9ca3af' : '#475569',
      },
      background: {
        paper: mode === 'dark' ? 'rgba(21, 25, 36, 0.7)' : 'rgba(255, 255, 255, 0.85)',
      },
    },
    typography: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 16 },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);