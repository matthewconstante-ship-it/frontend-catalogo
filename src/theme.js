import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'transparent',
      paper: 'rgba(15, 18, 30, 0.65)',
    },
    primary: {
      main: '#EC4899', // Rosa/Magenta neón principal
    },
    secondary: {
      main: '#2563EB', // Azul eléctrico
    },
    accent: {
      main: '#F97316', // Naranja encendido
    },
    text: {
      primary: '#F3F4F6',
      secondary: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #2563EB 100%)',
          color: '#ffffff',
          fontWeight: 700,
          boxShadow: '0 4px 20px rgba(236, 72, 153, 0.35)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #F97316 0%, #EC4899 50%, #8B5CF6 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 25px rgba(249, 115, 22, 0.5)',
          },
        },
      },
    },
  },
});

export default theme;