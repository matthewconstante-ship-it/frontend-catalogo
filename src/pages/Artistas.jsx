import { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, InputAdornment, 
    Snackbar, Alert, CircularProgress, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition'; 
import api from '../services/api'; 
import './Artistas.css'; 

const Artistas = () => {
    // 1. Estados
    const [artistas, setArtistas] = useState([]);
    const [busqueda, setBusqueda] = useState(''); 
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('crear');
    const [formData, setFormData] = useState({ id: null, nombre: '', genero: '', biografia: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // 2. Carga de datos
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

    // 3. Funciones de control
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

    // 4. Acciones CRUD
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

    // 5. Lógica de filtro
    const artistasFiltrados = artistas.filter((a) => 
        (a.nombre && a.nombre.toLowerCase().includes(busqueda.toLowerCase())) || 
        (a.genero && a.genero.toLowerCase().includes(busqueda.toLowerCase())) ||
        (a.biografia && a.biografia.toLowerCase().includes(busqueda.toLowerCase()))
    );

    return (
        <PageTransition>
            <Navbar />
            <Container maxWidth="lg" className="artistas-page">
                {/* Cabecera y Botón Nuevo */}
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

                {/* Buscador Moderno */}
                <Box className="search-box">
                    <TextField
                        fullWidth 
                        variant="outlined" 
                        placeholder="Buscar por nombre, género o biografía..."
                        value={busqueda} 
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="search-input"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#9ca3af' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Tabla de Artistas */}
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
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Género</TableCell>
                                    <TableCell>Biografía</TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {artistasFiltrados.map((a) => (
                                    <TableRow key={a.id} className="custom-table-row">
                                        <TableCell className="custom-table-cell">{a.id}</TableCell>
                                        <TableCell className="custom-table-cell custom-table-cell-main">{a.nombre}</TableCell>
                                        <TableCell className="custom-table-cell">{a.genero}</TableCell>
                                        <TableCell className="custom-table-cell" sx={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {a.biografia || <span style={{ color: '#6b7280', fontStyle: 'italic' }}>Sin biografía</span>}
                                        </TableCell>
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
                                {artistasFiltrados.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                                            No se encontraron artistas
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            {/* Modales y Notificaciones */}
            <Dialog 
                open={openModal} 
                onClose={handleClose} 
                maxWidth="sm" 
                fullWidth 
                PaperProps={{ className: 'custom-dialog-paper' }}
            >
                <DialogTitle className="dialog-title">
                    {modalMode === 'crear' ? 'Registrar Nuevo Artista' : 'Editar Artista'}
                </DialogTitle>
                <DialogContent>
                    <TextField 
                        fullWidth 
                        margin="dense" 
                        label="Nombre" 
                        value={formData.nombre || ''} 
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                        className="dialog-input"
                        sx={{ mt: 2 }}
                    />
                    <TextField 
                        fullWidth 
                        margin="dense" 
                        label="Género" 
                        value={formData.genero || ''} 
                        onChange={(e) => setFormData({...formData, genero: e.target.value})} 
                        className="dialog-input"
                        sx={{ mt: 2 }}
                    />
                    <TextField 
                        fullWidth 
                        margin="dense" 
                        label="Biografía" 
                        multiline
                        rows={3}
                        value={formData.biografia || ''} 
                        onChange={(e) => setFormData({...formData, biografia: e.target.value})} 
                        className="dialog-input"
                        sx={{ mt: 2 }}
                    />
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
                    <Typography sx={{ color: '#9ca3af' }}>¿Seguro que deseas eliminar este artista del catálogo?</Typography>
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

export default Artistas;