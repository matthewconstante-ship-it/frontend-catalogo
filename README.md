# 🎵 Frontend Catálogo Musical - MeloVerse (React + Vite)

## 📖 Descripción General

Esta aplicación frontend es la interfaz de usuario para la plataforma **MeloVerse** (proyecto integrador `catalogo_musical`). Construida con **React** y empaquetada con **Vite**, ofrece una experiencia de usuario fluida, moderna y altamente interactiva para la gestión de un catálogo musical profesional. 

El proyecto destaca por su diseño **Glassmorphism**, transiciones suaves entre páginas, un innovador reproductor de radio global y una mascota animada interactiva en la pantalla de inicio de sesión. Todo esto se comunica de forma segura con el backend Django a través de una arquitectura basada en tokens OAuth 2.0, permitiendo gestionar Artistas, Álbumes y escuchar las transmisiones en vivo.

---

## ✨ Características Principales

*   **Diseño UI/UX Premium (Glassmorphism):** Interfaces modernas con desenfoque de fondo (blur), orbes animados de gradiente líquido y una paleta de colores neón adaptativa.
*   **Modo Oscuro/Claro (Theme Toggle):** Integración nativa de temas dinámicos mediante `ThemeContext` y Material UI, con un interruptor animado personalizado (Sol/Luna) que guarda la preferencia en el `localStorage`.
*   **Gestión de Radio en Vivo:** Nueva página dedicada a la administración de pistas de audio (`Radio.jsx`), permitiendo subir, editar, eliminar y reproducir canciones directamente mediante tarjetas interactivas.
*   **Reproductor de Radio Global (`MiniRadio`):** Un widget flotante estilo cristal que se mantiene en pantalla a través de las rutas, consumiendo el catálogo de streaming y reaccionando a eventos globales de reproducción.
*   **Mascota Animada Interactiva:** Pantalla de login única protagonizada por una rana animada en SVG que reacciona a los inputs del usuario (sigue la longitud del texto, se tapa los ojos al escribir la contraseña y anima su carga).
*   **Autenticación Segura OAuth 2.0:** Gestión de acceso mediante interceptores de **Axios** que inyectan automáticamente el Bearer Token en todas las peticiones a rutas protegidas.
*   **Transiciones Fluidas:** Cambio de páginas animado utilizando `framer-motion` para una experiencia tipo SPA sin parpadeos.

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

El proyecto sigue una arquitectura modular y escalable, separando claramente componentes de presentación, páginas, lógica de estado y servicios HTTP, tal como se refleja en el árbol principal:

```text
/FRONTEND-CATALOGO
├── /node_modules
├── /public
├── /src
│   ├── /assets                 # Recursos estáticos (imágenes, iconos, vectores)
│   ├── /components             # Componentes reutilizables
│   │   ├── /cards              # Tarjetas UI (AlbumCard.jsx, ArtistaCard.jsx, RadioCard.jsx)
│   │   ├── /modals             # Modales CRUD (AlbumFormModal.jsx, ArtistaFormModal.jsx, ConfirmDeleteModal.jsx, RadioFormModal.jsx)
│   │   ├── AnimatedMascot.jsx  # Mascota interactiva del Login
│   │   ├── Loader.css          # Estilos del Spinner de carga global
│   │   ├── Loader.jsx          # Componente Spinner/Animación
│   │   ├── MiniRadio.css       # Estilos del reproductor global
│   │   ├── MiniRadio.jsx       # Reproductor de música global flotante
│   │   ├── Navbar.css          # Estilos de la barra de navegación
│   │   ├── Navbar.jsx          # Barra de navegación superior
│   │   ├── PageTransition.jsx  # Wrapper de animaciones de Framer Motion
│   │   ├── ProtectedRoute.jsx  # HOC para protección de rutas privadas
│   │   ├── ThemeToggle.css     # Animaciones del switch Sol/Luna
│   │   └── ThemeToggle.jsx     # Switcher de Modo Oscuro/Claro
│   ├── /context                # Contextos globales de React
│   │   └── ThemeContext.jsx    # Proveedor de estado para el tema (Dark/Light)
│   ├── /pages                  # Vistas principales
│   │   ├── Albumes.css / .jsx  # Gestión de Álbumes
│   │   ├── Artistas.css / .jsx # Dashboard principal de Artistas
│   │   ├── Login.css / .jsx    # Autenticación de usuarios
│   │   └── Radio.jsx           # Gestión de pistas para transmisión
│   ├── /services               
│   │   └── api.js              # Configuración de Axios e Interceptores
│   ├── App.css                 # Estilos globales y animaciones de fondo
│   ├── App.jsx                 # Configuración de Layout y Rutas raíz
│   ├── index.css               # Reset de CSS y variables base
│   ├── main.jsx                # Punto de entrada de React y Providers
│   └── theme.js                # Configuración de la paleta de Material UI
├── .env                        # Variables de entorno locales
├── .gitignore                  # Archivos ignorados por Git
├── eslint.config.js            # Configuración de linting
├── index.html                  # Plantilla HTML principal
├── package-lock.json           # Árbol de dependencias exactas
├── package.json                # Dependencias y scripts
├── README.md                   # Documentación del proyecto
└── vite.config.js              # Configuración del bundler Vite
```

---

## 🔌 Rutas y Navegación

El enrutamiento está protegido y centralizado. Estas son las vistas principales configuradas en el proyecto:

| Ruta Front-end | Tipo | Descripción |
| :--- | :--- | :--- |
| `/login` | Pública | Pantalla de inicio de sesión OAuth 2.0 con mascota animada que valida el acceso. |
| `/artistas` | Privada | Dashboard principal. Gestión CRUD completa del catálogo de Artistas. |
| `/albumes` | Privada | Gestión CRUD de Álbumes, enlazados dinámicamente con los Artistas disponibles. |
| `/radio` | Privada | Carga y gestión de archivos MP3 para la transmisión en la `MiniRadio` flotante. |
| `/*` | Fallback | Redirección automática a `/artistas` (o `/login` si no hay token de sesión activo). |

---

## 🔐 Seguridad e Interceptores (Axios)

Toda la comunicación con el backend (Django REST Framework) está centralizada en `/src/services/api.js`. Se utiliza un **Interceptor de Peticiones** para automatizar la seguridad:

```javascript
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Inyección automática
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
```
*Si el token no existe, el componente `<ProtectedRoute/>` intercepta la navegación y devuelve al usuario al `/login`.*

---

## ⚙️ Variables de Entorno (.env)

El proyecto utiliza variables de entorno para proteger los secretos de la aplicación. Crea un archivo `.env` en la raíz con la siguiente estructura:

```env
# Credenciales OAuth 2.0 (Proporcionadas por el backend Django)
VITE_CLIENT_ID=tu_client_id_generado_en_django
VITE_CLIENT_SECRET=tu_client_secret_generado_en_django
```

> **Nota:** La URL base de la API está actualmente fijada en `api.js` como `http://localhost:8000/api/` y `http://localhost:8000/o/token/` para la autenticación.

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
   Asegúrate de configurar el archivo `.env` con las claves de OAuth 2.0 correspondientes.

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

**Desarrollado para el proyecto MeloVerse** 🎵