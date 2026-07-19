import { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, MenuItem, DialogContentText, InputAdornment,
    Snackbar, Alert, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition'; // <-- Animación
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
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">Gestión de Álbumes</Typography>
                    <Button variant="contained" color="secondary" onClick={() => handleOpen('crear')}>+ Nuevo Álbum</Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth variant="outlined" placeholder="Buscar por título o artista..."
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
                                    <TableCell><b>ID</b></TableCell><TableCell><b>Título</b></TableCell>
                                    <TableCell><b>Lanzamiento</b></TableCell><TableCell><b>Artista</b></TableCell>
                                    <TableCell align="right"><b>Acciones</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {albumesFiltrados.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell>{a.id}</TableCell><TableCell>{a.titulo}</TableCell>
                                        <TableCell>{a.fecha_lanzamiento}</TableCell>
                                        <TableCell>{getNombreArtista(a.artista)}</TableCell>
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

            {/* Modales */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{modalMode === 'crear' ? 'Crear' : 'Editar'} Álbum</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="Título" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} />
                    <TextField fullWidth margin="dense" label="Fecha" type="date" InputLabelProps={{ shrink: true }} value={formData.fecha_lanzamiento} onChange={(e) => setFormData({...formData, fecha_lanzamiento: e.target.value})} />
                    <TextField select fullWidth margin="dense" label="Artista" value={formData.artista} onChange={(e) => setFormData({...formData, artista: e.target.value})}>
                        {artistasDisponibles.map((a) => <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>)}
                    </TextField>
                </DialogContent>
                <DialogActions><Button onClick={handleClose}>Cancelar</Button><Button onClick={handleSave}>Guardar</Button></DialogActions>
            </Dialog>

            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                <DialogContent><DialogContentText>¿Seguro que deseas eliminar este álbum?</DialogContentText></DialogContent>
                <DialogActions><Button onClick={() => setOpenDeleteModal(false)}>Cancelar</Button><Button color="error" onClick={handleDelete}>Eliminar</Button></DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </PageTransition>
    );
};

export default Albumes;