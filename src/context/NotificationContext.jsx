import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePlan } from './PlanContext';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { userProfile } = usePlan();
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('coach_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Seed notifications on mount if they do not exist and userProfile is available
  useEffect(() => {
    const saved = localStorage.getItem('coach_notifications');
    if (!saved && userProfile) {
      // Seed initial welcoming notifications if empty
      const initialNotifs = [
        {
          id: Date.now() - 3600000 * 3, // 3 hours ago
          type: 'coach',
          title: '¡Bienvenido a Coach!',
          desc: 'Tu entrenador personal inteligente está listo para guiarte en tu camino al éxito.',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          read: false
        },
        {
          id: Date.now() - 3600000 * 2, // 2 hours ago
          type: 'nutrition',
          title: 'Plan nutricional listo',
          desc: `Calculamos tus macros ideales según tu objetivo de "${userProfile.goal ? userProfile.goal.replace('_', ' ') : 'ganar músculo'}".`,
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          read: false
        },
        {
          id: Date.now() - 3600000 * 1, // 1 hour ago
          type: 'workout',
          title: 'Rutina personalizada armada',
          desc: `Tu plan de ${userProfile.trainingDaysPerWeek || 4} días semanales está adaptado a tu nivel ${userProfile.experienceLevel || 'intermedio'}.`,
          timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
          read: false
        }
      ];
      setTimeout(() => {
        setNotifications(initialNotifs);
      }, 0);
      localStorage.setItem('coach_notifications', JSON.stringify(initialNotifs));
    }
  }, [userProfile]);

  const addNotification = useCallback((type, title, desc) => {
    const newNotif = {
      id: Date.now(),
      type,
      title,
      desc,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('coach_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('coach_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('coach_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('coach_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Generate smart daily contextual notifications
  useEffect(() => {
    if (!userProfile) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const lastNotifDate = localStorage.getItem('coach_last_notif_date');

    // Only check and generate once per day
    if (lastNotifDate === todayStr) return;

    const timer = setTimeout(() => {
      let generatedAny = false;

      // 1. Inactivity check (workout)
      if (userProfile.completedDays && userProfile.completedDays.length > 0) {
        const sortedDays = [...userProfile.completedDays].sort();
        const lastWorkoutDate = new Date(sortedDays[sortedDays.length - 1]);
        const diffTime = Math.abs(new Date() - lastWorkoutDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 3) {
          addNotification(
            'workout',
            '¡Hora de volver al gimnasio!',
            `Han pasado ${diffDays} días desde tu último entrenamiento registrado. ¡Mantén la disciplina!`
          );
          generatedAny = true;
        }
      }

      // 2. Training day reminder
      const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const todayDayName = dayNames[new Date().getDay()];
      if (userProfile.selectedTrainingDays && userProfile.selectedTrainingDays.includes(todayDayName)) {
        addNotification(
          'workout',
          '¡Hoy se entrena!',
          'Según tu cronograma semanal de entrenamiento, hoy es día de actividad. ¡A darlo todo!'
        );
        generatedAny = true;
      }

      // 3. Weight log reminder
      if (userProfile.weightHistory && userProfile.weightHistory.length > 0) {
        const sortedWeights = [...userProfile.weightHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
        const lastWeightEntry = new Date(sortedWeights[sortedWeights.length - 1].date);
        const diffTime = Math.abs(new Date() - lastWeightEntry);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 7) {
          addNotification(
            'progress',
            'Registra tu peso semanal',
            'Es momento de actualizar tu peso corporal en el perfil para mantener tus gráficos al día.'
          );
          generatedAny = true;
        }
      }

      // 4. Goal-specific motivation if nothing else was generated today
      if (!generatedAny) {
        const goal = userProfile.goal || 'ganar_musculo';
        if (goal === 'ganar_musculo') {
          addNotification(
            'coach',
            'Tip de Nutrición: Proteína',
            'Para maximizar la hipertrofia, asegúrate de consumir suficiente proteína en cada comida y dormir al menos 7-8 horas.'
          );
        } else if (goal === 'perder_peso' || goal === 'definir') {
          addNotification(
            'coach',
            'Tip de Pérdida de Grasa',
            'Prioriza alimentos altos en volumen y bajos en calorías como vegetales verdes y carnes magras para mantener la saciedad.'
          );
        } else {
          addNotification(
            'coach',
            'Mantén la constancia',
            'La constancia es la clave del progreso físico a largo plazo. Pequeños hábitos diarios suman grandes resultados.'
          );
        }
      }

      localStorage.setItem('coach_last_notif_date', todayStr);
    }, 0);

    return () => clearTimeout(timer);
  }, [userProfile, addNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
