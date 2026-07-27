import { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, Box, TextField, InputAdornment, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';

import PageTransition from '../components/PageTransition'; 
import RadioCard from '../components/cards/RadioCard';
import RadioFormModal from '../components/modals/RadioFormModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import Loader from '../components/Loader';
import api from '../services/api'; 
import './Artistas.css'; 

const Radio = () => {
    const [tracks, setTracks] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('crear');
    const [formData, setFormData] = useState({ id: null, titulo: '', artista: '', archivo_audio: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchTracks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('radio/');
            setTracks(Array.isArray(response.data) ? response.data : response.data.results);
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Error al cargar la radio', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, []); 

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTracks();
    }, [fetchTracks]);

    const handlePlayTrack = (track) => {
        window.dispatchEvent(new CustomEvent('playSpecificTrack', { detail: track.id }));
    };

    const handleOpenForm = (modo, track = null) => {
        setModalMode(modo);
        setFormData(modo === 'editar' && track ? track : { id: null, titulo: '', artista: '', archivo_audio: null });
        setOpenModal(true);
    };

    const handleOpenDelete = (track) => {
        setFormData(track);
        setOpenDeleteModal(true);
    };

    const handleSave = async () => {
        const dataToSend = new FormData();
        dataToSend.append('titulo', formData.titulo);
        dataToSend.append('artista', formData.artista);
        
        if (formData.archivo_audio instanceof File) {
            dataToSend.append('archivo_audio', formData.archivo_audio);
        }

        try {
            if (modalMode === 'crear') {
                await api.post('radio/', dataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
                setSnackbar({ open: true, message: 'Canción subida con éxito', severity: 'success' });
            } else {
                await api.patch(`radio/${formData.id}/`, dataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
                setSnackbar({ open: true, message: 'Canción actualizada', severity: 'success' });
            }
            fetchTracks();
            setOpenModal(false);
            window.dispatchEvent(new Event('radioUpdated'));
        } catch (error) {
            console.error(error); 
            setSnackbar({ open: true, message: 'Error al guardar', severity: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`radio/${formData.id}/`);
            fetchTracks();
            setSnackbar({ open: true, message: 'Canción eliminada', severity: 'info' });
            setOpenDeleteModal(false);
            window.dispatchEvent(new Event('radioUpdated'));
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' });
        }
    };

    const tracksFiltrados = tracks.filter((t) => 
        t.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
        t.artista.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <PageTransition>
            <Container maxWidth="lg" className="artistas-page">
                <Box className="artistas-header">
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        sx={{ 
                            fontFamily: "'Montserrat', sans-serif", 
                            fontWeight: 800, 
                            background: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)', 
                            backgroundClip: 'text', 
                            WebkitBackgroundClip: 'text', 
                            color: 'transparent', 
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block',
                            transform: 'translateZ(0)', 
                            willChange: 'transform, opacity'
                        }}
                    >
                        Live Radio Stream
                    </Typography>
                    <Button variant="contained" className="btn-nuevo-artista" style={{background: 'linear-gradient(135deg, #10b981, #0ea5e9)'}} startIcon={<AddIcon />} onClick={() => handleOpenForm('crear')}>
                        Subir Canción
                    </Button>
                </Box>

                <Box className="search-box">
                    <TextField className="custom-search-input" fullWidth variant="outlined" placeholder="Buscar pistas en la radio..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} InputProps={{ startAdornment: ( <InputAdornment position="start"><SearchIcon className="search-icon" /></InputAdornment>) }} />
                </Box>

                {loading ? (
                    <Loader />
                ) : (
                    <Box className="cards-grid">
                        {tracksFiltrados.map((t) => (
                            <RadioCard 
                                key={t.id} 
                                track={t} 
                                onPlay={handlePlayTrack} 
                                onEdit={() => handleOpenForm('editar', t)} 
                                onDelete={() => handleOpenDelete(t)} 
                            />
                        ))}

                        {tracksFiltrados.length === 0 && (
                            <Box className="empty-state-full-width">
                                <Box className="empty-state-container">
                                    <GraphicEqIcon className="empty-state-icon" />
                                    <Typography variant="h6" className="empty-state-title">Radio apagada</Typography>
                                    <Typography variant="body2" className="empty-state-subtitle">Sube algunas pistas de audio para empezar a transmitir.</Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </Container>

            <RadioFormModal open={openModal} onClose={() => setOpenModal(false)} onSave={handleSave} formData={formData} setFormData={setFormData} modalMode={modalMode} />
            <ConfirmDeleteModal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} onConfirm={handleDelete} title="Confirmar eliminación" itemName={formData.titulo} />

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open:false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snackbar.severity} variant="filled" className="custom-alert">{snackbar.message}</Alert>
            </Snackbar>
        </PageTransition>
    );
};

export default Radio;