import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';

const ArtistaFormModal = ({ open, onClose, onSave, formData, setFormData, modalMode }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ className: 'custom-dialog-paper' }}>
            <DialogTitle className="dialog-title">
                {modalMode === 'crear' ? 'Registrar Nuevo Artista' : 'Editar Artista'}
            </DialogTitle>
            <DialogContent>
                <TextField className="custom-dialog-input" fullWidth margin="dense" label="Nombre" value={formData.nombre || ''} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                <TextField className="custom-dialog-input" fullWidth margin="dense" label="Género" value={formData.genero || ''} onChange={(e) => setFormData({...formData, genero: e.target.value})} />
                <TextField className="custom-dialog-input" fullWidth margin="dense" label="Biografía" multiline rows={3} value={formData.biografia || ''} onChange={(e) => setFormData({...formData, biografia: e.target.value})} />
                
                <Button variant="outlined" component="label" fullWidth sx={{ mt: 2, mb: 1, borderColor: 'rgba(255, 255, 255, 0.2)', color: '#9ca3af', textTransform: 'none', borderRadius: '8px', '&:hover': { borderColor: '#7c3aed', color: '#fff', backgroundColor: 'rgba(124, 58, 237, 0.05)' } }}>
                    {formData.foto ? 'Cambiar Fotografía' : 'Subir Fotografía'}
                    <input type="file" hidden accept="image/*" onChange={(e) => setFormData({...formData, foto: e.target.files[0]})} />
                </Button>
                {formData.foto && (
                    <Typography variant="caption" sx={{ color: '#a855f7', display: 'block', textAlign: 'center', fontWeight: 600 }}>
                        {typeof formData.foto === 'string' ? ' Fotografía actual cargada' : ` ${formData.foto.name}`}
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

export default ArtistaFormModal;