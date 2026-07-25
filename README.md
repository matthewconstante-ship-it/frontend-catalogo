# 🎵 Catálogo Musical - Frontend (React + Vite)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BA5?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

Este repositorio contiene la interfaz de usuario (Frontend) para la aplicación web Full-Stack de **Catálogo Musical**. Diseñado con un enfoque en la experiencia de usuario (UX), presenta una estética moderna en modo oscuro, inspirada en plataformas premium de streaming de música, utilizando efectos de *glassmorphism* y transiciones fluidas.

Este proyecto interactúa con una API REST construida en Django (Backend) y utiliza **OAuth 2.0** para la autenticación y protección de rutas.

---

## 🚀 Características Principales

*   **Autenticación Segura:** Flujo de login implementado con tokens OAuth 2.0 (almacenamiento y envío en cabeceras `Authorization: Bearer`).
*   **CRUD Completo:** Interfaz intuitiva para Crear, Leer, Actualizar y Eliminar registros de Artistas y Álbumes.
*   **Diseño Premium:** Interfaz en *Dark Mode* con jerarquía visual clara, elementos modulares y animaciones de entrada.
*   **Arquitectura Limpia:** Código altamente organizado, utilizando componentes funcionales y Hooks de React, evitando por completo el "código espagueti".

---

## 🛠️ Tecnologías y Librerías Utilizadas

*   **[React 18](https://react.dev/):** Librería principal para la construcción de interfaces de usuario mediante componentes.
*   **[Vite](https://vitejs.dev/):** Herramienta de construcción (bundler) extremadamente rápida, utilizada para inicializar y compilar el proyecto.
*   **[Material-UI (MUI)](https://mui.com/):** Framework de componentes de UI que proporciona el sistema de diseño base, botones, modales y la iconografía (`@mui/icons-material`).
*   **[Axios](https://axios-http.com/):** Cliente HTTP basado en promesas para consumir la API de Django e interceptar tokens.
*   **[Framer Motion](https://www.framer.com/motion/):** Librería de animaciones declarativas para React.
*   **[React Router DOM](https://reactrouter.com/):** Enrutamiento del lado del cliente (Single Page Application).

---

## 📂 Estructura del Proyecto

```text
frontend-catalogo/
├── public/                 # Archivos estáticos públicos (favicon, etc.)
├── src/                    # Código fuente principal
│   ├── api/                # Configuración de Axios e interceptores (OAuth 2.0)
│   ├── components/         # Componentes reutilizables (Botones, Tarjetas, Formularios)
│   ├── pages/              # Vistas principales (Login, Dashboard, Catálogo)
│   ├── App.jsx             # Componente raíz y configuración de Rutas
│   └── main.jsx            # Punto de entrada de React
├── .env.example            # Ejemplo de variables de entorno
├── index.html              # Plantilla HTML principal
├── package.json            # Dependencias y scripts del proyecto
└── vite.config.js          # Configuración del servidor y build de Vite
```

---

## ⚙️ Guía de Despliegue Local (Paso a Paso)

Esta guía está diseñada para que cualquier persona pueda ejecutar el proyecto desde cero.

### 1. Prerrequisitos
Antes de empezar, asegúrate de tener instalado en tu computadora:
*   **Node.js** (Versión 18 o superior). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
*   **Git** (Opcional, para clonar el repositorio).

*Para verificar que tienes Node.js instalado, abre tu terminal y ejecuta:*
```bash
node -v
npm -v
```

### 2. Instalación
1. Abre tu terminal y navega hasta la carpeta donde deseas guardar el proyecto.
2. Extrae o clona el código fuente en una carpeta llamada `frontend-catalogo`.
3. Entra a la carpeta del proyecto:
   ```bash
   cd frontend-catalogo
   ```
4. Instala todas las dependencias necesarias leyendo el archivo `package.json`:
   ```bash
   npm install
   ```

### 3. Configuración de Variables de Entorno
El proyecto necesita saber dónde se encuentra el Backend (Django) para hacer las peticiones.
1. En la raíz del proyecto (junto a `package.json`), crea un archivo llamado exactamente `.env`.
2. Abre el archivo `.env` y añade la siguiente línea (ajusta el puerto si tu backend en Django corre en otro distinto):
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/
   ```

### 4. Ejecución en Modo Desarrollo
Para levantar el servidor de pruebas con recarga rápida (Hot Module Replacement):
```bash
npm run dev
```
La terminal te mostrará una dirección local, generalmente `http://localhost:5173`. Haz clic (o cópiala) para abrir la aplicación en tu navegador.

*(Nota: Para que la aplicación funcione al 100%, asegúrate de que el Backend de Django también esté ejecutándose al mismo tiempo).*

---

## 💻 Comandos Utilizados para Crear el Proyecto

Si te preguntas cómo se inicializó y construyó este entorno, aquí está el historial de comandos ejecutados durante la fase de desarrollo:

**1. Inicialización del proyecto con Vite:**
```bash
npm create vite@latest frontend-catalogo -- --template react
cd frontend-catalogo
```

**2. Instalación de dependencias core (MUI, Axios, Router, Animaciones):**
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install axios
npm install react-router-dom
npm install framer-motion
```

---

## 📦 Construcción para Producción

Cuando el proyecto esté listo para ser subido a un servidor real (como Vercel, Netlify o AWS), se debe generar la versión optimizada:

**1. Generar los archivos estáticos de producción:**
```bash
npm run build
```
*(Esto creará una carpeta `dist/` con el código minificado, listo para producción).*

**2. Previsualizar la versión de producción localmente:**
```bash
npm run preview
```

---

**Desarrollado por:** Matthew Constante