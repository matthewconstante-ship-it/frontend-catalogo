import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const AlbumCard = ({ album, nombreArtista, onEdit, onDelete }) => {
    return (
        <div className="uiverse-card">
            <div className="card-bg-base">
                <div className="card-bg-inner"></div>
            </div>

            <div className="card-vinyl-container">
                {album.portada ? (
                    <>
                        <img src={album.portada} className="card-vinyl-image" alt={album.titulo} />
                        <div className="card-vinyl-hole"></div>
                    </>
                ) : (
                    <div className="card-vinyl-gradient">
                        <div className="card-vinyl-hole"></div>
                    </div>
                )}
            </div>

            <div className="card-content-overlay">
                <div className="card-text-box">
                    <span className="card-title">{album.titulo}</span>
                    <span className="card-subtitle">{nombreArtista}</span>
                    <div className="card-bottom-text">
                        <span>{album.fecha_lanzamiento ? album.fecha_lanzamiento.substring(0, 4) : 'Sin fecha'}</span>
                    </div>
                </div>

                <div className="card-actions-col">
                    <div className="card-tags-container">
                        <span className="card-tag">Álbum</span>
                        <span className="card-tag-label">Tipo</span>
                    </div>

                    <div className="card-actions-buttons">
                        <button className="card-action-btn edit" onClick={() => onEdit(album)} title="Editar">
                            <EditOutlinedIcon fontSize="small" />
                        </button>
                        <button className="card-action-btn delete" onClick={() => onDelete(album)} title="Eliminar">
                            <DeleteOutlinedIcon fontSize="small" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumCard;