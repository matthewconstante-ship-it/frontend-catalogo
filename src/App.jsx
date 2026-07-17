import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Artistas from './pages/Artistas';
import Albumes from './pages/Albumes'; // <-- NUEVA IMPORTACIÓN

function App() {
  return (
    <BrowserRouter>
      <CssBaseline /> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/artistas" element={<Artistas />} />
        <Route path="/albumes" element={<Albumes />} /> {/* <-- NUEVA RUTA */}
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;