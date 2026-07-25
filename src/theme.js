import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0B0D14', // Fondo principal ultra oscuro
      paper: '#151924',   // Fondo de las tarjetas/tablas ligeramente más claro
    },
    primary: {
      main: '#8B5CF6',    // Violeta vibrante (como tu logo)
    },
    secondary: {
      main: '#3B82F6',    // Azul eléctrico para acentos
    },
    text: {
      primary: '#F3F4F6', // Texto principal casi blanco
      secondary: '#9CA3AF', // Texto secundario (titulares de tablas) en gris
    },
  },
  typography: {
    fontFamily: '"Inter", "Plus Jakarta Sans", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none', // Quita el "TODO MAYÚSCULAS" de los botones
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12, // Bordes más suaves y modernos
  },
  components: {
    // Estilos globales para los botones
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to right, #8B5CF6, #3B82F6)',
          color: '#fff',
          boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)',
          },
        },
      },
    },
    // Estilos globales para crear el efecto Glassmorphism en tarjetas
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', 
          backgroundColor: 'rgba(21, 25, 36, 0.6)', // Fondo translúcido
          backdropFilter: 'blur(16px)', // Desenfoque de cristal
          border: '1px solid rgba(255, 255, 255, 0.05)', // Borde sutil
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        },
      },
    },
    // Estilos para quitar los bordes duros de las tablas
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          color: '#9CA3AF',
          letterSpacing: '0.5px',
        },
      },
    },
  },
});

export default theme;