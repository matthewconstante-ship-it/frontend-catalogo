import axios from 'axios';

// URL base para el CRUD (la que configuró tu amigo con el Router)
export const API_URL = 'http://localhost:8000/api/';

// URL específica para pedir el token de seguridad
export const AUTH_URL = 'http://localhost:8000/o/token/';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor: Antes de que salga cualquier petición, le pegamos el token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ¡ESTA ES LA LÍNEA MÁGICA QUE TE FALTABA!
export default api;