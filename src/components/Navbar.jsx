import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Borramos el token simulado y regresamos al login
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    🎵 Catálogo Musical
                </Typography>
                <Box>
                    <Button color="inherit" onClick={() => navigate('/artistas')}>
                        Artistas
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/albumes')}>
                        Álbumes
                    </Button>
                    <Button color="error" variant="contained" sx={{ ml: 2 }} onClick={handleLogout}>
                        Salir
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;