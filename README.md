# 🎵 Frontend Catálogo Musical

## 📖 Descripción General

Esta aplicación frontend, construida con **React y Vite**, constituye la interfaz principal para la gestión de un catálogo musical. Diseñada como proyecto integrador, la plataforma interactúa en tiempo real con una API RESTful (construida en Django) e implementa un flujo completo de autenticación OAuth 2.0.

El proyecto destaca por su enfoque en una **arquitectura de código limpia y modular**, evitando la complejidad innecesaria (cero *spaghetti code*). A nivel visual, ofrece una experiencia de usuario (UX) inmersiva mediante una interfaz en **modo oscuro** de estilo premium. Utiliza jerarquías visuales claras, *glassmorphism*, gradientes sutiles y animaciones fluidas que emulan los dashboards de las plataformas de streaming musical más reconocidas.

---

## ✨ Características Principales

*   **Gestión de Catálogo (CRUD):** Visualización, creación y edición de **Artistas** y **Álbumes** de forma dinámica.
*   **Autenticación Segura OAuth 2.0:** Sistema completo de Login/Logout, gestión de tokens JWT (almacenamiento local) y protección de rutas.
*   **Integración de API:** Consumo eficiente del backend colaborativo mediante Axios, implementando interceptores para la inyección automática de tokens de autorización.
*   **Navegación Fluida:** Transiciones de página personalizadas y enrutamiento estructurado con React Router.
*   **Diseño UI/UX Moderno:** Tema unificado (`theme.js`) en modo oscuro, componentes altamente reutilizables y estilos modulares.

---

## 🛠️ Tecnologías Utilizadas

*   **Core:** React 18, Vite (Bundler).
*   **Navegación:** React Router DOM.
*   **Peticiones HTTP:** Axios.
*   **Estilos y UI:** Material UI (MUI), CSS nativo modular, animaciones personalizadas.
*   **Autenticación:** OAuth 2.0.

---

## 📂 Estructura del Proyecto

El repositorio sigue una organización modular, separando responsabilidades entre componentes de presentación, vistas, lógica de negocio y configuración:

```text
/FRONTEND-CATALOGO
├── /public
│   ├── favicon.svg
│   └── icons.svg
├── /src
│   ├── /assets                  # Recursos estáticos (imágenes, logos)
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── /components              # Componentes UI reutilizables
│   │   ├── Navbar.css
│   │   ├── Navbar.jsx           # Barra de navegación principal
│   │   └── PageTransition.jsx   # Animaciones entre vistas
│   ├── /pages                   # Vistas principales de la aplicación
│   │   ├── Albumes.css
│   │   ├── Albumes.jsx          # Gestión de álbumes musicales
│   │   ├── Artistas.css
│   │   ├── Artistas.jsx         # Directorio de artistas
│   │   ├── Login.css
│   │   └── Login.jsx            # Portal de autenticación OAuth
│   ├── /services                # Lógica de conexión con el backend
│   │   └── api.js               # Instancia de Axios e interceptores
│   ├── App.css
│   ├── App.jsx                  # Enrutador principal y layout base
│   ├── index.css                # Estilos globales (Variables, Dark Mode)
│   ├── main.jsx                 # Punto de entrada de React
│   └── theme.js                 # Configuración del tema (MUI/Custom)
├── .env                         # Variables de entorno (API Keys, URLs)
├── .gitignore                   # Archivos ignorados por Git
├── eslint.config.js             # Reglas de linter para código limpio
├── index.html                   # Plantilla HTML principal
├── package.json                 # Dependencias y scripts
└── vite.config.js               # Configuración del empaquetador Vite
```

---

## ⚙️ Variables de Entorno (.env)

Para que el proyecto se comunique correctamente con el backend Django, crea un archivo `.env` en la raíz del proyecto basándote en la siguiente estructura:

```env
# URL base de la API colaborativa
VITE_API_BASE_URL=http://localhost:8000
VITE_API_MEDIA_URL=${VITE_API_BASE_URL}/media/

# Credenciales OAuth 2.0 (Proporcionadas por el backend)
VITE_API_CLIENT_ID=tu_client_id_aqui
VITE_API_CLIENT_SECRET=tu_client_secret_aqui
```

---

## 🚀 Requisitos Previos e Instalación

### Requisitos
*   [Node.js](https://nodejs.org/) (v18 o superior) y npm instalados.
*   Servidor backend Django en ejecución.
*   Editor de código recomendado: **VS Code**.

### Pasos para iniciar el entorno de desarrollo

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd frontend-catalogo
   ```

2. **Instalar las dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo Vite:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   La terminal indicará la URL local (por lo general `http://localhost:5173`).

---

## 💻 Comandos Útiles (Scripts)

*   `npm run dev`: Inicia el servidor de desarrollo con Hot Module Replacement (HMR).
*   `npm run build`: Compila la aplicación optimizada para producción dentro de la carpeta `dist`.
*   `npm run lint`: Ejecuta ESLint para asegurar la calidad y organización del código.
*   `npm run preview`: Previsualiza el build de producción localmente.

---

## 🌿 Flujo de Trabajo Git

Comandos básicos para mantener el versionado al día:

```bash
# Verificar el estado de los archivos modificados
git status

# Agregar todos los cambios al área de preparación
git add .

# Realizar un commit descriptivo
git commit -m "feat: integración de vista de artistas y consumos API"

# Enviar los cambios al repositorio remoto
git push
```

---
**Autor:** Matthew Constante