import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, TextField, Button, Alert, InputAdornment } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

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
        
        loginData.append('client_id', import.meta.env.VITE_CLIENT_ID); 
        loginData.append('client_secret', import.meta.env.VITE_CLIENT_SECRET);

        try {
            const response = await axios.post(AUTH_URL, loginData);
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
                        MeloVerse
                    </Typography>

                    {error && (
                        <Alert severity="error" className="login-alert">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        <TextField
                            className="custom-mui-input margin-bottom-normal"
                            fullWidth
                            placeholder="Nombre de usuario"
                            variant="outlined"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleOutlinedIcon className="custom-input-icon" />
                                    </InputAdornment>
                                )
                            }}
                        />
                        
                        <TextField
                            className="custom-mui-input margin-bottom-large"
                            fullWidth
                            placeholder="Contraseña"
                            type="password"
                            variant="outlined"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon className="custom-input-icon" />
                                    </InputAdornment>
                                )
                            }}
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