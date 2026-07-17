import axios from 'axios';

// 1. Configuramos la URL base donde vive la API de tu amigo
export const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

// 2. Guardamos la URL específica para el Login (OAuth 2.0)
export const AUTH_URL = 'http://localhost:8000/o/token/';

// 3. El Interceptor: Nuestro "Guardia de Seguridad"
// Antes de enviar CUALQUIER petición al backend, este código se ejecuta automáticamente
api.interceptors.request.use((config) => {
    // Busca si tenemos guardado el "pase VIP" (el Token) en la memoria del navegador
    const token = localStorage.getItem('access_token');
    
    if (token) {
        // Si existe, se lo pega a la petición para que Django nos deje pasar
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});