import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

export const useGlobalNotifications = () => {
  useEffect(() => {
    // Initialize notifications when app starts
    const initNotifications = async () => {
      try {
        // Request permissions when the app loads
        const permission = await LocalNotifications.requestPermissions();
        console.log('Notification permission status:', permission);

        // Also request browser notifications as fallback
        if ('Notification' in window && Notification.permission === 'default') {
          const browserPermission = await Notification.requestPermission();
          console.log('Browser notification permission:', browserPermission);
        }

        // Listen for notification clicks
        await LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
          console.log('Notification clicked:', notification);
          
          // Navigate to the group chat if groupId is in the extra data
          const groupId = notification.notification.extra?.groupId;
          if (groupId) {
            // You can add navigation logic here if needed
            console.log('Navigate to group:', groupId);
          }
        });
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initNotifications();

    // Cleanup listener on unmount
    return () => {
      LocalNotifications.removeAllListeners();
    };
  }, []);
};
