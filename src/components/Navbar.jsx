import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Mantenemos tu archivo de estilos conectado

const Navbar = () => {
    const navigate = useNavigate();

    // Función para cerrar sesión
    const handleLogout = () => {
        // 1. Borramos el token de seguridad de la memoria
        localStorage.removeItem('access_token');
        
        // 2. Expulsamos al usuario de vuelta a la pantalla de Login
        navigate('/login');
    };

    return (
        <AppBar position="static" color="primary" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    🎵 Catálogo Musical
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Botones de navegación interna */}
                    <Button color="inherit" onClick={() => navigate('/artistas')}>
                        Artistas
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/albumes')}>
                        Álbumes
                    </Button>
                    
                    {/* Botón de Cerrar Sesión con un estilo ligeramente distinto para resaltarlo */}
                    <Button 
                        variant="outlined" 
                        color="inherit" 
                        onClick={handleLogout}
                        sx={{ ml: 2, border: '1px solid white' }}
                    >
                        Cerrar Sesión
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;