import React, { createContext, useContext, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message, type = 'info', duration = 4000, triggerConfetti = false }) => {
      const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
      const newToast = { id, title, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (triggerConfetti) {
        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#10b981', '#34d399', '#3b82f6', '#f59e0b'],
          });
        } catch (e) {
          // ignore if canvas not ready
        }
      }

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
