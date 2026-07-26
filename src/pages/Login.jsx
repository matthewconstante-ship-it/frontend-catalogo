import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, TextField, Button, Alert, IconButton } from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import PageTransition from '../components/PageTransition';
import { AUTH_URL } from '../services/api';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Estados para la animación
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 

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

    const eyeMovement = Math.min(formData.username.length * 1.5, 12);

    return (
        <PageTransition>
            <div className="login-page-wrapper">
                <div className="login-form-container">
                    
                    {/* --- MASCOTA MUSICAL --- */}
                    <div className="mascot-container">
                        <svg viewBox="0 0 120 120" className="mascot-svg">
                            <path d="M 12 60 A 48 48 0 0 1 108 60" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
                            <circle cx="60" cy="60" r="50" fill="#E2E8F0" />
                            
                            <rect x="2" y="40" width="14" height="36" rx="7" fill="#7c3aed" />
                            <rect x="104" y="40" width="14" height="36" rx="7" fill="#7c3aed" />
                            <rect x="0" y="46" width="6" height="24" rx="3" fill="#3b82f6" />
                            <rect x="114" y="46" width="6" height="24" rx="3" fill="#3b82f6" />
                            
                            <g className="eyes">
                                <circle cx="45" cy="50" r="10" fill="#fff" />
                                <circle 
                                    cx="45" cy="50" r="4" fill="#1e1a3a" 
                                    style={{ 
                                        transform: `translate(${isUsernameFocused ? eyeMovement : 0}px, ${isUsernameFocused ? 5 : 0}px)`,
                                        transition: 'transform 0.1s'
                                    }} 
                                />
                                <circle cx="75" cy="50" r="10" fill="#fff" />
                                <circle 
                                    cx="75" cy="50" r="4" fill="#1e1a3a" 
                                    style={{ 
                                        transform: `translate(${isUsernameFocused ? eyeMovement : 0}px, ${isUsernameFocused ? 5 : 0}px)`,
                                        transition: 'transform 0.1s'
                                    }} 
                                />
                            </g>

                            <path 
                                d={isPasswordFocused && !showPassword ? "M 50 75 Q 60 70 70 75" : "M 45 70 Q 60 85 75 70"} 
                                stroke="#1e1a3a" strokeWidth="3" fill="transparent" strokeLinecap="round" 
                                className="mouth"
                            />

                            <g className={`hands ${isPasswordFocused ? (showPassword ? 'peeking' : 'covering') : 'down'}`}>
                                <rect x="25" y="80" width="25" height="35" rx="12" fill="#7c3aed" className="hand hand-left" />
                                <rect x="70" y="80" width="25" height="35" rx="12" fill="#7c3aed" className="hand hand-right" />
                            </g>
                        </svg>
                    </div>

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
                                InputProps={{
                                    sx: { paddingRight: '48px' } 
                                }}
                            />
                            
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={(e) => e.preventDefault()}
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)', 
                                    color: '#ffffff', 
                                    zIndex: 100 
                                }}
                            >
                                {/* AQUÍ ESTÁ LA MAGIA: Iconos invertidos para que coincidan con la animación */}
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </div>
                        
                        <Button 
                            className="btn-guardar"
                            type="submit"
                            variant="contained" 
                            fullWidth
                            size="large"
                            sx={{ mb: 1 }}
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