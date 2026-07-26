import { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Box, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, InputAdornment, Snackbar, Alert, Skeleton 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';

import PageTransition from '../components/PageTransition'; 
import MiniRadio from '../components/MiniRadio';
import api from '../services/api'; 
import './Artistas.css'; 

const Artistas = () => {
    const [artistas, setArtistas] = useState([]);
    const [busqueda, setBusqueda] = useState(''); 
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('crear');
    const [formData, setFormData] = useState({ id: null, nombre: '', genero: '', biografia: '', foto: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchArtistas = async () => {
            setLoading(true);
            try {
                const response = await api.get('artistas/');
                if (Array.isArray(response.data)) setArtistas(response.data);
                else if (response.data.results) setArtistas(response.data.results);
            } catch (error) {
                console.error(error);
                setSnackbar({ open: true, message: 'Error al cargar los artistas', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchArtistas();
    }, []);

    const handleOpen = (modo, artista = null) => {
        setModalMode(modo);
        setFormData(modo === 'editar' && artista ? artista : { id: null, nombre: '', genero: '', biografia: '', foto: null });
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setOpenDeleteModal(false);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSave = async () => {
        const dataToSend = new FormData();
        dataToSend.append('nombre', formData.nombre);
        dataToSend.append('genero', formData.genero);
        dataToSend.append('biografia', formData.biografia);
        
        if (formData.foto instanceof File) {
            dataToSend.append('foto', formData.foto);
        }

        try {
            if (modalMode === 'crear') {
                const response = await api.post('artistas/', dataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setArtistas([...artistas, response.data]);
                setSnackbar({ open: true, message: 'Artista creado con éxito', severity: 'success' });
            } else {
                const response = await api.put(`artistas/${formData.id}/`, dataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setArtistas(artistas.map(a => (a.id === formData.id ? response.data : a)));
                setSnackbar({ open: true, message: 'Artista actualizado con éxito', severity: 'success' });
            }
            handleClose();
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Error al guardar el artista', severity: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`artistas/${formData.id}/`);
            setArtistas(artistas.filter(a => a.id !== formData.id));
            setSnackbar({ open: true, message: 'Artista eliminado', severity: 'info' });
            setOpenDeleteModal(false);
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' });
        }
    };

    const artistasFiltrados = artistas.filter((a) => 
        (a.nombre && a.nombre.toLowerCase().includes(busqueda.toLowerCase())) || 
        (a.genero && a.genero.toLowerCase().includes(busqueda.toLowerCase())) ||
        (a.biografia && a.biografia.toLowerCase().includes(busqueda.toLowerCase()))
    );

    return (
        <PageTransition>
            <MiniRadio />

            <Container maxWidth="lg" className="artistas-page">
                <Box className="artistas-header">
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        sx={(theme) => ({
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 800,
                            background: theme.palette.mode === 'dark' 
                                ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #2563eb 100%)'
                                : 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block',
                            transform: 'translateZ(0)',
                            willChange: 'transform, opacity'
                        })}
                    >
                        Tus Artistas Favoritos ✨
                    </Typography>
                    <Button variant="contained" className="btn-nuevo-artista" startIcon={<AddIcon />} onClick={() => handleOpen('crear')}>
                        Nuevo Artista
                    </Button>
                </Box>

                <Box className="search-box">
                    <TextField className="custom-search-input" fullWidth variant="outlined" placeholder="Buscar por nombre, género o biografía..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} InputProps={{ startAdornment: ( <InputAdornment position="start"><SearchIcon className="search-icon" /></InputAdornment>) }} />
                </Box>

                {loading ? (
                    <Box className="cards-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} variant="rectangular" width={260} height={320} sx={{ borderRadius: '1rem', bgcolor: 'rgba(255,255,255,0.05)' }} />
                        ))}
                    </Box>
                ) : (
                    <Box className="cards-grid">
                        {artistasFiltrados.map((a) => (
                            <div key={a.id} className="uiverse-card">
                                <div className="card-bg-base">
                                    <div className="card-bg-inner"></div>
                                </div>

                                <div className="card-vinyl-container">
                                    {a.foto ? (
                                        <>
                                            <img src={a.foto} className="card-vinyl-image" alt={a.nombre} />
                                            <div className="card-vinyl-hole"></div>
                                        </>
                                    ) : (
                                        <div className="card-vinyl-gradient">
                                            <div className="card-vinyl-hole"></div>
                                        </div>
                                    )}
                                </div>

                                <div className="card-content-overlay">
                                    <div className="card-text-box">
                                        <span className="card-title">{a.nombre}</span>
                                        <span className="card-subtitle">{a.biografia || 'Sin biografía'}</span>
                                        <div className="card-bottom-text">
                                            <span>ID: {a.id}</span>
                                        </div>
                                    </div>

                                    <div className="card-actions-col">
                                        <div className="card-tags-container">
                                            <span className="card-tag">{a.genero || 'Varios'}</span>
                                            <span className="card-tag-label">Género</span>
                                        </div>

                                        <div className="card-actions-buttons">
                                            <button className="card-action-btn edit" onClick={() => handleOpen('editar', a)} title="Editar">
                                                <EditOutlinedIcon fontSize="small" />
                                            </button>
                                            <button className="card-action-btn delete" onClick={() => { setFormData(a); setOpenDeleteModal(true); }} title="Eliminar">
                                                <DeleteOutlinedIcon fontSize="small" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {artistasFiltrados.length === 0 && (
                            <Box className="empty-state-full-width">
                                <Box className="empty-state-container">
                                    <LibraryMusicOutlinedIcon className="empty-state-icon" />
                                    <Typography variant="h6" className="empty-state-title">No hay artistas a la vista</Typography>
                                    <Typography variant="body2" className="empty-state-subtitle">Intenta con otra búsqueda o agrega un nuevo artista al catálogo.</Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </Container>

            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ className: 'custom-dialog-paper' }}>
                <DialogTitle className="dialog-title">{modalMode === 'crear' ? 'Registrar Nuevo Artista' : 'Editar Artista'}</DialogTitle>
                <DialogContent>
                    <TextField className="custom-dialog-input" fullWidth margin="dense" label="Nombre" value={formData.nombre || ''} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                    <TextField className="custom-dialog-input" fullWidth margin="dense" label="Género" value={formData.genero || ''} onChange={(e) => setFormData({...formData, genero: e.target.value})} />
                    <TextField className="custom-dialog-input" fullWidth margin="dense" label="Biografía" multiline rows={3} value={formData.biografia || ''} onChange={(e) => setFormData({...formData, biografia: e.target.value})} />
                    
                    <Button variant="outlined" component="label" fullWidth sx={{ mt: 2, mb: 1, borderColor: 'rgba(255, 255, 255, 0.2)', color: '#9ca3af', textTransform: 'none', borderRadius: '8px', '&:hover': { borderColor: '#7c3aed', color: '#fff', backgroundColor: 'rgba(124, 58, 237, 0.05)' } }}>
                        {formData.foto ? 'Cambiar Fotografía' : 'Subir Fotografía'}
                        <input type="file" hidden accept="image/*" onChange={(e) => setFormData({...formData, foto: e.target.files[0]})} />
                    </Button>
                    {formData.foto && (
                        <Typography variant="caption" sx={{ color: '#a855f7', display: 'block', textAlign: 'center', fontWeight: 600 }}>
                            {typeof formData.foto === 'string' ? '✓ Fotografía actual cargada' : `✓ ${formData.foto.name}`}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={handleClose} className="btn-cancelar">Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" className="btn-guardar">Guardar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} PaperProps={{ className: 'custom-dialog-paper' }}>
                <DialogTitle className="dialog-title text-danger">Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <Typography className="dialog-text">¿Seguro que deseas eliminar a <strong>{formData.nombre}</strong> del catálogo?</Typography>
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={() => setOpenDeleteModal(false)} className="btn-cancelar">Cancelar</Button>
                    <Button variant="contained" onClick={handleDelete} className="btn-eliminar-modal">Eliminar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" className="custom-alert">{snackbar.message}</Alert>
            </Snackbar>
        </PageTransition>
    );
};

export default Artistas;