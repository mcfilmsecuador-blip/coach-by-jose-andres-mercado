import React from 'react';
import './States.css';

export const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="skeleton-box" style={{ width: '100%', height: '120px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }} />
    );
  }

  if (type === 'text') {
    return (
      <div className="flex-col gap-sm w-100" style={{ width: '100%', marginBottom: '16px' }}>
        <div className="skeleton-box" style={{ width: '80%', height: '24px', borderRadius: '4px' }} />
        <div className="skeleton-box" style={{ width: '60%', height: '16px', borderRadius: '4px' }} />
      </div>
    );
  }

  if (type === 'list-item') {
    return (
      <div className="flex-row gap-md" style={{ width: '100%', marginBottom: '16px', alignItems: 'center' }}>
        <div className="skeleton-box" style={{ width: '60px', height: '60px', borderRadius: '8px' }} />
        <div className="flex-col gap-sm" style={{ flex: 1 }}>
          <div className="skeleton-box" style={{ width: '70%', height: '16px', borderRadius: '4px' }} />
          <div className="skeleton-box" style={{ width: '40%', height: '12px', borderRadius: '4px' }} />
        </div>
      </div>
    );
  }

  return null;
};

export const EmptyState = ({ icon: Icon, title, message, actionLabel, onAction }) => {
  return (
    <div className="flex-col flex-center text-center p-lg" style={{ flex: 1, minHeight: '300px' }}>
      {Icon && <Icon size={64} color="var(--color-text-secondary)" style={{ marginBottom: '16px', opacity: 0.5 }} />}
      <h3 className="text-h3 mb-sm">{title}</h3>
      <p className="text-body text-secondary mb-lg" style={{ maxWidth: '280px' }}>{message}</p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          style={{ padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', fontWeight: '600', cursor: 'pointer' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
