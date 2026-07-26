import { useState, useRef, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import { PLAYLIST } from '../data/radioPlaylist';
import './MiniRadio.css';

const MiniRadio = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.log("Error de audio:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.src;
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Error al cambiar:", err));
      }
    }
  }, [currentTrackIndex]);

  return (
    <div className="radio-sidebar-container">
      <audio
        ref={audioRef}
        onEnded={handleNext}
      />

      <div className="radio-card">
        {/* Esferas luminosas en fondo */}
        <div className="two"></div>
        <div className="three"></div>

        {/* Cristal Glassmorphism */}
        <div className="one">
          <div className="title">
            <span>LIVE RADIO</span>
            {isPlaying && <GraphicEqIcon className="pulse-eq-icon" />}
          </div>

          <div className="music">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className={`radio-cover-img ${isPlaying ? 'spinning' : ''}`}
            />
          </div>

          <span className="name">{currentTrack.title}</span>
          <span className="name1">{currentTrack.artist}</span>
          <span className="track-counter">{currentTrackIndex + 1} / {PLAYLIST.length}</span>

          {/* Botones de control */}
          <div className="bar">
            <button className="radio-control-btn" onClick={handlePrev} title="Anterior">
              <SkipPreviousIcon />
            </button>
            <button className="radio-play-btn" onClick={togglePlay} title={isPlaying ? "Pausar" : "Reproducir"}>
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </button>
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