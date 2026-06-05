import React from 'react';
import { Bell, ArrowLeft } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const AppHeader = ({ title, subtitle, showBack, onBack, onNotificationsClick, avatar }) => {
  const { unreadCount } = useNotifications();
  const showUnread = unreadCount > 0;

  return (
    <header 
      className="flex-row justify-between align-center mb-lg" 
      style={{ 
        paddingBottom: '16px', 
        borderBottom: '1px solid var(--color-border)',
        width: '100%',
        marginTop: '8px'
      }}
    >
      {showBack ? (
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
      ) : (
        <div className="flex-col" style={{ minWidth: 0, flex: 1, marginRight: '16px' }}>
          <h1 
            style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontSize: '22px', 
              fontWeight: '800', 
              color: '#FFF', 
              margin: 0,
              letterSpacing: '-0.5px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title || 'Hola'}
          </h1>
          <span 
            style={{ 
              fontSize: '12px', 
              color: 'var(--color-text-secondary)', 
              marginTop: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block'
            }}
          >
            {subtitle || 'Hoy tienes entrenamiento de fuerza superior.'}
          </span>
        </div>
      )}
      
      <div className="flex-row align-center gap-md" style={{ flexShrink: 0 }}>
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
    </header>
  );
};

export default AppHeader;
