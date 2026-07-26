import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, Typography } from '@mui/material';

const AlbumFormModal = ({ open, onClose, onSave, formData, setFormData, modalMode, artistasDisponibles }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ className: 'custom-dialog-paper' }}>
            <DialogTitle className="dialog-title">
                {modalMode === 'crear' ? 'Registrar Nuevo Álbum' : 'Editar Álbum'}
            </DialogTitle>
            <DialogContent>
                <TextField className="custom-dialog-input" fullWidth margin="dense" label="Título" value={formData.titulo || ''} onChange={(e) => setFormData({...formData, titulo: e.target.value})} />
                <TextField className="custom-dialog-input" fullWidth margin="dense" label="Fecha de Lanzamiento" type="date" InputLabelProps={{ shrink: true }} value={formData.fecha_lanzamiento ? formData.fecha_lanzamiento.split('T')[0] : ''} onChange={(e) => setFormData({...formData, fecha_lanzamiento: e.target.value})} />
                
                <TextField select className="custom-dialog-input" fullWidth margin="dense" label="Artista" value={formData.artista || ''} onChange={(e) => setFormData({...formData, artista: e.target.value})}>
                    {artistasDisponibles.map((a) => (
                        <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>
                    ))}
                </TextField>

                <Button variant="outlined" component="label" fullWidth sx={{ mt: 2, mb: 1, borderColor: 'rgba(255, 255, 255, 0.2)', color: '#9ca3af', textTransform: 'none', borderRadius: '8px', '&:hover': { borderColor: '#7c3aed', color: '#fff', backgroundColor: 'rgba(124, 58, 237, 0.05)' } }}>
                    {formData.portada ? 'Cambiar Portada' : 'Subir Portada'}
                    <input type="file" hidden accept="image/*" onChange={(e) => setFormData({...formData, portada: e.target.files[0]})} />
                </Button>
                {formData.portada && (
                    <Typography variant="caption" sx={{ color: '#a855f7', display: 'block', textAlign: 'center', fontWeight: 600 }}>
                        {typeof formData.portada === 'string' ? ' Portada actual cargada' : ` ${formData.portada.name}`}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button onClick={onClose} className="btn-cancelar">Cancelar</Button>
                <Button onClick={onSave} variant="contained" className="btn-guardar">Guardar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlbumFormModal;