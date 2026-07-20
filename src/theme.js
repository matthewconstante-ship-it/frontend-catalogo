import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c3aed',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#0f0f1a',
      paper: 'rgba(21, 21, 34, 0.6)',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
  },
  typography: {
   fontFamily: '"Outfit", "Poppins", sans-serif',
    h4: { 
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800, 
      letterSpacing: '-0.5px'
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.5px'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          background: 'rgba(21, 21, 34, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          textTransform: 'none',
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8b5cf6, #2563eb)',
            boxShadow: '0 6px 25px rgba(124, 58, 237, 0.6)',
            transform: 'translateY(-2px)',
          }
        }
      },
    },
    // Estilo global para todos los TextFields (inputs, buscadores, fechas, selects)
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: 'rgba(21, 21, 34, 0.4)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(124, 58, 237, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7c3aed',
              boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#9ca3af',
            '&.Mui-focused': {
              color: '#7c3aed',
            },
          },
        },
      },
    },
    // Estilo global para las ventanas modales
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '24px',
          background: '#1a1a2e',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        },
      },
    },
    // Estilo global para los menús desplegables (como el selector de artista en álbumes)
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          backgroundColor: '#1a1a2e',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        },
      },
    },
  }
});