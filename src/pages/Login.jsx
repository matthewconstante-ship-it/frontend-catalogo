import { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AUTH_URL } from '../services/api';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // LLAVES REALES DE TU BACKEND LOCAL
        const CLIENT_ID = 'qxjtinrXCp2JtCLmBhsyFw14JfqmbONSlTc322lf';
        const CLIENT_SECRET = '8V59oZ3ZHfnB42pQqksTmBJTdHXoMW1DywA7V7plmQFDiDMymGu1TDhiHW9V75kuJd0g6qqiZjxKOSLaAJPqN0JVp1SS9mFllRmYm0giWh8CUodR5dnzjscL7TDgUbFX';

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
            
            // Guardamos el token real recibido del backend
            localStorage.setItem('access_token', response.data.access_token);
            
            // Redireccionamos a la pantalla principal
            navigate('/artistas');

        } catch (err) {
            console.error(err);
            setError('Credenciales inválidas. Verifica tu usuario y contraseña.');
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