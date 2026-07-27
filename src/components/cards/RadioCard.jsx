import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

// Agregamos la propiedad 'onPlay'
const RadioCard = ({ track, onPlay, onEdit, onDelete }) => {
    return (
        <div className="uiverse-card">
            <div className="card-bg-base" style={{background: 'linear-gradient(135deg, #10b981, #0ea5e9)'}}>
                <div className="card-bg-inner"></div>
            </div>
            
            <div className="card-vinyl-container">
                <div className="card-vinyl-gradient" style={{background: 'linear-gradient(to top right, #10b981, #0ea5e9)'}}>
                    <div className="card-vinyl-hole"></div>
                </div>
            </div>

            <div className="card-content-overlay">
                <div className="card-text-box">
                    <span className="card-title">{track.titulo}</span>
                    <span className="card-subtitle">{track.artista}</span>
                    <div className="card-bottom-text">
                        <span>MP3 Radio</span>
                    </div>
                </div>

                <div className="card-actions-col">
                    <div className="card-tags-container">
                        <span className="card-tag">Stream</span>
                        <span className="card-tag-label">Estado</span>
                    </div>

                    <div className="card-actions-buttons">
                        {/* NUEVO: Botón de Reproducir desde la tarjeta */}
                        <button className="card-action-btn" onClick={() => onPlay(track)} title="Reproducir ahora">
                            <PlayArrowIcon fontSize="small" />
                        </button>
                        <button className="card-action-btn edit" onClick={() => onEdit(track)} title="Editar">
                            <EditOutlinedIcon fontSize="small" />
                        </button>
                        <button className="card-action-btn delete" onClick={() => onDelete(track)} title="Eliminar">
                            <DeleteOutlinedIcon fontSize="small" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RadioCard;