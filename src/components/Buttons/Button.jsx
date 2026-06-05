import React from 'react';

const Button = ({ title, onPress, type = 'primary', style = {}, disabled = false }) => {
  const isPrimary = type === 'primary';
  
  const baseStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: '600',
    fontSize: '16px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
  };

  const typeStyle = isPrimary
    ? { backgroundColor: 'var(--color-primary)', color: '#000' }
    : { backgroundColor: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' };

  return (
    <button 
      onClick={onPress} 
      disabled={disabled}
      style={{ ...baseStyle, ...typeStyle, ...style }}
    >
      {title}
    </button>
  );
};

export default Button;
