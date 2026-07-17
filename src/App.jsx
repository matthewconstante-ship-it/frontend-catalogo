import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      {/* CssBaseline limpia los estilos por defecto del navegador para que Material UI luzca perfecto */}
      <CssBaseline /> 
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Si alguien entra a la raíz '/', lo mandamos automáticamente al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;