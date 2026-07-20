import { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, MenuItem, DialogContentText, InputAdornment,
    Snackbar, Alert, CircularProgress, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition'; 
import api from '../services/api'; 
import './Albumes.css'; 

const Albumes = () => {
    // 1. Estados
    const [albumes, setAlbumes] = useState([]);
    const [artistasDisponibles, setArtistasDisponibles] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('crear');
    const [formData, setFormData] = useState({ id: null, titulo: '', fecha_lanzamiento: '', artista: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // 2. Carga de datos
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

    // 3. Funciones de control
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

    // 4. Acciones CRUD
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

    // 5. Lógica de filtro
    const albumesFiltrados = albumes.filter((album) => {
        const termino = busqueda.toLowerCase();
        const nombreDelArtista = getNombreArtista(album.artista).toLowerCase();
        return album.titulo.toLowerCase().includes(termino) || nombreDelArtista.includes(termino);
    });

    return (
        <PageTransition>
            <Navbar />
            <Container maxWidth="lg" className="albumes-page">
                {/* Cabecera y Botón Nuevo */}
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

                {/* Buscador Moderno */}
                <Box className="search-box">
                    <TextField
                        fullWidth 
                        variant="outlined" 
                        placeholder="Buscar por título o artista..."
                        value={busqueda} 
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="search-input"
                        InputProps={{ 
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#9ca3af' }} />
                                </InputAdornment>
                            ) 
                        }}
                    />
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                        <CircularProgress sx={{ color: '#7c3aed' }} />
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
                                        <TableCell className="custom-table-cell">{a.id}</TableCell>
                                        <TableCell className="custom-table-cell custom-table-cell-main">{a.titulo}</TableCell>
                                        <TableCell className="custom-table-cell">{a.fecha_lanzamiento}</TableCell>
                                        <TableCell className="custom-table-cell">{getNombreArtista(a.artista)}</TableCell>
                                        <TableCell align="right" className="custom-table-cell">
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleOpen('editar', a)}
                                                className="btn-action-edit"
                                                title="Editar"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => { setFormData(a); setOpenDeleteModal(true); }}
                                                className="btn-action-delete"
                                                title="Eliminar"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {albumesFiltrados.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                                            No se encontraron álbumes
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            {/* Modales */}
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
                        fullWidth 
                        margin="dense" 
                        label="Título" 
                        value={formData.titulo || ''} 
                        onChange={(e) => setFormData({...formData, titulo: e.target.value})} 
                        className="dialog-input"
                        sx={{ mt: 2 }}
                    />
                    <TextField 
                        fullWidth 
                        margin="dense" 
                        label="Fecha de Lanzamiento" 
                        type="date" 
                        InputLabelProps={{ shrink: true }} 
                        value={formData.fecha_lanzamiento ? formData.fecha_lanzamiento.split('T')[0] : ''} 
                        onChange={(e) => setFormData({...formData, fecha_lanzamiento: e.target.value})} 
                        className="dialog-input"
                        sx={{ mt: 2 }}
                    />
                    <TextField 
                        select 
                        fullWidth 
                        margin="dense" 
                        label="Artista" 
                        value={formData.artista || ''} 
                        onChange={(e) => setFormData({...formData, artista: e.target.value})}
                        className="dialog-input"
                        sx={{ mt: 2 }}
                    >
                        {artistasDisponibles.map((a) => <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>)}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} sx={{ color: '#9ca3af', '&:hover': { color: '#fff' } }}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" className="btn-guardar">Guardar</Button>
                </DialogActions>
            </Dialog>

            <Dialog 
                open={openDeleteModal} 
                onClose={() => setOpenDeleteModal(false)}
                PaperProps={{ className: 'custom-dialog-paper' }}
            >
                <DialogTitle className="dialog-title">¿Confirmar eliminación?</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#9ca3af' }}>¿Seguro que deseas eliminar este álbum del catálogo?</DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDeleteModal(false)} sx={{ color: '#9ca3af' }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleDelete} className="btn-eliminar-modal">Eliminar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </PageTransition>
    );
};

export default Albumes;