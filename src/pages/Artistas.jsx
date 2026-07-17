import { useState } from 'react';
import { 
    Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, DialogContentText
} from '@mui/material';
import Navbar from '../components/Navbar';

// Datos iniciales
const datosIniciales = [
    { id: 1, nombre: 'Daft Punk', genero: 'Electrónica', biografia: 'Dúo francés...' },
    { id: 2, nombre: 'The Weeknd', genero: 'R&B / Pop', biografia: 'Cantante canadiense...' },
];

const Artistas = () => {
    // 1. Estado para almacenar los artistas en pantalla
    const [artistas, setArtistas] = useState(datosIniciales);
    
    // 2. Estados para los Modales
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('crear');
    
    // 3. Estado para guardar los datos del formulario temporalmente
    const [formData, setFormData] = useState({ id: null, nombre: '', genero: '', biografia: '' });

    // --- FUNCIONES PARA ABRIR/CERRAR MODALES ---
    const handleOpen = (modo, artista = null) => {
        setModalMode(modo);
        if (modo === 'editar' && artista) {
            setFormData(artista); // Llenamos el formulario con los datos a editar
        } else {
            setFormData({ id: null, nombre: '', genero: '', biografia: '' }); // Formulario vacío
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

    // --- FUNCIONES QUE SIMULAN EL CRUD (Aquí luego irá Axios) ---
    const handleSave = () => {
        if (modalMode === 'crear') {
            // Simulamos crear asignando un ID al azar
            const nuevoArtista = { ...formData, id: Date.now() };
            setArtistas([...artistas, nuevoArtista]);
        } else {
            // Simulamos editar buscando el ID y reemplazándolo
            setArtistas(artistas.map(a => (a.id === formData.id ? formData : a)));
        }
        handleClose();
    };

    const handleDelete = () => {
        // Simulamos eliminar filtrando el que no queremos
        setArtistas(artistas.filter(a => a.id !== formData.id));
        handleClose();
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
                            {artistas.map((artista) => (
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

            {/* --- MODAL PARA CREAR/EDITAR --- */}
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

            {/* --- MODAL DE CONFIRMACIÓN PARA ELIMINAR --- */}
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