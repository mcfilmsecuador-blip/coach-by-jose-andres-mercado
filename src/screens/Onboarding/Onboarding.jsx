import React, { useState } from 'react';
import { Dumbbell, Activity, Utensils, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Dumbbell,
    title: "Entrena con propósito",
    text: "Rutinas diarias adaptadas a tu objetivo, nivel y disponibilidad."
  },
  {
    icon: Activity,
    title: "Aprende la técnica correcta",
    text: "Cada ejercicio te muestra cómo ejecutarlo y qué músculos estás trabajando."
  },
  {
    icon: Utensils,
    title: "Come según tu objetivo",
    text: "Planes de alimentación balanceados, adaptados a tu país, ciudad y rutina del día."
  },
  {
    icon: TrendingUp,
    title: "Mide tu progreso",
    text: "Sigue tus avances, mejora tu constancia y construye un hábito real."
  }
];

const stepColors = [
  'rgba(200, 255, 0, 0.12)', // Neon Green
  'rgba(255, 255, 255, 0.08)', // White/Gray
  'rgba(138, 143, 152, 0.12)', // Brand Gray
  'rgba(200, 255, 0, 0.12)'  // Neon Green
];

const accentColors = [
  '#C8FF00', // Neon Green
  '#FFFFFF', // White
  '#8A8F98', // Gray
  '#C8FF00'  // Neon Green
];

const Onboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div 
      className="screen-container flex-col" 
      style={{ 
        justifyContent: 'space-between', 
        paddingBottom: 'var(--spacing-lg)',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0B0D10'
      }}
    >
      <style>{`
        @keyframes floatIcon {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.5; }
          100% { transform: scale(1.25); opacity: 0; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Dynamic Background Glow changing according to slide */}
      <div 
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${stepColors[currentStep]} 0%, transparent 70%)`,
          filter: 'blur(40px)',
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'background 0.5s ease-in-out'
        }}
      />

      {/* Top Header Row */}
      <div className="flex-row justify-between align-center mt-md" style={{ zIndex: 1 }}>
        <span style={{ fontSize: '11px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase' }}>COACH APP</span>
        <button 
          onClick={handleSkip} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.04)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            color: 'var(--color-text-secondary)', 
            fontSize: '13px', 
            cursor: 'pointer',
            padding: '6px 14px',
            borderRadius: '16px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.04)'}
        >
          Saltar
        </button>
      </div>

      {/* Main Illustration Area */}
      <div className="flex-col flex-center flex-1" style={{ zIndex: 1, margin: '20px 0' }}>
        {/* Animated Icon Circle Badge */}
        <div style={{
          position: 'relative',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(22, 25, 31, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: `inset 0 0 20px rgba(255, 255, 255, 0.02), 0 12px 36px rgba(0,0,0,0.5)`,
          marginBottom: '32px'
        }}>
          {/* Pulsing Outer Ring */}
          <div style={{
            position: 'absolute',
            top: '-6px',
            left: '-6px',
            right: '-6px',
            bottom: '-6px',
            borderRadius: '50%',
            border: `1.5px solid ${accentColors[currentStep]}`,
            opacity: 0.35,
            animation: 'pulseRing 3s cubic-bezier(0.215, 0.610, 0.355, 1) infinite'
          }} />

          {/* Floating Icon wrapper */}
          <div style={{ 
            color: accentColors[currentStep],
            zIndex: 2,
            animation: 'floatIcon 3.5s ease-in-out infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: `drop-shadow(0 4px 10px ${stepColors[currentStep]})`
          }}>
            <CurrentIcon size={76} strokeWidth={1.1} />
          </div>
        </div>

        {/* Text Glassmorphic Card Container */}
        <div 
          key={currentStep} // triggers keyframe animation on change
          style={{
            background: 'rgba(22, 25, 31, 0.65)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '24px',
            padding: '28px 20px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.4)',
            textAlign: 'center',
            animation: 'slideInUp 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          <h1 
            style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontSize: '24px', 
              fontWeight: '800', 
              lineHeight: '1.25',
              marginBottom: '12px',
              color: '#FFF'
            }}
          >
            {steps[currentStep].title}
          </h1>
          <p 
            style={{ 
              fontFamily: "'Inter', sans-serif", 
              fontSize: '14px', 
              lineHeight: '1.5',
              color: 'var(--color-text-secondary)', 
              maxWidth: '280px',
              margin: '0'
            }}
          >
            {steps[currentStep].text}
          </p>
        </div>
      </div>

      {/* Footer Controls Area */}
      <div className="flex-col gap-lg mt-md" style={{ zIndex: 1 }}>
        {/* Shifting Capsules Progress Dots */}
        <div className="flex-row flex-center gap-sm">
          {steps.map((_, idx) => {
            const isSelected = currentStep === idx;
            return (
              <div 
                key={idx} 
                style={{ 
                  width: isSelected ? '28px' : '8px', 
                  height: '8px', 
                  borderRadius: '4px', 
                  backgroundColor: isSelected ? accentColors[currentStep] : 'rgba(255, 255, 255, 0.15)',
                  boxShadow: isSelected ? `0 0 10px ${accentColors[currentStep]}` : 'none',
                  transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
                }} 
              />
            );
          })}
        </div>
        
        {/* Styled CTA Button */}
        <button 
          onClick={handleNext} 
          style={{ 
            width: '100%', 
            padding: '16px', 
            backgroundColor: accentColors[currentStep], 
            color: '#000', 
            border: 'none', 
            borderRadius: 'var(--radius-sm)',
            fontWeight: '700',
            fontSize: '16px',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '0.5px',
            cursor: 'pointer',
            boxShadow: `0 8px 24px -6px ${accentColors[currentStep]}`,
            transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          {currentStep === steps.length - 1 ? 'Comenzar ahora' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
