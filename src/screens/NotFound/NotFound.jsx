import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div 
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#0B0D10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center'
      }}
    >
      {/* Icon */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'rgba(200, 255, 0, 0.06)',
        border: '2px solid rgba(200, 255, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <AlertCircle size={36} style={{ color: 'var(--color-primary)' }} />
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '56px',
        fontWeight: '800',
        color: 'var(--color-primary)',
        margin: '0 0 8px 0',
        lineHeight: 1
      }}>
        404
      </h1>
      
      <h2 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '20px',
        fontWeight: '700',
        color: '#fff',
        margin: '0 0 8px 0'
      }}>
        Página no encontrada
      </h2>
      
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '14px',
        color: 'var(--color-text-secondary)',
        maxWidth: '280px',
        lineHeight: 1.5,
        margin: '0 0 32px 0'
      }}>
        La ruta que buscas no existe o ha sido movida.
      </p>

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px 28px',
          borderRadius: '12px',
          backgroundColor: 'var(--color-primary)',
          color: '#0B0D10',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '15px',
          fontWeight: '700',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <Home size={18} />
        Volver al Inicio
      </button>
    </div>
  );
};

export default NotFound;
