import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Artistas from './pages/Artistas';
import Albumes from './pages/Albumes';

// --- NUESTRO GUARDIÁN DE SEGURIDAD ---
// Este componente envuelve las rutas que queremos proteger.
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
        // Si no hay token en la memoria, lo pateamos a la pantalla de login
        return <Navigate to="/login" replace />;
    }
    
    // Si sí hay token, lo dejamos ver el componente (children)
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Ruta Pública (Cualquiera puede ver el Login) */}
                <Route path="/login" element={<Login />} />
                
                {/* Rutas Privadas (Protegidas por el Guardián) */}
                <Route 
                    path="/artistas" 
                    element={
                        <ProtectedRoute>
                            <Artistas />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/albumes" 
                    element={
                        <ProtectedRoute>
                            <Albumes />
                        </ProtectedRoute>
                    } 
                />

                {/* Ruta Comodín: Si alguien escribe una URL que no existe (ej. localhost:5173/holamundo)
                    o entra a la raíz (localhost:5173/), lo mandamos a /artistas para que 
                    el Guardián decida qué hacer con él. */}
                <Route path="*" element={<Navigate to="/artistas" replace />} />
            </Routes>
        </Router>
    );
}

export default App;