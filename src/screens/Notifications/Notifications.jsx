import React from 'react';
import { ArrowLeft, Bell, Dumbbell, Utensils, Sparkles, Trophy, TrendingUp, Check, Trash } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const Notifications = ({ onBack }) => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotifications();

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = Math.abs(now - past);
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Ahora';
    if (diffMin < 60) return `Hace ${diffMin}m`;
    if (diffHr < 24) return `Hace ${diffHr}h`;
    return `Hace ${diffDays}d`;
  };

  const getIcon = (type, read) => {
    const color = read ? 'var(--color-text-secondary)' : 'var(--color-primary)';
    const size = 20;
    
    switch (type) {
      case 'workout':
        return <Dumbbell size={size} color={color} />;
      case 'nutrition':
        return <Utensils size={size} color={color} />;
      case 'coach':
        return <Sparkles size={size} color={color} />;
      case 'achievement':
        return <Trophy size={size} color={color} />;
      case 'progress':
        return <TrendingUp size={size} color={color} />;
      default:
        return <Bell size={size} color={color} />;
    }
  };

  return (
    <div className="screen-container" style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: 'var(--color-bg-surface)', 
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="flex-row align-center gap-md">
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-h2" style={{ margin: 0 }}>Notificaciones</h2>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '16px',
              backgroundColor: 'rgba(200, 255, 0, 0.05)',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(200, 255, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(200, 255, 0, 0.05)'}
          >
            <Check size={14} /> Marcar leídas
          </button>
        )}
      </div>

      {/* List Container */}
      <div style={{ padding: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
        {notifications.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '60px 20px', 
            textAlign: 'center',
            gap: '16px'
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              border: '1px solid var(--color-border)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Bell size={28} color="var(--color-text-secondary)" />
            </div>
            <div>
              <h3 className="text-body" style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>Sin notificaciones</h3>
              <p className="text-caption" style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Te avisaremos cuando haya novedades sobre tus entrenamientos o plan.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-col gap-sm">
            {notifications.map(n => (
              <div 
                key={n.id} 
                onClick={() => !n.read && markAsRead(n.id)}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  padding: '16px', 
                  backgroundColor: 'var(--color-bg-surface)', 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid var(--color-border)',
                  borderLeft: n.read ? '1px solid var(--color-border)' : '4px solid var(--color-primary)',
                  cursor: n.read ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ marginRight: '16px', marginTop: '2px' }}>
                  {getIcon(n.type, n.read)}
                </div>
                <div className="flex-col flex-1" style={{ marginRight: '24px' }}>
                  <div className="flex-row justify-between mb-xs" style={{ alignItems: 'flex-start' }}>
                    <h4 className="text-body" style={{ 
                      fontSize: '14px', 
                      margin: 0,
                      fontWeight: n.read ? '500' : '700', 
                      color: n.read ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' 
                    }}>
                      {n.title}
                    </h4>
                    <span className="text-caption" style={{ fontSize: '11px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                      {getRelativeTime(n.timestamp)}
                    </span>
                  </div>
                  <p className="text-caption" style={{ 
                    fontSize: '12px', 
                    margin: '4px 0 0 0',
                    lineHeight: '1.4',
                    color: n.read ? 'rgba(255,255,255,0.4)' : 'var(--color-text-secondary)' 
                  }}>
                    {n.desc}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n.id);
                  }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '16px',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
