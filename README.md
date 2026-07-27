# 🎵 Frontend Catálogo Musical - MeloVerse (React + Vite)

## 📖 Descripción General

Esta aplicación frontend es la interfaz de usuario para la plataforma **MeloVerse** (proyecto integrador `catalogo_musical`). Construida con **React** y empaquetada con **Vite**, ofrece una experiencia de usuario fluida, moderna y altamente interactiva para la gestión de un catálogo musical profesional. 

El proyecto destaca por su diseño **Glassmorphism**, transiciones suaves entre páginas, un innovador reproductor de radio global y una mascota animada interactiva en la pantalla de inicio de sesión. Todo esto se comunica de forma segura con el backend Django a través de una arquitectura basada en tokens OAuth 2.0, permitiendo gestionar Artistas, Álbumes y escuchar las transmisiones en vivo.

---

## ✨ Características Principales

*   **Diseño UI/UX Premium (Glassmorphism):** Interfaces modernas con desenfoque de fondo (blur), orbes animados de gradiente líquido y una paleta de colores neón adaptativa.
*   **Modo Oscuro/Claro (Theme Toggle):** Integración nativa de temas dinámicos mediante `ThemeContext` y Material UI, con un interruptor animado personalizado (Sol/Luna).
*   **Reproductor de Radio Global (`MiniRadio`):** Un widget flotante estilo cristal que se mantiene en pantalla a través de las rutas, consumiendo el catálogo de streaming (canciones servidas desde el backend, incluyendo directorios como `musica_radio`).
*   **Mascota Animada Interactiva:** Pantalla de login única protagonizada por una rana animada en SVG que reacciona a los inputs del usuario (sigue la longitud del texto, se tapa los ojos al escribir la contraseña y anima su carga).
*   **Autenticación Segura OAuth 2.0:** Gestión de acceso mediante interceptores de **Axios** que inyectan automáticamente el Bearer Token en todas las peticiones a rutas protegidas.
*   **Transiciones Fluidas:** Cambio de páginas animado utilizando `framer-motion` para una experiencia tipo SPA sin parpadeos.
*   **Rutas Protegidas:** Componente `ProtectedRoute` que restringe el acceso al dashboard y redirige automáticamente a los usuarios no autenticados al login.

---

## 🛠️ Tecnologías Utilizadas

*   **Core:** React 18, Vite (Fast Hot Module Replacement)
*   **Enrutamiento:** React Router DOM v6
*   **Estilos y UI:** Material UI (MUI) v5, CSS3 Custom Properties, Glassmorphism
*   **Peticiones HTTP:** Axios (configurado con Interceptors)
*   **Animaciones:** Framer Motion (Page transitions), CSS Keyframes
*   **Tipografía:** Google Fonts ('Montserrat' para títulos, 'Outfit' para cuerpo)

---

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura modular y escalable, separando claramente componentes de presentación, páginas, lógica de estado y servicios HTTP:

```text
/FRONTEND-CATALOGO
├── /src
│   ├── /assets                 # Recursos estáticos (imágenes, iconos, vectores)
│   ├── /components             # Componentes reutilizables
│   │   ├── /cards              # Tarjetas UI (AlbumCard.jsx, ArtistaCard.jsx)
│   │   ├── /modals             # Modales CRUD (AlbumFormModal, ConfirmDeleteModal, etc.)
│   │   ├── AnimatedMascot.jsx  # Mascota interactiva del Login
│   │   ├── Loader.jsx          # Spinner/Animación de carga global
│   │   ├── MiniRadio.jsx       # Reproductor de música global
│   │   ├── Navbar.jsx          # Barra de navegación superior
│   │   ├── PageTransition.jsx  # Wrapper de animaciones de Framer Motion
│   │   ├── ProtectedRoute.jsx  # HOC para protección de rutas privadas
│   │   └── ThemeToggle.jsx     # Switcher de Modo Oscuro/Claro
│   ├── /context                # Contextos globales de React (ThemeContext.jsx)
│   ├── /pages                  # Vistas principales (Albumes.jsx, Artistas.jsx, Login.jsx)
│   ├── /services               # Lógica de conexión externa (api.js con interceptores)
│   ├── App.jsx                 # Configuración de Layout y Rutas raíz
│   ├── main.jsx                # Punto de entrada de React y Providers
│   └── theme.js                # Configuración global del tema de Material UI
├── .env                        # Variables de entorno locales
├── eslint.config.js            # Configuración de linting
├── index.html                  # Plantilla HTML principal
├── package.json                # Dependencias y scripts
└── vite.config.js              # Configuración del bundler Vite
```

---

## 🔌 Rutas y Navegación

| Ruta Front-end | Tipo | Descripción |
| :--- | :--- | :--- |
| `/login` | Pública | Pantalla de inicio de sesión OAuth 2.0 con mascota interactiva. |
| `/artistas` | Privada | Dashboard principal. Gestión CRUD completa de los Artistas. |
| `/albumes` | Privada | Gestión CRUD de Álbumes asociados a sus respectivos Artistas. |
| `/*` | Fallback | Redirección automática a `/artistas` (o `/login` si no hay sesión). |

---

## 🔐 Seguridad e Interceptores (Axios)

Toda la comunicación con el backend (Django REST Framework) está centralizada en `/src/services/api.js`. Se utiliza un **Interceptor de Peticiones** para automatizar la seguridad:

```javascript
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Inyección automática
    }
    return config;
});
```
*Si el token expira o es inválido, el backend responderá con código 401/403.*

---

## ⚙️ Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto para enlazar el frontend con la configuración de la aplicación de tu backend:

```env
# Credenciales OAuth 2.0 (Proporcionadas por Django Admin)
VITE_CLIENT_ID=tu_client_id_generado_en_django
VITE_CLIENT_SECRET=tu_client_secret_generado_en_django
```

> **Nota:** La URL base de la API está actualmente fijada en `api.js` como `http://localhost:8000/api/`. Para entornos de producción, se recomienda moverla también al archivo `.env` como `VITE_API_URL`.

---

## 🚀 Requisitos e Instalación

### Requisitos Previos
*   Node.js (v16 o superior recomendado)
*   npm, yarn, o pnpm
*   El backend de Django (`catalogo_musical`) ejecutándose en el puerto 8000.

### Pasos de Instalación

1. **Clonar el repositorio y entrar a la carpeta:**
   ```bash
   git clone <url-del-repositorio-front>
   cd FRONTEND-CATALOGO
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar entorno:**
   Copia las credenciales OAuth 2.0 generadas en tu backend y colócalas en el archivo `.env`.

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   *La aplicación estará disponible típicamente en `http://localhost:5173/`*

5. **Construir para producción (Build):**
   ```bash
   npm run build
   ```
   *Generará los archivos estáticos optimizados en la carpeta `/dist`.*

---

## 🛑 Troubleshooting Común

❌ **Error: "Network Error" o problemas de CORS al iniciar sesión / cargar datos**
*   **Solución:** Asegúrate de que el backend de Django tenga configurado `CORS_ALLOW_ALL_ORIGINS = True` en desarrollo, o que `http://localhost:5173` esté dentro de `CORS_ALLOWED_ORIGINS`.

❌ **Error: 401 Unauthorized recurrente**
*   **Solución:** El token en tu `localStorage` puede haber expirado. Cierra sesión manualmente o limpia el almacenamiento local (F12 > Application > Local Storage > Borrar `access_token`) y vuelve a iniciar sesión. Verifica que el `client_id` y `client_secret` en el `.env` son correctos.

❌ **Las imágenes de portada o fotos de artistas no cargan (Error 404)**
*   **Solución:** El frontend asume que el backend está sirviendo archivos multimedia estáticos. Verifica que el backend tenga configurado correctamente `MEDIA_URL` y que estés ejecutando `python manage.py runserver` en el puerto 8000.

---

**Desarrollado para el proyecto MeloVerse** 🎵
