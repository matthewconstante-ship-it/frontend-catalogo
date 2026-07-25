import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Importaciones de Material UI
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* CssBaseline resetea los estilos por defecto del navegador e inyecta el background oscuro */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)