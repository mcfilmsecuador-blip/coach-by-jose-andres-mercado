import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

const InteractiveBody = ({ activeMuscle, onSelectMuscle }) => {
  const [view, setView] = useState('front'); // 'front' or 'back'
  const [hoveredMuscle, setHoveredMuscle] = useState(null);

  const handleMuscleClick = (muscleId) => {
    if (onSelectMuscle) {
      onSelectMuscle(muscleId);
    }
  };

  // Define dot position percentages relative to the image container
  // Front View (WebP)
  const frontLabels = [
    { id: 'hombros', label: 'Hombros', side: 'left', y: '22%', dotX: '32%', dotY: '22%' },
    { id: 'biceps', label: 'Bíceps', side: 'left', y: '32%', dotX: '23%', dotY: '32%' },
    { id: 'antebrazos', label: 'Antebrazos', side: 'left', y: '42%', dotX: '18%', dotY: '42%' },
    { id: 'pecho', label: 'Pecho', side: 'right', y: '25%', dotX: '58%', dotY: '25%' },
    { id: 'abdomen', label: 'Abdomen', side: 'right', y: '36%', dotX: '50%', dotY: '36%' },
    { id: 'piernas', label: 'Piernas', side: 'right', y: '58%', dotX: '62%', dotY: '58%' }
  ];

  // Back View (WebP)
  const backLabels = [
    { id: 'triceps', label: 'Tríceps', side: 'left', y: '32%', dotX: '23%', dotY: '32%' },
    { id: 'gluteos', label: 'Glúteos', side: 'left', y: '49%', dotX: '40%', dotY: '49%' },
    { id: 'trapecio/cuello', label: 'Trapecio', side: 'right', y: '20%', dotX: '50%', dotY: '20%' },
    { id: 'espalda', label: 'Espalda', side: 'right', y: '32%', dotX: '63%', dotY: '32%' },
    { id: 'pantorrillas', label: 'Pantorrillas', side: 'right', y: '78%', dotX: '61%', dotY: '78%' }
  ];

  const currentLabels = view === 'front' ? frontLabels : backLabels;
  const imageSrc = view === 'front' ? '/cuerpo/cuerpo_anterior.webp' : '/cuerpo/cuerpo_posterior.webp';

  const renderFrontMuscleHighlights = () => {
    return (
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}>
        <defs>
          <filter id="neon-glow-front">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Pecho */}
        {(activeMuscle === 'pecho' || hoveredMuscle === 'pecho') && (
          <g filter="url(#neon-glow-front)">
            <ellipse cx="42%" cy="26%" rx="12%" ry="4.5%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
            <ellipse cx="58%" cy="26%" rx="12%" ry="4.5%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
          </g>
        )}
        
        {/* Abdomen */}
        {(activeMuscle === 'abdomen' || hoveredMuscle === 'abdomen') && (
          <g filter="url(#neon-glow-front)">
            <ellipse cx="50%" cy="36%" rx="12%" ry="9%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
          </g>
        )}
        
        {/* Hombros */}
        {(activeMuscle === 'hombros' || hoveredMuscle === 'hombros') && (
          <g filter="url(#neon-glow-front)">
            <ellipse cx="28%" cy="23%" rx="6%" ry="9%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
            <ellipse cx="72%" cy="23%" rx="6%" ry="9%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
          </g>
        )}
        
        {/* Bíceps */}
        {(activeMuscle === 'biceps' || hoveredMuscle === 'biceps') && (
          <g filter="url(#neon-glow-front)">
            <ellipse cx="22%" cy="32%" rx="5%" ry="7%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
            <ellipse cx="78%" cy="32%" rx="5%" ry="7%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
          </g>
        )}
        
        {/* Antebrazos */}
        {(activeMuscle === 'antebrazos' || hoveredMuscle === 'antebrazos') && (
          <g filter="url(#neon-glow-front)">
            <ellipse cx="18%" cy="43%" rx="4.5%" ry="8%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
            <ellipse cx="82%" cy="43%" rx="4.5%" ry="8%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
          </g>
        )}
        
        {/* Piernas */}
        {(activeMuscle === 'piernas' || hoveredMuscle === 'piernas') && (
          <g filter="url(#neon-glow-front)">
            <ellipse cx="38%" cy="58%" rx="9%" ry="17%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
            <ellipse cx="62%" cy="58%" rx="9%" ry="17%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
          </g>
        )}
      </svg>
    );
  };

  const renderBackMuscleHighlights = () => {
    return (
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}>
        <defs>
          <filter id="neon-glow-back">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Tríceps */}
        {(activeMuscle === 'triceps' || hoveredMuscle === 'triceps') && (
          <g filter="url(#neon-glow-back)">
            <ellipse cx="23%" cy="32%" rx="5%" ry="8%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
            <ellipse cx="77%" cy="32%" rx="5%" ry="8%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
          </g>
        )}
        
        {/* Glúteos */}
        {(activeMuscle === 'gluteos' || hoveredMuscle === 'gluteos') && (
          <g filter="url(#neon-glow-back)">
            <ellipse cx="40%" cy="49%" rx="11%" ry="9%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
            <ellipse cx="60%" cy="49%" rx="11%" ry="9%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
          </g>
        )}
        
        {/* Trapecio */}
        {(activeMuscle === 'trapecio/cuello' || hoveredMuscle === 'trapecio/cuello') && (
          <g filter="url(#neon-glow-back)">
            <ellipse cx="50%" cy="20%" rx="12%" ry="7%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
          </g>
        )}
        
        {/* Espalda */}
        {(activeMuscle === 'espalda' || hoveredMuscle === 'espalda') && (
          <g filter="url(#neon-glow-back)">
            <ellipse cx="37%" cy="32%" rx="9%" ry="14%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
            <ellipse cx="63%" cy="32%" rx="9%" ry="14%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
          </g>
        )}
        
        {/* Pantorrillas */}
        {(activeMuscle === 'pantorrillas' || hoveredMuscle === 'pantorrillas') && (
          <g filter="url(#neon-glow-back)">
            <ellipse cx="39%" cy="78%" rx="6.5%" ry="11%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
            <ellipse cx="61%" cy="78%" rx="6.5%" ry="11%" fill="rgba(200, 255, 0, 0.45)" stroke="var(--color-primary)" strokeWidth="1" />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#000000',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '20px'
    }}>
      {/* Header Info */}
      <div className="flex-row justify-between align-center mb-md">
        <div className="flex-col">
          <span style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Explorador Anatómico</span>
          <h3 className="text-body" style={{ margin: 0, fontWeight: '700' }}>
            {view === 'front' ? 'Vista Anterior' : 'Vista Posterior'}
          </h3>
        </div>
        <button
          onClick={() => setView(prev => prev === 'front' ? 'back' : 'front')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(200, 255, 0, 0.1)',
            border: '1px solid rgba(200, 255, 0, 0.2)',
            borderRadius: '20px',
            padding: '6px 12px',
            color: 'var(--color-primary)',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s',
            zIndex: 30
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(200, 255, 0, 0.1)';
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
        >
          <RotateCw size={12} />
          Girar Silueta
        </button>
      </div>

      {/* Main Interactive Diagram Container */}
      <div style={{
        position: 'relative',
        height: '420px',
        width: '100%',
        maxWidth: '380px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden'
      }}>
        {/* Central Body Image */}
        <div style={{
          width: '210px',
          height: '100%',
          position: 'relative',
          zIndex: 2
        }}>
          <img 
            src={imageSrc} 
            alt={view === 'front' ? 'Cuerpo Humano Frente' : 'Cuerpo Humano Espalda'} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          {view === 'front' ? renderFrontMuscleHighlights() : renderBackMuscleHighlights()}
        </div>

        {/* Lines and Hotspots (SVG layer overlaying the layout) */}
        <svg 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          {currentLabels.map((lbl) => {
            const isLeft = lbl.side === 'left';
            const isActive = activeMuscle === lbl.id || hoveredMuscle === lbl.id;
            const lineColor = isActive ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.15)';
            const lineWidth = isActive ? '1.5' : '1';

            // Convert string percentages to numbers for math inside SVG coordinate space
            const labelYVal = parseFloat(lbl.y);
            const dotXVal = 22.3 + (parseFloat(lbl.dotX) * 0.554); // align with image container taking middle 55.4%
            const dotYVal = parseFloat(lbl.dotY);

            const startX = isLeft ? 22 : 78;
            const midX = isLeft ? 38 : 62;

            return (
              <g key={lbl.id}>
                {/* Horizontal line under/from text label */}
                <line 
                  x1={`${startX}%`} 
                  y1={`${labelYVal}%`} 
                  x2={`${midX}%`} 
                  y2={`${labelYVal}%`} 
                  stroke={lineColor} 
                  strokeWidth={lineWidth} 
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                />
                {/* Diagonal connection line to target muscle point */}
                <line 
                  x1={`${midX}%`} 
                  y1={`${labelYVal}%`} 
                  x2={`${dotXVal}%`} 
                  y2={`${dotYVal}%`} 
                  stroke={lineColor} 
                  strokeWidth={lineWidth} 
                  strokeDasharray={isActive ? 'none' : '2,2'}
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                />
                {/* Connector point on muscle */}
                <circle 
                  cx={`${dotXVal}%`} 
                  cy={`${dotYVal}%`} 
                  r={isActive ? '5' : '3.5'} 
                  fill={isActive ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.4)'} 
                  stroke="rgba(0,0,0,0.8)"
                  strokeWidth="1.5"
                  style={{ transition: 'all 0.2s' }}
                />
              </g>
            );
          })}
        </svg>

        {/* Left Side Interactive Text Buttons */}
        <div style={{
          position: 'absolute',
          left: '2%',
          top: 0,
          bottom: 0,
          width: '24%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px 0',
          zIndex: 20
        }}>
          {currentLabels.filter(l => l.side === 'left').map(lbl => {
            const isActive = activeMuscle === lbl.id;
            return (
              <button
                key={lbl.id}
                onClick={() => handleMuscleClick(lbl.id)}
                onMouseEnter={() => setHoveredMuscle(lbl.id)}
                onMouseLeave={() => setHoveredMuscle(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  margin: 0,
                  textAlign: 'left',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  fontSize: '13px',
                  fontWeight: isActive ? '800' : '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%',
                  position: 'absolute',
                  top: lbl.y,
                  transform: 'translateY(-50%)',
                  opacity: activeMuscle === 'todos' || isActive ? 1 : 0.6,
                  textShadow: isActive ? '0 0 8px rgba(200, 255, 0, 0.3)' : 'none'
                }}
              >
                {lbl.label}
              </button>
            );
          })}
        </div>

        {/* Right Side Interactive Text Buttons */}
        <div style={{
          position: 'absolute',
          right: '2%',
          top: 0,
          bottom: 0,
          width: '24%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px 0',
          zIndex: 20
        }}>
          {currentLabels.filter(l => l.side === 'right').map(lbl => {
            const isActive = activeMuscle === lbl.id;
            return (
              <button
                key={lbl.id}
                onClick={() => handleMuscleClick(lbl.id)}
                onMouseEnter={() => setHoveredMuscle(lbl.id)}
                onMouseLeave={() => setHoveredMuscle(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  margin: 0,
                  textAlign: 'right',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  fontSize: '13px',
                  fontWeight: isActive ? '800' : '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%',
                  position: 'absolute',
                  top: lbl.y,
                  transform: 'translateY(-50%)',
                  opacity: activeMuscle === 'todos' || isActive ? 1 : 0.6,
                  textShadow: isActive ? '0 0 8px rgba(200, 255, 0, 0.3)' : 'none'
                }}
              >
                {lbl.label}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Optional Info & Clear Filter Button */}
      <div className="flex-row justify-between align-center mt-md">
        <p className="text-caption text-secondary" style={{ fontSize: '11px', margin: 0 }}>
          💡 Pulsa los nombres de los grupos musculares a los lados de la silueta para filtrar los ejercicios.
        </p>
        {activeMuscle !== 'todos' && (
          <button
            onClick={() => handleMuscleClick('todos')}
            style={{
              padding: '6px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              color: 'var(--color-text-primary)',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            Limpiar Filtro
          </button>
        )}
      </div>
    </div>
  );
};

export default InteractiveBody;
