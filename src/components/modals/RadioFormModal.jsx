import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';

const RadioFormModal = ({ open, onClose, onSave, formData, setFormData, modalMode }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ className: 'custom-dialog-paper' }}>
            <DialogTitle className="dialog-title">
                {modalMode === 'crear' ? 'Subir Canción a la Radio' : 'Editar Canción'}
            </DialogTitle>
            <DialogContent>
                <TextField className="custom-dialog-input" fullWidth margin="dense" label="Título de la Canción" value={formData.titulo || ''} onChange={(e) => setFormData({...formData, titulo: e.target.value})} />
                <TextField className="custom-dialog-input" fullWidth margin="dense" label="Artista" value={formData.artista || ''} onChange={(e) => setFormData({...formData, artista: e.target.value})} />
                
                {/* Botón para subir Audio (MP3) adaptado a los campos de tu modelo */}
                <Button variant="outlined" component="label" fullWidth sx={{ mt: 2, mb: 1, borderColor: 'rgba(255, 255, 255, 0.2)', color: '#9ca3af', textTransform: 'none', borderRadius: '8px', '&:hover': { borderColor: '#10b981', color: '#fff', backgroundColor: 'rgba(16, 185, 129, 0.05)' } }}>
                    {formData.archivo_audio ? 'Cambiar Archivo de Audio' : 'Subir Archivo de Audio (MP3)'}
                    <input type="file" hidden accept="audio/*" onChange={(e) => setFormData({...formData, archivo_audio: e.target.files[0]})} />
                </Button>
                {formData.archivo_audio && (
                    <Typography variant="caption" sx={{ color: '#10b981', display: 'block', textAlign: 'center', fontWeight: 600 }}>
                        {typeof formData.archivo_audio === 'string' ? ' Audio actual cargado' : ` ${formData.archivo_audio.name}`}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button onClick={onClose} className="btn-cancelar">Cancelar</Button>
                <Button onClick={onSave} variant="contained" className="btn-guardar" style={{background: 'linear-gradient(135deg, #10b981, #0ea5e9)'}}>Guardar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RadioFormModal;