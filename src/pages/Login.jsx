import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, TextField, Button, Alert, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import PageTransition from '../components/PageTransition';
import AnimatedMascot from '../components/AnimatedMascot';
import { AUTH_URL } from '../services/api';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Estados para la animación y carga
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Limpiamos errores anteriores si los hay
        
        const loginData = new FormData();
        loginData.append('username', formData.username);
        loginData.append('password', formData.password);
        loginData.append('grant_type', 'password');
        
        // Variables de entorno para mayor seguridad
        loginData.append('client_id', import.meta.env.VITE_CLIENT_ID); 
        loginData.append('client_secret', import.meta.env.VITE_CLIENT_SECRET);

        try {
            const response = await axios.post(AUTH_URL, loginData);
            localStorage.setItem('access_token', response.data.access_token);
            navigate('/artistas');
        } catch (err) {
            console.error(err);
            setError('Error al iniciar sesión. Verifica tus credenciales.');
            setIsLoading(false); // Detenemos la animación si hay error
        }
    };

    return (
        <PageTransition>
            <div className="login-page-wrapper">
                <div className="login-form-container">
                    
                    {/* Componente Modularizado de la Ranita */}
                    <AnimatedMascot 
                        isUsernameFocused={isUsernameFocused}
                        isPasswordFocused={isPasswordFocused}
                        showPassword={showPassword}
                        usernameLength={formData.username.length}
                        isLoading={isLoading}
                    />

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
                            className="custom-mui-input"
                            fullWidth
                            placeholder="Nombre de usuario"
                            variant="outlined"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            onFocus={() => setIsUsernameFocused(true)}
                            onBlur={() => setIsUsernameFocused(false)}
                            disabled={isLoading}
                            sx={{ mb: 3 }}
                        />
                        
                        <div style={{ position: 'relative', width: '100%', marginBottom: '32px' }}>
                            <TextField
                                className="custom-mui-input"
                                fullWidth
                                placeholder="Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                disabled={isLoading}
                                InputProps={{
                                    sx: { paddingRight: '48px' } 
                                }}
                            />
                            
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={(e) => e.preventDefault()}
                                disabled={isLoading}
                                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#ffffff', zIndex: 100 }}
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </div>
                        
                        <Button 
                            className="btn-guardar" 
                            type="submit" 
                            variant="contained" 
                            fullWidth 
                            size="large" 
                            disabled={isLoading}
                            sx={{ mb: 1 }}
                        >
                            {isLoading ? 'Autenticando...' : 'Entrar'}
                        </Button>
                    </form>
                </div>
            </div>
        </PageTransition>
    );
};

export default Login;