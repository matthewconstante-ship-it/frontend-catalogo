import { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';
import { AUTH_URL } from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Estas credenciales las llenaremos cuando tu amigo termine su parte del backend
        const CLIENT_ID = 'PENDIENTE';
        const CLIENT_SECRET = 'PENDIENTE';

        // OAuth 2.0 exige este formato específico (URL Encoded)
        const data = new URLSearchParams();
        data.append('grant_type', 'password');
        data.append('username', username);
        data.append('password', password);
        data.append('client_id', CLIENT_ID);
        data.append('client_secret', CLIENT_SECRET);

        try {
            const response = await axios.post(AUTH_URL, data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            
            // Guardamos el token recibido
            localStorage.setItem('access_token', response.data.access_token);
            alert("¡Login exitoso! Ya tienes tu Token de acceso.");
            
            // Más adelante activaremos esta redirección
            // window.location.href = '/artistas';

        } catch (err) {
            console.error(err);
            setError('Credenciales inválidas o el backend aún no está conectado.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    🎵 Catálogo Musical
                </Typography>
                
                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

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
                        Iniciar Sesión
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;