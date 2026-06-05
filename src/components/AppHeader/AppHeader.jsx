import React from 'react';
import { Bell, ArrowLeft } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const AppHeader = ({ title, subtitle, showBack, onBack, onNotificationsClick, avatar }) => {
  const { unreadCount } = useNotifications();
  const showUnread = unreadCount > 0;

  return (
    <header 
      style={{ 
        paddingBottom: '16px', 
        borderBottom: '1px solid var(--color-border)',
        width: '100%',
        marginTop: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      {/* Row 1: Logo/Back Button + Profile/Notifications */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {showBack ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={onBack} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--color-text-primary)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
            >
              <ArrowLeft size={24} />
            </button>
            <span className="text-body" style={{ fontWeight: '700' }}>{title}</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <img 
              src="/logo_coach_transparent.png" 
              alt="Coach Logo" 
              style={{ height: '40px', objectFit: 'contain' }} 
            />
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px', fontWeight: '500' }}>
              Entrenamiento Personal
            </span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <button 
            onClick={onNotificationsClick} 
            style={{ 
              position: 'relative', 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              color: 'var(--color-text-primary)', 
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            <Bell size={20} />
            {showUnread && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '-4px', 
                  right: '-4px', 
                  minWidth: '16px', 
                  height: '16px', 
                  backgroundColor: 'var(--color-primary)', 
                  borderRadius: '8px',
                  color: '#000',
                  fontSize: '10px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: '0 0 6px var(--color-primary)',
                  boxSizing: 'border-box'
                }} 
              >
                {unreadCount}
              </div>
            )}
          </button>
          {!showBack && (
            <img 
              src={avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
              alt="Avatar" 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                border: '2px solid var(--color-primary)', 
                objectFit: 'cover',
                boxShadow: '0 0 8px rgba(200, 255, 0, 0.15)'
              }} 
            />
          )}
        </div>
      </div>

      {/* Row 2: Greeting + Active workout subtitle */}
      {!showBack && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <h2 
            style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontSize: '18px', 
              fontWeight: '800', 
              color: '#FFF', 
              margin: 0,
              letterSpacing: '-0.3px'
            }}
          >
            {title}
          </h2>
          <span 
            style={{ 
              fontSize: '12px', 
              color: 'var(--color-text-secondary)', 
              fontWeight: '500'
            }}
          >
            {subtitle}
          </span>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
