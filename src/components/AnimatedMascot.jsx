const AnimatedMascot = ({ isUsernameFocused, isPasswordFocused, showPassword, usernameLength, isLoading }) => {
    // Reducimos un poco el multiplicador para que las estrellas no se salgan del ojo
    const eyeMovement = Math.min(usernameLength * 0.8, 6);

    return (
        <div className={`mascot-container ${isLoading ? 'loading-mode' : ''}`}>
            <svg viewBox="0 0 120 120" className="mascot-svg">
                
                {/* Cables de los audífonos colgando */}
                <path d="M 20 55 Q 35 100 15 120" stroke="#5A5A5A" strokeWidth="1.5" fill="none" />
                <path d="M 100 55 Q 85 100 105 120" stroke="#5A5A5A" strokeWidth="1.5" fill="none" />

                {/* Hombros / Cuerpo inferior */}
                <path d="M 40 100 Q 20 110 5 120 L 115 120 Q 100 110 80 100 Z" fill="#85C77E" />

                {/* Cuello */}
                <path d="M 45 60 L 40 120 L 80 120 L 75 60 Z" fill="#85C77E" />

                {/* Base de la Cabeza */}
                <ellipse cx="60" cy="55" rx="35" ry="22" fill="#85C77E" />

                {/* Protuberancias de los ojos (estilo rana) */}
                <circle cx="35" cy="40" r="14" fill="#85C77E" />
                <circle cx="85" cy="40" r="14" fill="#85C77E" />

                {/* Diadema de los audífonos */}
                <path d="M 18 50 C 18 2, 102 2, 102 50" stroke="#5A5A5A" strokeWidth="3.5" fill="none" strokeLinecap="round" />

                {/* Almohadillas de los audífonos */}
                <rect x="12" y="38" width="10" height="24" rx="4" fill="#5A5A5A" />
                <rect x="98" y="38" width="10" height="24" rx="4" fill="#5A5A5A" />

                {/* Fosas nasales */}
                <circle cx="55" cy="52" r="1" fill="#4A7545" />
                <circle cx="65" cy="52" r="1" fill="#4A7545" />

                {/* Ojos y Pupilas de Estrella */}
                <g className={isLoading ? "eyes-loading" : "eyes"}>
                    {/* Ojo Izquierdo */}
                    <circle cx="35" cy="40" r="9" fill="#fff" />
                    <g style={!isLoading ? { 
                            transform: `translate(${isUsernameFocused ? eyeMovement - 3 : 0}px, ${isUsernameFocused ? 2 : 0}px)`,
                            transition: 'transform 0.1s'
                        } : {}}>
                        <path d="M 35 34 L 36.5 37.5 L 40 37.5 L 37.5 40 L 38.5 44 L 35 42 L 31.5 44 L 32.5 40 L 30 37.5 L 33.5 37.5 Z" fill="#2d2d2d" className="pupil-star" />
                    </g>

                    {/* Ojo Derecho */}
                    <circle cx="85" cy="40" r="9" fill="#fff" />
                    <g style={!isLoading ? { 
                            transform: `translate(${isUsernameFocused ? eyeMovement - 3 : 0}px, ${isUsernameFocused ? 2 : 0}px)`,
                            transition: 'transform 0.1s'
                        } : {}}>
                        <path d="M 85 34 L 86.5 37.5 L 90 37.5 L 87.5 40 L 88.5 44 L 85 42 L 81.5 44 L 82.5 40 L 80 37.5 L 83.5 37.5 Z" fill="#2d2d2d" className="pupil-star" />
                    </g>
                </g>

                {/* Boca (estilo derpy/relajado) */}
                <path 
                    d={isLoading ? "M 35 65 Q 60 75 85 65" : (isPasswordFocused && !showPassword ? "M 40 65 Q 60 62 80 65" : "M 32 63 Q 60 68 88 61")} 
                    stroke="#4A7545" strokeWidth="2" fill="transparent" strokeLinecap="round" 
                    className="mouth"
                />

                {/* Manitas de la rana (Más largas y con borde para resaltar) */}
                <g className={`hands ${isLoading ? 'down' : (isPasswordFocused ? (showPassword ? 'peeking' : 'covering') : 'down')}`}>
                    <rect x="23" y="75" width="20" height="55" rx="10" fill="#85C77E" stroke="#609959" strokeWidth="1.5" className="hand hand-left" />
                    <rect x="77" y="75" width="20" height="55" rx="10" fill="#85C77E" stroke="#609959" strokeWidth="1.5" className="hand hand-right" />
                </g>
            </svg>
        </div>
    );
};

export default AnimatedMascot;