import { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, DialogContentText
} from '@mui/material';
import Navbar from '../components/Navbar';
import api from '../services/api'; 
import './Artistas.css'; 

const Artistas = () => {
    const [artistas, setArtistas] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('crear');
    const [formData, setFormData] = useState({ id: null, nombre: '', genero: '', biografia: '' });

    // --- 1. LEER (Carga inicial) ---
    // Al meter la función aquí adentro, el linter de Vite deja de molestar
    useEffect(() => {
        const fetchArtistas = async () => {
            try {
                const response = await api.get('artistas/');
                // Seguro contra pantallas en blanco: verificamos que sea una lista
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
                // Agregamos el nuevo artista directamente a la tabla al instante
                setArtistas([...artistas, response.data]);
            } else {
                const response = await api.put(`artistas/${formData.id}/`, {
                    nombre: formData.nombre,
                    genero: formData.genero,
                    biografia: formData.biografia
                });
                // Reemplazamos el artista editado en la tabla al instante
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
            // Lo borramos de la tabla visualmente al instante
            setArtistas(artistas.filter(a => a.id !== formData.id));
            handleClose();
        } catch (error) {
            console.error("Error al eliminar el artista:", error);
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Gestión de Artistas
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => handleOpen('crear')}>
                        + Nuevo Artista
                    </Button>
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
                            {/* El signo de interrogación es el escudo anti-pantallas en blanco */}
                            {artistas?.map((artista) => (
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