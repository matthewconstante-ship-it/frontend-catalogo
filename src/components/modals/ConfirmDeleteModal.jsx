import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

const ConfirmDeleteModal = ({ open, onClose, onConfirm, title, itemName }) => {
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ className: 'custom-dialog-paper' }}>
            <DialogTitle className="dialog-title text-danger">{title}</DialogTitle>
            <DialogContent>
                <Typography className="dialog-text">
                    ¿Seguro que deseas eliminar a <strong>{itemName}</strong> del catálogo?
                </Typography>
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button onClick={onClose} className="btn-cancelar">Cancelar</Button>
                <Button variant="contained" onClick={onConfirm} className="btn-eliminar-modal">
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteModal;