import React, { useState } from 'react';
import { ArrowLeft, RotateCw } from 'lucide-react';

const musclesConfig = {
  front: [
    { id: 'pecho', name: 'Pecho', shapes: [
      { cx: '42%', cy: '26%', rx: '12%', ry: '4.5%' },
      { cx: '58%', cy: '26%', rx: '12%', ry: '4.5%' }
    ]},
    { id: 'hombros', name: 'Hombros', shapes: [
      { cx: '28%', cy: '23%', rx: '6%', ry: '9%' },
      { cx: '72%', cy: '23%', rx: '6%', ry: '9%' }
    ]},
    { id: 'biceps', name: 'Bíceps', shapes: [
      { cx: '22%', cy: '32%', rx: '5%', ry: '7%' },
      { cx: '78%', cy: '32%', rx: '5%', ry: '7%' }
    ]},
    { id: 'antebrazos', name: 'Antebrazos', shapes: [
      { cx: '18%', cy: '43%', rx: '4.5%', ry: '8%' },
      { cx: '82%', cy: '43%', rx: '4.5%', ry: '8%' }
    ]},
    { id: 'abdomen', name: 'Abdomen/Core', shapes: [
      { cx: '50%', cy: '36%', rx: '12%', ry: '9%' }
    ]},
    { id: 'cuadriceps', name: 'Cuádriceps', shapes: [
      { cx: '37%', cy: '58%', rx: '9%', ry: '17%' },
      { cx: '62%', cy: '58%', rx: '9%', ry: '17%' }
    ]},
    { id: 'aductores', name: 'Aductores', shapes: [
      { cx: '46%', cy: '61%', rx: '4%', ry: '14%' },
      { cx: '54%', cy: '61%', rx: '4%', ry: '14%' }
    ]}
  ],
  back: [
    { id: 'trapecio/cuello', name: 'Trapecio/Cuello', shapes: [
      { cx: '50%', cy: '20%', rx: '12%', ry: '7%' }
    ]},
    { id: 'espalda', name: 'Espalda', shapes: [
      { cx: '37%', cy: '32%', rx: '9%', ry: '14%' },
      { cx: '63%', cy: '32%', rx: '9%', ry: '14%' }
    ]},
    { id: 'triceps', name: 'Tríceps', shapes: [
      { cx: '23%', cy: '32%', rx: '5%', ry: '8%' },
      { cx: '77%', cy: '32%', rx: '5%', ry: '8%' }
    ]},
    { id: 'gluteos', name: 'Glúteos', shapes: [
      { cx: '40%', cy: '49%', rx: '11%', ry: '9%' },
      { cx: '60%', cy: '49%', rx: '11%', ry: '9%' }
    ]},
    { id: 'isquiotibiales', name: 'Isquiotibiales', shapes: [
      { cx: '39%', cy: '61%', rx: '8%', ry: '15%' },
      { cx: '61%', cy: '61%', rx: '8%', ry: '15%' }
    ]},
    { id: 'pantorrillas', name: 'Pantorrillas', shapes: [
      { cx: '39%', cy: '78%', rx: '6.5%', ry: '11%' },
      { cx: '61%', cy: '78%', rx: '6.5%', ry: '11%' }
    ]}
  ]
};

const MuscleMap = ({ onBack, exercise, onSelectMuscle }) => {
  const [viewSide, setViewSide] = useState('front'); // 'front' or 'back'
  const [hoveredMuscle, setHoveredMuscle] = useState(null);

  const handleMuscleClick = (muscleName) => {
    if (onSelectMuscle) {
      onSelectMuscle(muscleName);
    }
  };

  const normalizeText = (text) => {
    return text
      ? text
          .toString()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim()
      : "";
  };

  const getMuscleStatus = (muscleId) => {
    if (exercise) {
      const main = normalizeText(exercise.mainMuscle);
      const secondaries = (exercise.secondaryMuscles || []).map(m => normalizeText(m));
      const normId = normalizeText(muscleId);

      if (main === normId || main.includes(normId) || normId.includes(main)) {
        return 'primary';
      }
      if (secondaries.some(s => s === normId || s.includes(normId) || normId.includes(s))) {
        return 'secondary';
      }
      return 'inactive';
    }

    return hoveredMuscle === muscleId ? 'hovered' : 'default';
  };

  return (
    <div className="screen-container" style={{
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#000000'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
        backgroundColor: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="flex-row align-center gap-md" style={{ flex: 1 }}>
          <button 
            onClick={onBack} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--color-text-primary)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-h2" style={{ margin: 0, fontFamily: "'Outfit', sans-serif" }}>Filtro por Mapa Muscular</h2>
        </div>
      </div>

      <div style={{
        padding: '24px 16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <p className="text-caption text-secondary text-center mb-lg" style={{ maxWidth: '280px', fontSize: '12px' }}>
          Toca cualquier zona muscular en la silueta para filtrar ejercicios de ese grupo o ver su activación.
        </p>

        {/* Anatomical container */}
        <div style={{ 
          width: '240px', 
          height: '380px', 
          backgroundColor: '#000000', 
          border: '1px solid var(--color-border)', 
          borderRadius: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Centered Body Image Container (190px x 380px) */}
          <div style={{
            width: '190px',
            height: '100%',
            position: 'relative',
            zIndex: 2
          }}>
            <img 
              src={viewSide === 'front' ? '/cuerpo/cuerpo_anterior.webp' : '/cuerpo/cuerpo_posterior.webp'} 
              alt="Cuerpo Humano" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            
            {/* SVG overlay for interactive highlights */}
            <svg style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 3
            }}>
              <defs>
                <filter id="neon-glow-map">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Render shapes from config */}
              {musclesConfig[viewSide].map((muscle) => {
                const status = getMuscleStatus(muscle.id);
                
                // Get style based on status
                let fill = 'transparent';
                let stroke = 'rgba(255, 255, 255, 0.03)';
                let strokeWidth = '0.5';
                let strokeDasharray = 'none';
                let filter = 'none';
                let opacity = 1;

                if (status === 'primary') {
                  fill = 'rgba(200, 255, 0, 0.65)';
                  stroke = 'var(--color-primary)';
                  strokeWidth = '1.5';
                  filter = 'url(#neon-glow-map)';
                } else if (status === 'secondary') {
                  fill = 'rgba(200, 255, 0, 0.25)';
                  stroke = 'var(--color-primary)';
                  strokeWidth = '1';
                  strokeDasharray = '2,2';
                  filter = 'url(#neon-glow-map)';
                } else if (status === 'inactive') {
                  fill = 'rgba(255, 255, 255, 0.01)';
                  stroke = 'rgba(255, 255, 255, 0.02)';
                  strokeWidth = '0.3';
                  opacity = 0.25;
                } else if (status === 'hovered') {
                  fill = 'rgba(200, 255, 0, 0.45)';
                  stroke = 'var(--color-primary)';
                  strokeWidth = '1.5';
                  filter = 'url(#neon-glow-map)';
                } else if (status === 'default') {
                  fill = 'rgba(255, 255, 255, 0.001)'; // invisible but captures mouse events
                  stroke = 'rgba(255, 255, 255, 0.04)';
                  strokeWidth = '0.5';
                }

                return (
                  <g 
                    key={muscle.id}
                    onClick={() => handleMuscleClick(muscle.name)}
                    onMouseEnter={() => setHoveredMuscle(muscle.id)}
                    onMouseLeave={() => setHoveredMuscle(null)}
                    style={{ cursor: 'pointer', opacity, transition: 'all 0.2s' }}
                  >
                    {muscle.shapes.map((shape, idx) => (
                      <ellipse
                        key={idx}
                        cx={shape.cx}
                        cy={shape.cy}
                        rx={shape.rx}
                        ry={shape.ry}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        filter={filter}
                        style={{ transition: 'all 0.2s' }}
                      />
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Giro button inside box */}
          <button
            onClick={() => setViewSide(prev => prev === 'front' ? 'back' : 'front')}
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              backgroundColor: 'var(--color-primary)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#000',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              zIndex: 30
            }}
          >
            <RotateCw size={18} />
          </button>
          
          <div style={{ 
            position: 'absolute', 
            bottom: '16px', 
            left: '16px', 
            backgroundColor: 'rgba(0,0,0,0.6)', 
            padding: '4px 8px', 
            borderRadius: '4px', 
            border: '1px solid rgba(255,255,255,0.05)',
            zIndex: 30 
          }}>
            <span className="text-caption" style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
              {viewSide === 'front' ? 'VISTA ANTERIOR' : 'VISTA POSTERIOR'}
            </span>
          </div>
        </div>

        {/* Visor HUD */}
        <div style={{
          marginTop: '15px',
          padding: '8px 16px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '10px',
          border: '1.5px solid rgba(200, 255, 0, 0.15)',
          width: '100%',
          maxWidth: '240px',
          textAlign: 'center',
          boxShadow: '0 0 10px rgba(200, 255, 0, 0.05)'
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: hoveredMuscle ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.4)',
            fontFamily: "'Outfit', sans-serif",
            textTransform: 'uppercase',
            transition: 'color 0.2s'
          }}>
            {hoveredMuscle 
              ? `Escanear: ${musclesConfig[viewSide].find(m => m.id === hoveredMuscle)?.name}` 
              : exercise 
                ? 'Área de Activación' 
                : 'Seleccionar Músculo'}
          </span>
        </div>

        {/* Info Legend */}
        <div className="flex-row justify-between w-100 mt-lg" style={{ 
          width: '100%', 
          padding: '12px', 
          backgroundColor: 'var(--color-bg-surface)', 
          borderRadius: '8px', 
          border: '1px solid var(--color-border)' 
        }}>
          <span className="text-caption text-secondary" style={{ fontSize: '11px', textAlign: 'center', width: '100%' }}>
            Cambia la vista del cuerpo tocando el botón de rotación.
          </span>
        </div>
      </div>
    </div>
  );
};

export default MuscleMap;
