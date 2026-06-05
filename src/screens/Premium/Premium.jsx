import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const Premium = ({ onBack }) => {
  const benefits = [
    "Rutinas 100% personalizadas.",
    "Dietas semanales avanzadas.",
    "Lista de compras inteligente.",
    "Mapa muscular detallado.",
    "Seguimiento de progreso avanzado.",
    "Recomendaciones inteligentes."
  ];

  return (
    <div className="screen-container flex-col" style={{ backgroundColor: 'var(--color-bg-base)', padding: 0 }}>
      <div style={{ position: 'relative', height: '220px', background: 'linear-gradient(135deg, #0B0D10 0%, #16191F 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <button 
          onClick={onBack}
          style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF', width: '40px', height: '40px', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-h1 text-primary text-center">COACH PREMIUM</h1>
        <p className="text-caption text-center mt-sm" style={{ color: 'var(--color-text-secondary)', maxWidth: '280px' }}>
          Desbloquea tu verdadero potencial con nuestro plan más avanzado.
        </p>
      </div>

      <div className="flex-col p-md flex-1" style={{ padding: '24px 16px' }}>
        <h3 className="text-h3 mb-md">¿Qué incluye?</h3>
        <div className="flex-col gap-sm mb-lg">
          {benefits.map((b, i) => (
            <div key={i} className="flex-row align-center gap-sm">
              <CheckCircle size={20} color="var(--color-primary)" />
              <span className="text-body text-secondary">{b}</span>
            </div>
          ))}
        </div>

        <h3 className="text-h3 mb-md">Elige tu plan</h3>
        <div className="flex-col gap-md mb-lg">
          <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg-surface)', cursor: 'pointer' }}>
            <div className="flex-row justify-between align-center">
              <span className="text-body" style={{ fontWeight: '600' }}>Mensual</span>
              <span className="text-h3" style={{ color: 'var(--color-primary)' }}>$9.99</span>
            </div>
          </div>
          <div style={{ padding: '16px', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(200,255,0,0.05)', position: 'relative', cursor: 'pointer' }}>
            <span style={{ position: 'absolute', top: '-12px', right: '16px', backgroundColor: 'var(--color-primary)', color: '#000', fontSize: '10px', padding: '4px 8px', borderRadius: '10px', fontWeight: 'bold' }}>RECOMENDADO</span>
            <div className="flex-row justify-between align-center">
              <span className="text-body" style={{ fontWeight: '600' }}>Anual</span>
              <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                <span className="text-h3" style={{ color: 'var(--color-primary)' }}>$59.99</span>
                <span className="text-caption" style={{ textDecoration: 'line-through' }}>$119.88</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 16px', backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}>
        <button style={{
          width: '100%', padding: '16px', backgroundColor: 'var(--color-primary)', color: '#000', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: '600', fontSize: '16px', cursor: 'pointer'
        }}>
          Activar Premium
        </button>
        <button onClick={onBack} style={{
          width: '100%', padding: '16px', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: 'none', fontWeight: '500', fontSize: '14px', marginTop: '8px', cursor: 'pointer'
        }}>
          Continuar gratis
        </button>
      </div>
    </div>
  );
};

export default Premium;
