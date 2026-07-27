import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isArtistas = location.pathname.includes('/artistas');
  const isAlbumes = location.pathname.includes('/albumes');
  const isRadio = location.pathname.includes('/radio');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} className="navbar-glass">
      <Toolbar className="navbar-toolbar">
        {/* Branding */}
        <Box className="navbar-brand" onClick={() => navigate('/artistas')}>
          <LibraryMusicIcon className="navbar-logo-icon" />
          <Typography variant="h6" className="navbar-title">
            MeloVerse
          </Typography>
        </Box>

        {/* NAVEGADOR SLIDER DESLIZANTE (3 opciones) */}
        <div className="radio-group">
          <div className="slider"></div>
          <div className="radio-option">
            <input
              type="radio"
              id="nav-artistas"
              name="navbar-switch"
              checked={isArtistas}
              onChange={() => navigate('/artistas')}
            />
            <label htmlFor="nav-artistas" className="radio-label">
              Artistas
            </label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="nav-albumes"
              name="navbar-switch"
              checked={isAlbumes}
              onChange={() => navigate('/albumes')}
            />
            <label htmlFor="nav-albumes" className="radio-label">
              Álbumes
            </label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="nav-radio"
              name="navbar-switch"
              checked={isRadio}
              onChange={() => navigate('/radio')}
            />
            <label htmlFor="nav-radio" className="radio-label">
              Radio
            </label>
          </div>
        </div>

        {/* Acciones Derecha */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto' }}>
          <ThemeToggle />
          
          <button onClick={handleLogout} className="logout-btn-glass">
            <span>Cerrar Sesión</span>
            <LogoutOutlinedIcon className="logout-btn-icon" />
          </button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;