import { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // <-- Importamos la herramienta de redirección

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // <-- La inicializamos

    const handleLogin = (e) => {
        e.preventDefault();
        
        // --- HACK TEMPORAL PARA SALTAR EL LOGIN ---
        // Guardamos un token falso para que la app crea que iniciamos sesión
        localStorage.setItem('access_token', 'token_falso_de_prueba');
        
        // Te enviamos directamente a la pantalla de Artistas
        navigate('/artistas');
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    🎵 Catálogo Musical
                </Typography>

                <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Usuario"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Iniciar Sesión (Modo Prueba)
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;