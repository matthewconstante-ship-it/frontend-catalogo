import { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, MenuItem, InputAdornment,
    Snackbar, Alert, CircularProgress, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';

import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition'; 
import api from '../services/api'; 
import './Albumes.css'; 

const Albumes = () => {
    const [albumes, setAlbumes] = useState([]);
    const [artistasDisponibles, setArtistasDisponibles] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('crear');
    const [formData, setFormData] = useState({ id: null, titulo: '', fecha_lanzamiento: '', artista: '' });
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

    const handleOpen = (modo, album = null) => {
        setModalMode(modo);
        setFormData(modo === 'editar' && album ? album : { id: null, titulo: '', fecha_lanzamiento: '', artista: '' });
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
        try {
            if (modalMode === 'crear') {
                const response = await api.post('albumes/', formData);
                setAlbumes([...albumes, response.data]);
                setSnackbar({ open: true, message: 'Álbum creado con éxito', severity: 'success' });
            } else {
                const response = await api.put(`albumes/${formData.id}/`, formData);
                setAlbumes(albumes.map(a => (a.id === formData.id ? response.data : a)));
                setSnackbar({ open: true, message: 'Álbum actualizado con éxito', severity: 'success' });
            }
            handleClose();
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
            <Navbar />
            <Container maxWidth="lg" className="albumes-page">
                <Box className="albumes-header">
                    <Typography variant="h4" component="h1" className="albumes-title">
                        Gestión de Álbumes
                    </Typography>
                    <Button 
                        variant="contained" 
                        className="btn-nuevo-album"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen('crear')}
                    >
                        Nuevo Álbum
                    </Button>
                </Box>

                <Box className="search-box">
                    <TextField
                        className="custom-search-input"
                        fullWidth 
                        variant="outlined" 
                        placeholder="Buscar por título o artista..."
                        value={busqueda} 
                        onChange={(e) => setBusqueda(e.target.value)}
                        InputProps={{ 
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="search-icon" />
                                </InputAdornment>
                            ) 
                        }}
                    />
                </Box>

                {loading ? (
                    <Box className="loading-container">
                        <CircularProgress className="loading-spinner" />
                    </Box>
                ) : (
                    <TableContainer component={Paper} elevation={0} className="custom-table-container">
                        <Table>
                            <TableHead className="custom-table-head">
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Título</TableCell>
                                    <TableCell>Lanzamiento</TableCell>
                                    <TableCell>Artista</TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {albumesFiltrados.map((a) => (
                                    <TableRow key={a.id} className="custom-table-row">
                                        <TableCell className="custom-table-cell cell-id">{a.id}</TableCell>
                                        <TableCell className="custom-table-cell cell-main">{a.titulo}</TableCell>
                                        <TableCell className="custom-table-cell">{a.fecha_lanzamiento}</TableCell>
                                        <TableCell className="custom-table-cell">{getNombreArtista(a.artista)}</TableCell>
                                        <TableCell align="right" className="custom-table-cell">
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleOpen('editar', a)}
                                                className="btn-action-edit"
                                                title="Editar"
                                            >
                                                <EditOutlinedIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => { setFormData(a); setOpenDeleteModal(true); }}
                                                className="btn-action-delete"
                                                title="Eliminar"
                                            >
                                                <DeleteOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {/* ESTADO VACÍO (EMPTY STATE) */}
                                {albumesFiltrados.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" className="empty-state-cell">
                                            <Box className="empty-state-container">
                                                <AlbumOutlinedIcon className="empty-state-icon" />
                                                <Typography variant="h6" className="empty-state-title">
                                                    No hay álbumes a la vista
                                                </Typography>
                                                <Typography variant="body2" className="empty-state-subtitle">
                                                    Intenta con otra búsqueda o agrega un nuevo álbum al catálogo.
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            {/* MODAL CREAR / EDITAR */}
            <Dialog 
                open={openModal} 
                onClose={handleClose} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{ className: 'custom-dialog-paper' }}
            >
                <DialogTitle className="dialog-title">
                    {modalMode === 'crear' ? 'Registrar Nuevo Álbum' : 'Editar Álbum'}
                </DialogTitle>
                <DialogContent>
                    <TextField 
                        className="custom-dialog-input"
                        fullWidth 
                        margin="dense" 
                        label="Título" 
                        value={formData.titulo || ''} 
                        onChange={(e) => setFormData({...formData, titulo: e.target.value})} 
                    />
                    <TextField 
                        className="custom-dialog-input"
                        fullWidth 
                        margin="dense" 
                        label="Fecha de Lanzamiento" 
                        type="date" 
                        InputLabelProps={{ shrink: true }} 
                        value={formData.fecha_lanzamiento ? formData.fecha_lanzamiento.split('T')[0] : ''} 
                        onChange={(e) => setFormData({...formData, fecha_lanzamiento: e.target.value})} 
                    />
                    <TextField 
                        select 
                        className="custom-dialog-input"
                        fullWidth 
                        margin="dense" 
                        label="Artista" 
                        value={formData.artista || ''} 
                        onChange={(e) => setFormData({...formData, artista: e.target.value})}
                    >
                        {artistasDisponibles.map((a) => <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>)}
                    </TextField>
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={handleClose} className="btn-cancelar">Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" className="btn-guardar">Guardar</Button>
                </DialogActions>
            </Dialog>

            {/* MODAL ELIMINAR */}
            <Dialog 
                open={openDeleteModal} 
                onClose={() => setOpenDeleteModal(false)}
                PaperProps={{ className: 'custom-dialog-paper' }}
            >
                <DialogTitle className="dialog-title text-danger">Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <Typography className="dialog-text">
                        ¿Seguro que deseas eliminar el álbum <strong>{formData.titulo}</strong> del catálogo? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={() => setOpenDeleteModal(false)} className="btn-cancelar">Cancelar</Button>
                    <Button variant="contained" onClick={handleDelete} className="btn-eliminar-modal">Eliminar</Button>
                </DialogActions>
            </Dialog>

            {/* SNACKBAR */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" className="custom-alert">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </PageTransition>
    );
};

export default Albumes;