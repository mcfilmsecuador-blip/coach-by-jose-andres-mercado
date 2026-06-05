import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, Trophy } from 'lucide-react';
import './Toast.css';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  achievement: Trophy,
};

const Toast = ({ message, type = 'success', duration = 3500, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const Icon = iconMap[type] || Info;

  useEffect(() => {
    const dismissTimer = setTimeout(() => {
      setExiting(true);
    }, duration);

    const removeTimer = setTimeout(() => {
      onDismiss();
    }, duration + 400);

    return () => {
      clearTimeout(dismissTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onDismiss]);

  return (
    <div className={`toast toast--${type} ${exiting ? 'toast--exit' : 'toast--enter'}`}>
      <div className="toast__icon">
        <Icon size={20} />
      </div>
      <p className="toast__message">{message}</p>
    </div>
  );
};

export default Toast;
