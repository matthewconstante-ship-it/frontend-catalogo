import { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, MenuItem, DialogContentText, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../components/Navbar';
import api from '../services/api'; 
import './Albumes.css'; 

const Albumes = () => {
    const [albumes, setAlbumes] = useState([]);
    const [artistasDisponibles, setArtistasDisponibles] = useState([]);
    const [busqueda, setBusqueda] = useState(''); // <-- NUEVO: Estado para el filtro
    
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('crear');
    
    const [formData, setFormData] = useState({ id: null, titulo: '', fecha_lanzamiento: '', artista: '' });

    // --- 1. LEER (Cargar Álbumes y Artistas) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resAlbumes, resArtistas] = await Promise.all([
                    api.get('albumes/'),
                    api.get('artistas/')
                ]);

                if (Array.isArray(resAlbumes.data)) {
                    setAlbumes(resAlbumes.data);
                } else if (resAlbumes.data.results) {
                    setAlbumes(resAlbumes.data.results);
                }

                if (Array.isArray(resArtistas.data)) {
                    setArtistasDisponibles(resArtistas.data);
                } else if (resArtistas.data.results) {
                    setArtistasDisponibles(resArtistas.data.results);
                }

            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };
        fetchData();
    }, []);

    const handleOpen = (modo, album = null) => {
        setModalMode(modo);
        if (modo === 'editar' && album) {
            setFormData(album);
        } else {
            setFormData({ id: null, titulo: '', fecha_lanzamiento: '', artista: '' });
        }
        setOpenModal(true);
    };

    const handleOpenDelete = (album) => {
        setFormData(album);
        setOpenDeleteModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setOpenDeleteModal(false);
    };

    // --- 2. CREAR Y ACTUALIZAR ---
    const handleSave = async () => {
        try {
            if (modalMode === 'crear') {
                const response = await api.post('albumes/', {
                    titulo: formData.titulo,
                    fecha_lanzamiento: formData.fecha_lanzamiento,
                    artista: formData.artista 
                });
                setAlbumes([...albumes, response.data]);
            } else {
                const response = await api.put(`albumes/${formData.id}/`, {
                    titulo: formData.titulo,
                    fecha_lanzamiento: formData.fecha_lanzamiento,
                    artista: formData.artista
                });
                setAlbumes(albumes.map(a => (a.id === formData.id ? response.data : a)));
            }
            handleClose();
        } catch (error) {
            console.error("Error al guardar el álbum:", error);
        }
    };

    // --- 3. ELIMINAR ---
    const handleDelete = async () => {
        try {
            await api.delete(`albumes/${formData.id}/`);
            setAlbumes(albumes.filter(a => a.id !== formData.id));
            handleClose();
        } catch (error) {
            console.error("Error al eliminar el álbum:", error);
        }
    };

    const getNombreArtista = (idArtista) => {
        const artista = artistasDisponibles.find(a => a.id === idArtista);
        return artista ? artista.nombre : 'Desconocido';
    };

    // --- NUEVO: FILTRADO EN VIVO ---
    const albumesFiltrados = albumes.filter((album) => {
        const termino = busqueda.toLowerCase();
        const nombreDelArtista = getNombreArtista(album.artista).toLowerCase();
        
        return (
            album.titulo.toLowerCase().includes(termino) ||
            nombreDelArtista.includes(termino)
        );
    });

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Gestión de Álbumes
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={() => handleOpen('crear')}>
                        + Nuevo Álbum
                    </Button>
                </Box>

                {/* NUEVO: Contenedor para la barra de búsqueda */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar álbum por título o nombre del artista..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><b>ID</b></TableCell>
                                <TableCell><b>Título del Álbum</b></TableCell>
                                <TableCell><b>Fecha de Lanzamiento</b></TableCell>
                                <TableCell><b>Artista</b></TableCell>
                                <TableCell align="right"><b>Acciones</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* CAMBIO: Usamos albumesFiltrados */}
                            {albumesFiltrados?.map((album) => (
                                <TableRow key={album.id}>
                                    <TableCell>{album.id}</TableCell>
                                    <TableCell>{album.titulo}</TableCell>
                                    <TableCell>{album.fecha_lanzamiento}</TableCell>
                                    <TableCell>{getNombreArtista(album.artista)}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" color="info" sx={{ mr: 1 }} onClick={() => handleOpen('editar', album)}>
                                            Editar
                                        </Button>
                                        <Button size="small" color="error" onClick={() => handleOpenDelete(album)}>
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {/* Mensaje si no hay resultados */}
                            {albumesFiltrados.length === 0 && albumes.length > 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        No se encontraron álbumes que coincidan con "{busqueda}"
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {modalMode === 'crear' ? 'Crear Nuevo Álbum' : 'Editar Álbum'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus margin="dense" label="Título del Álbum" fullWidth variant="outlined" sx={{ mb: 2, mt: 1 }}
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    />
                    <TextField
                        margin="dense" label="Fecha de Lanzamiento" type="date" fullWidth variant="outlined" sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                        value={formData.fecha_lanzamiento}
                        onChange={(e) => setFormData({ ...formData, fecha_lanzamiento: e.target.value })}
                    />
                    <TextField
                        select margin="dense" label="Seleccionar Artista" fullWidth variant="outlined"
                        value={formData.artista}
                        onChange={(e) => setFormData({ ...formData, artista: e.target.value })}
                    >
                        {artistasDisponibles?.map((artista) => (
                            <MenuItem key={artista.id} value={artista.id}>
                                {artista.nombre}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} color="inherit">Cancelar</Button>
                    <Button variant="contained" color="secondary" onClick={handleSave}>Guardar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteModal} onClose={handleClose}>
                <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Estás a punto de eliminar el álbum <b>{formData.titulo}</b>. Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} color="inherit">Cancelar</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>Eliminar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Albumes;