import React, { useEffect, useState } from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleCancel = () => {
    setVisible(false);
    setTimeout(onCancel, 250);
  };

  const handleConfirm = () => {
    setVisible(false);
    setTimeout(onConfirm, 250);
  };

  return (
    <div className={`confirm-overlay ${visible ? 'confirm-overlay--visible' : ''}`} onClick={handleCancel}>
      <div className={`confirm-modal ${visible ? 'confirm-modal--visible' : ''}`} onClick={e => e.stopPropagation()}>
        <h3 className="confirm-modal__title">{title}</h3>
        <p className="confirm-modal__message">{message}</p>
        <div className="confirm-modal__actions">
          <button className="confirm-modal__btn confirm-modal__btn--cancel" onClick={handleCancel}>
            {cancelText}
          </button>
          <button className="confirm-modal__btn confirm-modal__btn--confirm" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
