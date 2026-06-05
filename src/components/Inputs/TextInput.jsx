import React, { useState } from 'react';

const TextInput = ({ label, type = 'text', placeholder, value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {label && (
        <label 
          style={{ 
            fontSize: '12px', 
            color: isFocused ? 'var(--color-primary)' : 'var(--color-text-secondary)', 
            fontWeight: '700',
            fontFamily: "'Outfit', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            transition: 'color 0.2s ease' 
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          padding: '14px 16px',
          backgroundColor: isFocused ? 'rgba(22, 25, 31, 0.85)' : 'var(--color-bg-base)',
          border: `1.5px solid ${error ? 'var(--color-error)' : isFocused ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: '12px',
          color: 'var(--color-text-primary)',
          fontSize: '15px',
          fontFamily: "'Inter', sans-serif",
          outline: 'none',
          boxShadow: isFocused ? '0 0 12px rgba(200, 255, 0, 0.15)' : 'none',
          transition: 'all 0.2s ease-in-out',
        }}
      />
      {error && <span style={{ fontSize: '12px', color: 'var(--color-error)' }}>{error}</span>}
    </div>
  );
};

export default TextInput;
