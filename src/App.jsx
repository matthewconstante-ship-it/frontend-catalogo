import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Artistas from './pages/Artistas';
import Albumes from './pages/Albumes';
import Navbar from './components/Navbar';

// Guardián de rutas protegidas
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Layout principal que mantiene la Navbar fija sin parpadeos
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

            {/* La Navbar se mantiene SIEMPRE montada y fija fuera del cambio de rutas */}
            {!isLoginPage && <Navbar />}

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