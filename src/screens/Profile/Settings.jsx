import React, { useState } from 'react';
import { ArrowLeft, User, Bell, Shield, Moon, Trash2 } from 'lucide-react';

const Settings = ({ onBack }) => {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="screen-container" style={{ padding: 0 }}>
      <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex-row align-center gap-md">
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-h2">Configuración</h2>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <h3 className="text-caption mb-sm">Ajustes Visuales</h3>
        <div className="flex-col gap-xs mb-lg">
          <div className="flex-row justify-between align-center" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)' }}>
            <div className="flex-row align-center gap-md">
              <Moon size={20} color="var(--color-text-secondary)" />
              <span className="text-body">Modo Oscuro</span>
            </div>
            <button onClick={toggleTheme} style={{ padding: '4px 12px', borderRadius: '16px', border: '1px solid var(--color-primary)', backgroundColor: theme === 'dark' ? 'var(--color-primary)' : 'transparent', color: theme === 'dark' ? '#000' : 'var(--color-text-primary)', cursor: 'pointer' }}>
              {theme === 'dark' ? 'Activado' : 'Desactivado'}
            </button>
          </div>
        </div>

        <h3 className="text-caption mb-sm">Cuenta y Seguridad</h3>
        <div className="flex-col gap-xs mb-lg">
          <div className="flex-row align-center gap-md" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)' }}>
            <User size={20} color="var(--color-text-secondary)" />
            <span className="text-body">Editar Perfil</span>
          </div>
          <div className="flex-row align-center gap-md" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)' }}>
            <Bell size={20} color="var(--color-text-secondary)" />
            <span className="text-body">Preferencias de Notificación</span>
          </div>
          <div className="flex-row align-center gap-md" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)' }}>
            <Shield size={20} color="var(--color-text-secondary)" />
            <span className="text-body">Privacidad</span>
          </div>
        </div>

        <h3 className="text-caption mb-sm">Zona de Peligro</h3>
        <div className="flex-col gap-xs">
          <div className="flex-row align-center gap-md" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)' }}>
            <Trash2 size={20} color="var(--color-error)" />
            <span className="text-body" style={{ color: 'var(--color-error)' }}>Eliminar cuenta</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
