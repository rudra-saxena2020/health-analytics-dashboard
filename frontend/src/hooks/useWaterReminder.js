import { useEffect } from 'react';

export const useWaterReminder = () => {
  useEffect(() => {
    const checkReminders = () => {
      const enabled = localStorage.getItem('waterRemindersEnabled') === 'true';
      const interval = parseFloat(localStorage.getItem('waterReminderInterval')) || 2;
      const lastReminder = localStorage.getItem('lastWaterReminder');
      
      if (!enabled) return;

      const now = Date.now();
      const intervalMs = interval * 60 * 60 * 1000;

      if (!lastReminder || now - parseInt(lastReminder) >= intervalMs) {
        sendNotification();
        localStorage.setItem('lastWaterReminder', now.toString());
      }
    };

    const sendNotification = () => {
      if (Notification.permission === 'granted') {
        new Notification('Time to Drink Water! 💧', {
          body: 'Stay hydrated! It is time for your scheduled water break.',
          icon: '/favicon.ico' // Or any water icon
        });
      }
    };

    // Check every minute
    const timer = setInterval(checkReminders, 60000);
    
    // Initial check
    checkReminders();

    return () => clearInterval(timer);
  }, []);
};
