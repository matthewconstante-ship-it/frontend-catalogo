import { useState, useRef, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import './MiniRadio.css';

// Lista ampliada de canciones para la radio
const PLAYLIST = [
  {
    id: 1,
    title: "Vibe Synthwave",
    artist: "MeloVerse Stream",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Night Drive Lofi",
    artist: "MeloVerse Stream",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 3,
    title: "Cyber Sunset",
    artist: "MeloVerse Stream",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    id: 4,
    title: "Midnight Chill",
    artist: "MeloVerse Stream",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: 5,
    title: "Cosmic Journey",
    artist: "MeloVerse Stream",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
  },
  {
    id: 6,
    title: "Electric Pulse",
    artist: "MeloVerse Stream",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"
  },
  {
    id: 7,
    title: "Retro Future",
    artist: "MeloVerse Stream",
    cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"
  },
  {
    id: 8,
    title: "Deep Space Melodies",
    artist: "MeloVerse Stream",
    cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3"
  }
];

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