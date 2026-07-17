import { useState } from 'react';
import { 
    Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, MenuItem
} from '@mui/material';
import Navbar from '../components/Navbar';

// Datos temporales para la interfaz
const albumesFalsos = [
    { id: 1, titulo: 'Discovery', fecha_lanzamiento: '2001-03-12', artista: 'Daft Punk' },
    { id: 2, titulo: 'Starboy', fecha_lanzamiento: '2016-11-25', artista: 'The Weeknd' },
];

// Artistas temporales para llenar la lista desplegable al crear un álbum
const artistasDisponibles = ['Daft Punk', 'The Weeknd'];

const Albumes = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState('crear');

    const handleOpen = (modo) => {
        setModalMode(modo);
        setOpenModal(true);
    };
    
    const handleClose = () => {
        setOpenModal(false);
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Gestión de Álbumes
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={() => handleOpen('crear')}>
                        + Nuevo Álbum
                    </Button>
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
                            {albumesFalsos.map((album) => (
                                <TableRow key={album.id}>
                                    <TableCell>{album.id}</TableCell>
                                    <TableCell>{album.titulo}</TableCell>
                                    <TableCell>{album.fecha_lanzamiento}</TableCell>
                                    <TableCell>{album.artista}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" color="info" sx={{ mr: 1 }} onClick={() => handleOpen('editar')}>
                                            Editar
                                        </Button>
                                        <Button size="small" color="error">Eliminar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            {/* --- VENTANA EMERGENTE (MODAL) PARA CREAR/EDITAR ÁLBUMES --- */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {modalMode === 'crear' ? 'Crear Nuevo Álbum' : 'Editar Álbum'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Título del Álbum"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Fecha de Lanzamiento"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Seleccionar Artista"
                        fullWidth
                        variant="outlined"
                        defaultValue=""
                    >
                        {artistasDisponibles.map((artista, index) => (
                            <MenuItem key={index} value={artista}>
                                {artista}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} color="inherit">Cancelar</Button>
                    <Button variant="contained" color="secondary" onClick={handleClose}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Albumes;