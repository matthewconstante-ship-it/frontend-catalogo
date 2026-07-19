// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Indigo profesional
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899', // Rosa vibrante para acciones importantes
    },
    background: {
      default: '#f8fafc', // Un gris muy sutil para que no sea un blanco plano
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
  },
  components: {
    // Esto hace que todos tus botones y tablas tengan ese look moderno global
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: '8px', textTransform: 'none', fontWeight: 600 },
      },
    },
  },
});