import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { MusicNote, Logout } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Función para cerrar sesión (respetando tu lógica original)
    const handleLogout = () => {
        // 1. Borramos el token de seguridad de la memoria
        localStorage.removeItem('access_token');
        
        // 2. Expulsamos al usuario de vuelta a la pantalla de Login
        navigate('/login');
    };

    return (
        <AppBar position="sticky" elevation={0} sx={{ mb: 4 }}>
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 }, py: 1.5 }}>
                
                {/* Logo con Nombre Genial */}
                <Box 
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                    onClick={() => navigate('/artistas')}
                >
                    <Box sx={{ 
                        p: 1, 
                        background: 'linear-gradient(135deg, #7c3aed, #ec4899)', 
                        borderRadius: '14px',
                        display: 'flex',
                        boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)'
                    }}>
                        <MusicNote sx={{ color: '#fff', fontSize: '24px' }} />
                    </Box>
                    <Typography 
                        variant="h6" 
                        component="div"
                        sx={{ 
                            fontWeight: 900, 
                            fontFamily: '"Montserrat", sans-serif',
                            background: 'linear-gradient(45deg, #7c3aed, #3b82f6, #ec4899)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.5px',
                            fontSize: '1.4rem'
                        }}
                    >
                        MeloVerse
                    </Typography>
                </Box>

                {/* Enlaces de Navegación y Botón Salir */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 } }}>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate('/artistas')}
                        className={`nav-link-custom ${location.pathname.includes('artistas') ? 'active' : ''}`}
                    >
                        Artistas
                    </Button>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate('/albumes')}
                        className={`nav-link-custom ${location.pathname.includes('albumes') ? 'active' : ''}`}
                    >
                        Álbumes
                    </Button>

                    <Button 
                        variant="outlined" 
                        color="secondary"
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{ 
                            ml: 2,
                            borderRadius: '30px',
                            borderColor: 'rgba(236, 72, 153, 0.5)',
                            color: '#ec4899',
                            px: 3,
                            '&:hover': {
                                borderColor: '#ec4899',
                                background: 'rgba(236, 72, 153, 0.1)',
                                boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    >
                        Cerrar Sesión
                    </Button>
                </Box>

            </Toolbar>
        </AppBar>
    );
};

export default Navbar;