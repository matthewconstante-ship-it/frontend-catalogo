import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import PageTransition from '../components/PageTransition';
import { AUTH_URL } from '../services/api';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const loginData = new FormData();
        loginData.append('username', formData.username);
        loginData.append('password', formData.password);
        loginData.append('grant_type', 'password');
        
        // Usando variables de entorno desde .env
        loginData.append('client_id', import.meta.env.VITE_CLIENT_ID); 
        loginData.append('client_secret', import.meta.env.VITE_CLIENT_SECRET);

        try {
            const response = await axios.post(AUTH_URL, loginData);
            
            // Guardamos el token
            localStorage.setItem('access_token', response.data.access_token);
            
            navigate('/artistas');
        } catch (err) {
            console.error(err);
            setError('Error al iniciar sesión. Verifica tus credenciales.');
        }
    };

    return (
        <PageTransition>
            <div className="login-page-wrapper">
                <div className="login-form-container">
                    <Typography variant="h4" className="login-title">
                        Bienvenido
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Nombre de usuario"
                            variant="outlined"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Contraseña"
                            type="password"
                            variant="outlined"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        
                        <Button 
                            className="login-button"
                            type="submit"
                            variant="contained" 
                            fullWidth
                            size="large"
                        >
                            Entrar
                        </Button>
                    </form>
                </div>
            </div>
        </PageTransition>
    );
};

export default Login;