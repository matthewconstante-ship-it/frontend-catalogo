import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const ArtistaCard = ({ artista, onEdit, onDelete }) => {
    return (
        <div className="uiverse-card">
            <div className="card-bg-base">
                <div className="card-bg-inner"></div>
            </div>

            <div className="card-vinyl-container">
                {artista.foto ? (
                    <>
                        <img src={artista.foto} className="card-vinyl-image" alt={artista.nombre} />
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
                    <span className="card-title">{artista.nombre}</span>
                    <span className="card-subtitle">{artista.biografia || 'Sin biografía'}</span>
                    <div className="card-bottom-text">
                        <span>ID: {artista.id}</span>
                    </div>
                </div>

                <div className="card-actions-col">
                    <div className="card-tags-container">
                        <span className="card-tag">{artista.genero || 'Varios'}</span>
                        <span className="card-tag-label">Género</span>
                    </div>

                    <div className="card-actions-buttons">
                        <button className="card-action-btn edit" onClick={() => onEdit(artista)} title="Editar">
                            <EditOutlinedIcon fontSize="small" />
                        </button>
                        <button className="card-action-btn delete" onClick={() => onDelete(artista)} title="Eliminar">
                            <DeleteOutlinedIcon fontSize="small" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistaCard;