import React from 'react';
import './GlassCard.css';

const GlassCard = ({ children, blur = 16, padding = '20px', borderRadius = '20px', className = '', style = {}, ...props }) => {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        padding,
        borderRadius,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
