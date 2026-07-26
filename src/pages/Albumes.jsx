import { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField, InputAdornment, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';

import PageTransition from '../components/PageTransition'; 
import MiniRadio from '../components/MiniRadio';
import AlbumCard from '../components/cards/AlbumCard';
import AlbumFormModal from '../components/modals/AlbumFormModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import Loader from '../components/Loader';
import api from '../services/api'; 
import './Albumes.css'; 

const Albumes = () => {
    const [albumes, setAlbumes] = useState([]);
    const [artistasDisponibles, setArtistasDisponibles] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Estados para Modales
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('crear');
    const [formData, setFormData] = useState({ id: null, titulo: '', fecha_lanzamiento: '', artista: '', portada: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [resAlbumes, resArtistas] = await Promise.all([
                    api.get('albumes/'),
                    api.get('artistas/')
                ]);

                if (Array.isArray(resAlbumes.data)) setAlbumes(resAlbumes.data);
                else if (resAlbumes.data.results) setAlbumes(resAlbumes.data.results);

                if (Array.isArray(resArtistas.data)) setArtistasDisponibles(resArtistas.data);
                else if (resArtistas.data.results) setArtistasDisponibles(resArtistas.data.results);

            } catch (error) {
                console.error(error);
                setSnackbar({ open: true, message: 'Error al cargar los datos', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenForm = (modo, album = null) => {
        setModalMode(modo);
        setFormData(modo === 'editar' && album ? album : { id: null, titulo: '', fecha_lanzamiento: '', artista: '', portada: null });
        setOpenModal(true);
    };

    const handleOpenDelete = (album) => {
        setFormData(album);
        setOpenDeleteModal(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSave = async () => {
        const dataToSend = new FormData();
        dataToSend.append('titulo', formData.titulo);
        dataToSend.append('artista', formData.artista);
        
        if (formData.fecha_lanzamiento) {
            dataToSend.append('fecha_lanzamiento', formData.fecha_lanzamiento.split('T')[0]);
        }
    
        if (formData.portada instanceof File) {
            dataToSend.append('portada', formData.portada);
        }

        try {
            if (modalMode === 'crear') {
                const response = await api.post('albumes/', dataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
                setAlbumes([...albumes, response.data]);
                setSnackbar({ open: true, message: 'Álbum creado con éxito', severity: 'success' });
            } else {
                const response = await api.put(`albumes/${formData.id}/`, dataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
                setAlbumes(albumes.map(a => (a.id === formData.id ? response.data : a)));
                setSnackbar({ open: true, message: 'Álbum actualizado con éxito', severity: 'success' });
            }
            setOpenModal(false);
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Error al guardar el álbum', severity: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`albumes/${formData.id}/`);
            setAlbumes(albumes.filter(a => a.id !== formData.id));
            setSnackbar({ open: true, message: 'Álbum eliminado', severity: 'info' });
            setOpenDeleteModal(false);
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' });
        }
    };

    const getNombreArtista = (idArtista) => {
        const artista = artistasDisponibles.find(a => a.id === idArtista);
        return artista ? artista.nombre : 'Desconocido';
    };

    const albumesFiltrados = albumes.filter((album) => {
        const termino = busqueda.toLowerCase();
        const nombreDelArtista = getNombreArtista(album.artista).toLowerCase();
        return album.titulo.toLowerCase().includes(termino) || nombreDelArtista.includes(termino);
    });

    return (
        <PageTransition>
            <MiniRadio />

            <Container maxWidth="lg" className="albumes-page">
                <Box className="albumes-header">
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        sx={(theme) => ({
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 800,
                            background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #2563eb 100%)' : 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)',
                            backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
                            display: 'inline-block', transform: 'translateZ(0)', willChange: 'transform, opacity'
                        })}
                    >
                        Tus Álbumes Favoritos 
                    </Typography>
                    <Button variant="contained" className="btn-nuevo-album" startIcon={<AddIcon />} onClick={() => handleOpenForm('crear')}>
                        Nuevo Álbum
                    </Button>
                </Box>

                <Box className="search-box">
                    <TextField className="custom-search-input" fullWidth variant="outlined" placeholder="Buscar por título o artista..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} InputProps={{ startAdornment: ( <InputAdornment position="start"><SearchIcon className="search-icon" /></InputAdornment>) }} />
                </Box>

                {loading ? (
                    <Loader />
                ) : (
                    <Box className="cards-grid">
                        {albumesFiltrados.map((a) => (
                            <AlbumCard 
                                key={a.id} 
                                album={a} 
                                nombreArtista={getNombreArtista(a.artista)}
                                onEdit={() => handleOpenForm('editar', a)} 
                                onDelete={() => handleOpenDelete(a)} 
                            />
                        ))}

                        {albumesFiltrados.length === 0 && (
                            <Box className="empty-state-full-width">
                                <Box className="empty-state-container">
                                    <AlbumOutlinedIcon className="empty-state-icon" />
                                    <Typography variant="h6" className="empty-state-title">No hay álbumes a la vista</Typography>
                                    <Typography variant="body2" className="empty-state-subtitle">Intenta con otra búsqueda o agrega un nuevo álbum al catálogo.</Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </Container>

            {/* Modales Modulares */}
            <AlbumFormModal 
                open={openModal} 
                onClose={() => setOpenModal(false)} 
                onSave={handleSave} 
                formData={formData} 
                setFormData={setFormData} 
                modalMode={modalMode} 
                artistasDisponibles={artistasDisponibles} 
            />
            
            <ConfirmDeleteModal 
                open={openDeleteModal} 
                onClose={() => setOpenDeleteModal(false)} 
                onConfirm={handleDelete} 
                title="Confirmar eliminación" 
                itemName={formData.titulo} 
            />

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" className="custom-alert">{snackbar.message}</Alert>
            </Snackbar>
        </PageTransition>
    );
};

export default Albumes;