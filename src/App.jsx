import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Artistas from './pages/Artistas';
import Albumes from './pages/Albumes';
import Radio from './pages/Radio';
import Navbar from './components/Navbar';
import MiniRadio from './components/MiniRadio';
import ProtectedRoute from './components/ProtectedRoute';

// Layout principal que mantiene la Navbar y la Radio fijas sin parpadeos
const AppLayout = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <>
            {/* Fondo líquido animado de orbes */}
            <div className="fluid-bg-container">
                <div className="fluid-orb orb-1"></div>
                <div className="fluid-orb orb-2"></div>
                <div className="fluid-orb orb-3"></div>
            </div>

            {/* La Navbar y la Radio se mantienen SIEMPRE montadas y globales */}
            {!isLoginPage && <Navbar />}
            {!isLoginPage && <MiniRadio />}

            {/* Rutas de la aplicación */}
            <Routes>
                <Route path="/login" element={<Login />} />
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
                <Route 
                    path="/radio" 
                    element={
                        <ProtectedRoute>
                            <Radio />
                        </ProtectedRoute>
                    } 
                />
                <Route path="*" element={<Navigate to="/artistas" replace />} />
            </Routes>
        </>
    );
};

function App() {
    return (
        <Router>
            <AppLayout />
        </Router>
    );
}

export default App;