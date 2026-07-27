import { useState, useRef, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import api from '../services/api'; 
import './MiniRadio.css';

const MiniRadio = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchRadio = async () => {
      try {
        const response = await api.get('radio/');
        const data = Array.isArray(response.data) ? response.data : response.data.results;
        setPlaylist(data || []);
      } catch (error) {
        console.error('Error al cargar la música de la radio:', error);
      }
    };
    
    fetchRadio();
    window.addEventListener('radioUpdated', fetchRadio);
    
    return () => window.removeEventListener('radioUpdated', fetchRadio);
  }, []);

  useEffect(() => {
    const handlePlaySpecific = (e) => {
      const trackId = e.detail; 
      const index = playlist.findIndex(track => track.id === trackId);
      if (index !== -1) {
        setCurrentTrackIndex(index);
        setIsPlaying(true); 
      }
    };

    window.addEventListener('playSpecificTrack', handlePlaySpecific);
    return () => window.removeEventListener('playSpecificTrack', handlePlaySpecific);
  }, [playlist]); 

  const currentTrack = playlist[currentTrackIndex];

  const togglePlay = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.log("Error de audio:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (playlist.length > 0) {
      if (isShuffle) {
        let nextIndex = Math.floor(Math.random() * playlist.length);
        if (playlist.length > 1 && nextIndex === currentTrackIndex) {
          nextIndex = (nextIndex + 1) % playlist.length;
        }
        setCurrentTrackIndex(nextIndex);
      } else {
        setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
      }
    }
  };

  const handlePrev = () => {
    if (playlist.length > 0) {
      setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  };

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.archivo_audio; 
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Error al reproducir:", err));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, currentTrack]);

  if (!currentTrack) {
    return null; 
  }

  const defaultCover = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80";

  return (
    <div className="radio-sidebar-container">
      <audio
        ref={audioRef}
        onEnded={handleNext} 
      />

      <div className="radio-card">
        <div className="two"></div>
        <div className="three"></div>

        <div className="one">
          <div className="title">
            <span>LIVE RADIO</span>
            {isPlaying && <GraphicEqIcon className="pulse-eq-icon" />}
          </div>

          <div className="music">
            <img
              src={defaultCover}
              alt={currentTrack.titulo}
              className={`radio-cover-img ${isPlaying ? 'spinning' : ''}`}
            />
          </div>

          <span className="name">{currentTrack.titulo}</span>
          <span className="name1">{currentTrack.artista}</span>
          <span className="track-counter">{currentTrackIndex + 1} / {playlist.length}</span>

          <div className="bar">
            <button className="radio-control-btn" onClick={handlePrev} title="Anterior">
              <SkipPreviousIcon />
            </button>
            
            {/* Contenedor relativo para apilar el botón de aleatorio sin romper el diseño */}
            <div className="play-btn-wrapper">
              <button 
                className={`radio-control-btn shuffle-btn ${isShuffle ? 'active' : ''}`} 
                onClick={() => setIsShuffle(!isShuffle)} 
                title={isShuffle ? "Desactivar Aleatorio" : "Activar Aleatorio"}
              >
                <ShuffleIcon style={{ fontSize: '18px' }} />
              </button>
              
              <button className="radio-play-btn" onClick={togglePlay} title={isPlaying ? "Pausar" : "Reproducir"}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </button>
            </div>

            <button className="radio-control-btn" onClick={handleNext} title="Siguiente">
              <SkipNextIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniRadio;