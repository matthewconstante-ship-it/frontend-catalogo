import { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, DialogContentText, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Tarjeta de presentación profesional
import Navbar from '../components/Navbar';
import api from '../services/api'; 
import './Artistas.css'; 

const Artistas = () => {
    const [artistas, setArtistas] = useState([]);
    const [busqueda, setBusqueda] = useState(''); // <-- NUEVO: Estado para guardar lo que escribe el usuario
    
    // Estados para los Modales
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('crear');
    
    // Estado del formulario
    const [formData, setFormData] = useState({ id: null, nombre: '', genero: '', biografia: '' });

    // --- 1. LEER (Carga inicial) ---
    useEffect(() => {
        const fetchArtistas = async () => {
            try {
                const response = await api.get('artistas/');
                if (Array.isArray(response.data)) {
                    setArtistas(response.data);
                } else if (response.data.results) {
                    setArtistas(response.data.results);
                }
            } catch (error) {
                console.error("Error al cargar los artistas:", error);
            }
        };
        fetchArtistas();
    }, []);

    // --- FUNCIONES DE MODALES ---
    const handleOpen = (modo, artista = null) => {
        setModalMode(modo);
        if (modo === 'editar' && artista) {
            setFormData(artista);
        } else {
            setFormData({ id: null, nombre: '', genero: '', biografia: '' });
        }
        setOpenModal(true);
    };

    const handleOpenDelete = (artista) => {
        setFormData(artista);
        setOpenDeleteModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setOpenDeleteModal(false);
    };

    // --- 2. CREAR Y ACTUALIZAR (Actualización Optimista) ---
    const handleSave = async () => {
        try {
            if (modalMode === 'crear') {
                const response = await api.post('artistas/', {
                    nombre: formData.nombre,
                    genero: formData.genero,
                    biografia: formData.biografia
                });
                setArtistas([...artistas, response.data]);
            } else {
                const response = await api.put(`artistas/${formData.id}/`, {
                    nombre: formData.nombre,
                    genero: formData.genero,
                    biografia: formData.biografia
                });
                setArtistas(artistas.map(a => (a.id === formData.id ? response.data : a)));
            }
            handleClose();
        } catch (error) {
            console.error("Error al guardar el artista:", error);
        }
    };

    // --- 3. ELIMINAR (Actualización Optimista) ---
    const handleDelete = async () => {
        try {
            await api.delete(`artistas/${formData.id}/`);
            setArtistas(artistas.filter(a => a.id !== formData.id));
            handleClose();
        } catch (error) {
            console.error("Error al eliminar el artista:", error);
        }
    };

    // --- NUEVO: FILTRADO EN VIVO ---
    // Filtramos los artistas por nombre o género según lo que se escriba, ignorando mayúsculas/minúsculas
    const artistasFiltrados = artistas.filter((artista) => {
        const termino = busqueda.toLowerCase();
        return (
            artista.nombre.toLowerCase().includes(termino) ||
            artista.genero.toLowerCase().includes(termino)
        );
    });

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Gestión de Artistas
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => handleOpen('crear')}>
                        + Nuevo Artista
                    </Button>
                </Box>

                {/* NUEVO: Contenedor para la barra de búsqueda */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar artista por nombre o género musical..."
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
                                <TableCell><b>Nombre</b></TableCell>
                                <TableCell><b>Género</b></TableCell>
                                <TableCell align="right"><b>Acciones</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* CAMBIO: Ahora recorremos 'artistasFiltrados' en lugar de 'artistas' */}
                            {artistasFiltrados?.map((artista) => (
                                <TableRow key={artista.id}>
                                    <TableCell>{artista.id}</TableCell>
                                    <TableCell>{artista.nombre}</TableCell>
                                    <TableCell>{artista.genero}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" color="info" sx={{ mr: 1 }} onClick={() => handleOpen('editar', artista)}>
                                            Editar
                                        </Button>
                                        <Button size="small" color="error" onClick={() => handleOpenDelete(artista)}>
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {/* Si la búsqueda no arroja resultados, mostramos un mensaje amigable */}
                            {artistasFiltrados.length === 0 && artistas.length > 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        No se encontraron artistas que coincidan con "{busqueda}"
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            {/* MODAL PARA CREAR/EDITAR */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {modalMode === 'crear' ? 'Crear Nuevo Artista' : 'Editar Artista'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus margin="dense" label="Nombre del Artista" fullWidth variant="outlined" sx={{ mb: 2, mt: 1 }}
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                    <TextField
                        margin="dense" label="Género Musical" fullWidth variant="outlined" sx={{ mb: 2 }}
                        value={formData.genero}
                        onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                    />
                    <TextField
                        margin="dense" label="Biografía" fullWidth multiline rows={4} variant="outlined"
                        value={formData.biografia}
                        onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} color="inherit">Cancelar</Button>
                    <Button variant="contained" onClick={handleSave}>Guardar</Button>
                </DialogActions>
            </Dialog>

            {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
            <Dialog open={openDeleteModal} onClose={handleClose}>
                <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Estás a punto de eliminar al artista <b>{formData.nombre}</b>. Esta acción no se puede deshacer.
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

export default Artistas;