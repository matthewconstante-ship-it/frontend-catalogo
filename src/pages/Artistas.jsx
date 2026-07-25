import { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, InputAdornment, 
    Snackbar, Alert, IconButton, Skeleton // <-- Añadido Skeleton aquí
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';

import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition'; 
import api from '../services/api'; 
import './Artistas.css'; 

const Artistas = () => {
    const [artistas, setArtistas] = useState([]);
    const [busqueda, setBusqueda] = useState(''); 
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('crear');
    const [formData, setFormData] = useState({ id: null, nombre: '', genero: '', biografia: '' });
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
        setFormData(modo === 'editar' && artista ? artista : { id: null, nombre: '', genero: '', biografia: '' });
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
                const response = await api.post('artistas/', formData);
                setArtistas([...artistas, response.data]);
                setSnackbar({ open: true, message: 'Artista creado con éxito', severity: 'success' });
            } else {
                const response = await api.put(`artistas/${formData.id}/`, formData);
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
            <Navbar />
            <Container maxWidth="lg" className="artistas-page">
                <Box className="artistas-header">
                    <Typography variant="h4" component="h1" className="artistas-title">
                        Gestión de Artistas
                    </Typography>
                    <Button 
                        variant="contained" 
                        className="btn-nuevo-artista"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen('crear')}
                    >
                        Nuevo Artista
                    </Button>
                </Box>

                <Box className="search-box">
                    <TextField
                        className="custom-search-input"
                        fullWidth 
                        variant="outlined" 
                        placeholder="Buscar por nombre, género o biografía..."
                        value={busqueda} 
                        onChange={(e) => setBusqueda(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="search-icon" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* TABLA PREMIUM CON SKELETONS DE CARGA */}
                <TableContainer component={Paper} elevation={0} className="custom-table-container">
                    <Table>
                        <TableHead className="custom-table-head">
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Género</TableCell>
                                <TableCell>Biografía</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                // Renderizamos 4 filas falsas (Skeletons) mientras carga
                                [1, 2, 3, 4].map((item) => (
                                    <TableRow key={item} className="custom-table-row">
                                        <TableCell className="custom-table-cell"><Skeleton variant="text" width={30} /></TableCell>
                                        <TableCell className="custom-table-cell"><Skeleton variant="text" width={120} /></TableCell>
                                        <TableCell className="custom-table-cell"><Skeleton variant="text" width={90} /></TableCell>
                                        <TableCell className="custom-table-cell"><Skeleton variant="text" width={200} /></TableCell>
                                        <TableCell align="right" className="custom-table-cell">
                                            <Skeleton variant="circular" width={30} height={30} sx={{ display: 'inline-block', mr: 1, bgcolor: 'rgba(255,255,255,0.08)' }} />
                                            <Skeleton variant="circular" width={30} height={30} sx={{ display: 'inline-block', bgcolor: 'rgba(255,255,255,0.08)' }} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                artistasFiltrados.map((a) => (
                                    <TableRow key={a.id} className="custom-table-row">
                                        <TableCell className="custom-table-cell cell-id">{a.id}</TableCell>
                                        <TableCell className="custom-table-cell cell-main">{a.nombre}</TableCell>
                                        <TableCell className="custom-table-cell">{a.genero}</TableCell>
                                        <TableCell className="custom-table-cell bio-cell">
                                            {a.biografia || <span className="empty-text">Sin biografía</span>}
                                        </TableCell>
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
                                ))
                            )}
                            
                            {!loading && artistasFiltrados.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" className="empty-state-cell">
                                        <Box className="empty-state-container">
                                            <LibraryMusicOutlinedIcon className="empty-state-icon" />
                                            <Typography variant="h6" className="empty-state-title">
                                                No hay artistas a la vista
                                            </Typography>
                                            <Typography variant="body2" className="empty-state-subtitle">
                                                Intenta con otra búsqueda o agrega un nuevo artista al catálogo.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            {/* MODALES Y SNACKBAR (Sin cambios, idénticos a los que ya tienes) */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ className: 'custom-dialog-paper' }}>
                <DialogTitle className="dialog-title">{modalMode === 'crear' ? 'Registrar Nuevo Artista' : 'Editar Artista'}</DialogTitle>
                <DialogContent>
                    <TextField className="custom-dialog-input" fullWidth margin="dense" label="Nombre" value={formData.nombre || ''} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                    <TextField className="custom-dialog-input" fullWidth margin="dense" label="Género" value={formData.genero || ''} onChange={(e) => setFormData({...formData, genero: e.target.value})} />
                    <TextField className="custom-dialog-input" fullWidth margin="dense" label="Biografía" multiline rows={3} value={formData.biografia || ''} onChange={(e) => setFormData({...formData, biografia: e.target.value})} />
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