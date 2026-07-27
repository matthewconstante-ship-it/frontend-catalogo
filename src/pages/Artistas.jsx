import { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField, InputAdornment, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';

import PageTransition from '../components/PageTransition'; 
import MiniRadio from '../components/MiniRadio';
import ArtistaCard from '../components/cards/ArtistaCard';
import ArtistaFormModal from '../components/modals/ArtistaFormModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import Loader from '../components/Loader';
import api from '../services/api'; 
import './Artistas.css'; 

const Artistas = () => {
    const [artistas, setArtistas] = useState([]);
    const [busqueda, setBusqueda] = useState(''); 
    const [loading, setLoading] = useState(true);
    
    // Estados para Modales
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

    const handleOpenForm = (modo, artista = null) => {
        setModalMode(modo);
        setFormData(modo === 'editar' && artista ? artista : { id: null, nombre: '', genero: '', biografia: '', foto: null });
        setOpenModal(true);
    };

    const handleOpenDelete = (artista) => {
        setFormData(artista);
        setOpenDeleteModal(true);
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
        // Solo adjunta la foto si es un archivo nuevo y no una URL
        if (formData.foto instanceof File) {
            dataToSend.append('foto', formData.foto);
        }

        try {
            if (modalMode === 'crear') {
                const response = await api.post('artistas/', dataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
                setArtistas([...artistas, response.data]);
                setSnackbar({ open: true, message: 'Artista creado con éxito', severity: 'success' });
            } else {
                // AQUÍ USAMOS PATCH PARA NO BORRAR IMÁGENES
                const response = await api.patch(`artistas/${formData.id}/`, dataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
                setArtistas(artistas.map(a => (a.id === formData.id ? response.data : a)));
                setSnackbar({ open: true, message: 'Artista actualizado con éxito', severity: 'success' });
            }
            setOpenModal(false);
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
                            fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
                            background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #2563eb 100%)' : 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)',
                            backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
                            display: 'inline-block', transform: 'translateZ(0)', willChange: 'transform, opacity'
                        })}
                    >
                        Tus Artistas Favoritos 
                    </Typography>
                    <Button variant="contained" className="btn-nuevo-artista" startIcon={<AddIcon />} onClick={() => handleOpenForm('crear')}>
                        Nuevo Artista
                    </Button>
                </Box>

                <Box className="search-box">
                    <TextField className="custom-search-input" fullWidth variant="outlined" placeholder="Buscar por nombre, género o biografía..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} InputProps={{ startAdornment: ( <InputAdornment position="start"><SearchIcon className="search-icon" /></InputAdornment>) }} />
                </Box>

                {loading ? (
                    <Loader />
                ) : (
                    <Box className="cards-grid">
                        {artistasFiltrados.map((a) => (
                            <ArtistaCard key={a.id} artista={a} onEdit={() => handleOpenForm('editar', a)} onDelete={() => handleOpenDelete(a)} />
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

            <ArtistaFormModal open={openModal} onClose={() => setOpenModal(false)} onSave={handleSave} formData={formData} setFormData={setFormData} modalMode={modalMode} />
            <ConfirmDeleteModal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} onConfirm={handleDelete} title="Confirmar eliminación" itemName={formData.nombre} />

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" className="custom-alert">{snackbar.message}</Alert>
            </Snackbar>
        </PageTransition>
    );
};

export default Artistas;