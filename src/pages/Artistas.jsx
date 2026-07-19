import { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, InputAdornment, 
    Snackbar, Alert, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; 
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
                console.error(error); // Ahora usamos el error
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
            console.error(error); // Ahora usamos el error
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
            console.error(error); // Ahora usamos el error
            setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' });
        }
    };

    // 5. Lógica de filtro
    const artistasFiltrados = artistas.filter((a) => 
        a.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        a.genero.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <PageTransition>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">Gestión de Artistas</Typography>
                    <Button variant="contained" color="primary" onClick={() => handleOpen('crear')}>+ Nuevo Artista</Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth variant="outlined" placeholder="Buscar por nombre o género..."
                        value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
                    />
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
                ) : (
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell><b>ID</b></TableCell><TableCell><b>Nombre</b></TableCell>
                                    <TableCell><b>Género</b></TableCell><TableCell align="right"><b>Acciones</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {artistasFiltrados.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell>{a.id}</TableCell><TableCell>{a.nombre}</TableCell>
                                        <TableCell>{a.genero}</TableCell>
                                        <TableCell align="right">
                                            <Button size="small" color="info" onClick={() => handleOpen('editar', a)}>Editar</Button>
                                            <Button size="small" color="error" onClick={() => { setFormData(a); setOpenDeleteModal(true); }}>Eliminar</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            {/* Modales y Notificaciones */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{modalMode === 'crear' ? 'Crear' : 'Editar'} Artista</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="Nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                    <TextField fullWidth margin="dense" label="Género" value={formData.genero} onChange={(e) => setFormData({...formData, genero: e.target.value})} />
                </DialogContent>
                <DialogActions><Button onClick={handleClose}>Cancelar</Button><Button onClick={handleSave}>Guardar</Button></DialogActions>
            </Dialog>

            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                <DialogActions><Button onClick={() => setOpenDeleteModal(false)}>Cancelar</Button><Button color="error" onClick={handleDelete}>Eliminar</Button></DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </PageTransition>
    );
};

export default Artistas;