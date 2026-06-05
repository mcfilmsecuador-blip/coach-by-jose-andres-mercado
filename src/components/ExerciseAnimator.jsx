import React, { useState, useEffect } from 'react';

const ExerciseAnimator = ({ startImage, endImage, alt = "Animación de ejercicio", className = "", style = {}, imageStyle = {} }) => {
  const [activeFrame, setActiveFrame] = useState('start');

  useEffect(() => {
    if (!startImage || !endImage || startImage === endImage) return;

    const interval = setInterval(() => {
      setActiveFrame(prev => prev === 'start' ? 'end' : 'start');
    }, 700); // 0.7 segundos para un ritmo natural y fluido de repetición

    return () => clearInterval(interval);
  }, [startImage, endImage]);

  // Color de fondo exacto del catálogo de ejercicios para fusión perfecta
  const dynamicBgColor = '#191819';

  // Alternamos el recurso de la imagen directamente sobre un único elemento img estándar.
  // Esto elimina por completo los problemas de colapso de altura en CSS y posicionamiento absoluto,
  // garantizando que el navegador respete de manera estricta el 'object-fit: contain' y las dimensiones de la caja.
  const currentSrc = (activeFrame === 'start' || !endImage) ? startImage : endImage;

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={`${className}`} 
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'contain', 
        backgroundColor: dynamicBgColor, 
        ...style, 
        ...imageStyle 
      }}
    />
  );
};

export default ExerciseAnimator;
