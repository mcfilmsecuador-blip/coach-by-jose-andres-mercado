import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const intervalTime = 30; // ms
    const totalTime = 2500; // ms
    const step = 100 / (totalTime / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsLoaded(true);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    // Call onFinish after 3500ms
    const finishTimer = setTimeout(onFinish, 3500);

    return () => {
      clearInterval(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: '#0B0D10', 
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <style>{`
        @keyframes logoGlow {
          0% {
            filter: drop-shadow(0 0 2px rgba(200, 255, 0, 0.05));
            transform: scale(0.96);
          }
          50% {
            filter: drop-shadow(0 0 25px rgba(200, 255, 0, 0.45)) drop-shadow(0 0 10px rgba(200, 255, 0, 0.3));
            transform: scale(1.03);
          }
          100% {
            filter: drop-shadow(0 0 18px rgba(200, 255, 0, 0.35)) drop-shadow(0 0 6px rgba(200, 255, 0, 0.2));
            transform: scale(1.015);
          }
        }
        @keyframes subtlePulse {
          0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.95); }
          50% { opacity: 0.65; transform: translate(-50%, -50%) scale(1.05); }
          100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.95); }
        }
      `}</style>

      {/* Decorative Radial Background Aura */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '45%',
          left: '50%',
          width: '380px', 
          height: '380px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(200, 255, 0, 0.15) 0%, rgba(200, 255, 0, 0) 70%)', 
          filter: 'blur(35px)', 
          zIndex: 0, 
          pointerEvents: 'none', 
          transform: isLoaded ? 'translate(-50%, -50%) scale(1.25)' : 'translate(-50%, -50%) scale(0.9)', 
          animation: 'subtlePulse 4s ease-in-out infinite',
          transition: 'transform 1.8s cubic-bezier(0.25, 1, 0.5, 1)' 
        }} 
      />

      {/* Logo Container */}
      <div 
        style={{ 
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img 
          src="/logo_coach.png" 
          alt="Coach Logo" 
          style={{ 
            width: '286px', 
            height: '286px', 
            objectFit: 'contain',
            borderRadius: '32px',
            transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
            animation: isLoaded ? 'logoGlow 1.4s ease-in-out forwards' : 'none'
          }} 
        />
      
        {/* Progress Bar Container — justo debajo del logo */}
        <div 
          style={{ 
            marginTop: '40px',
            width: '180px', 
            height: '6px', 
            backgroundColor: 'rgba(255, 255, 255, 0.04)', 
            borderRadius: '10px', 
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)'
          }}
        >
          <div 
            style={{ 
              width: `${Math.min(progress, 100)}%`, 
              height: '100%', 
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 0 12px var(--color-primary)',
              transition: 'width 0.08s linear',
              borderRadius: '10px'
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
