import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Limpiamos el token de acceso local
        localStorage.removeItem('access_token');
        // Redirigimos al inicio de sesión
        navigate('/login');
    };

    return (
        <AppBar position="sticky" elevation={0} className="navbar-glass">
            <Toolbar className="navbar-toolbar">
                {/* 1. Branding / Logo */}
                <Box className="navbar-brand">
                    <LibraryMusicIcon className="navbar-logo-icon" />
                    <Typography variant="h6" className="navbar-title">
                        MeloVerse
                    </Typography>
                </Box>

                {/* 2. Enlaces de navegación centrales */}
                <Box className="navbar-links">
                    <NavLink 
                        to="/artistas" 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                    >
                        Artistas
                    </NavLink>
                    <NavLink 
                        to="/albumes" 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                    >
                        Álbumes
                    </NavLink>
                </Box>

                {/* 3. Acción de Salida */}
                <Button 
                    onClick={handleLogout} 
                    className="logout-button"
                    endIcon={<LogoutOutlinedIcon />}
                    variant="outlined"
                >
                    Cerrar Sesión
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;