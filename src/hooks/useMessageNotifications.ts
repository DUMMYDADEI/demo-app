import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface UseMessageNotificationsProps {
  currentUserId: string | null;
  userGroups: string[];
}

export const useMessageNotifications = ({ currentUserId, userGroups }: UseMessageNotificationsProps) => {
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const hasPermission = useRef(false);

  useEffect(() => {
    // Initialize notification sound
    notificationSound.current = new Audio('/notification-sound.wav');
    notificationSound.current.volume = 1.0;

    // Request notification permissions
    const requestPermissions = async () => {
      try {
        const result = await LocalNotifications.requestPermissions();
        hasPermission.current = result.display === 'granted';
        console.log('Notification permission:', result.display);
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
        // Fallback to browser notifications if Capacitor is not available
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          hasPermission.current = permission === 'granted';
        }
      }
    };

    requestPermissions();

    return () => {
      if (notificationSound.current) {
        notificationSound.current.pause();
        notificationSound.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!currentUserId || userGroups.length === 0) return;

    console.log('Setting up message notifications for groups:', userGroups);

    // Subscribe to real-time messages
    const channel = supabase
      .channel('message-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `group_id=in.(${userGroups.join(',')})`,
        },
        async (payload) => {
          console.log('New message received:', payload);
          const newMessage = payload.new;

          // Don't notify for own messages
          if (newMessage.sender_id === currentUserId) {
            console.log('Ignoring own message');
            return;
          }

          // Get sender details
          const { data: sender } = await supabase
            .from('users')
            .select('name, username')
            .eq('id', newMessage.sender_id)
            .single();

          // Get group details
          const { data: group } = await supabase
            .from('groups')
            .select('name')
            .eq('id', newMessage.group_id)
            .single();

          const senderName = sender?.name || sender?.username || 'Someone';
          const groupName = group?.name || 'Group';
          const messageText = newMessage.text || 'Sent a message';

          console.log(`Notification: ${senderName} in ${groupName}: ${messageText}`);

          // Play notification sound
          try {
            if (notificationSound.current) {
              notificationSound.current.currentTime = 0;
              await notificationSound.current.play();
            }
          } catch (error) {
            console.error('Error playing notification sound:', error);
          }

          // Trigger haptic feedback
          try {
            await Haptics.impact({ style: ImpactStyle.Medium });
          } catch (error) {
            console.log('Haptics not available:', error);
          }

          // Show notification
          if (hasPermission.current) {
            try {
              // Try Capacitor local notifications first
              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: `${senderName} in ${groupName}`,
                    body: messageText,
                    id: Date.now(),
                    schedule: { at: new Date(Date.now() + 100) },
                    sound: 'notification-sound.wav',
                    attachments: undefined,
                    actionTypeId: '',
                    extra: {
                      groupId: newMessage.group_id,
                    },
                  },
                ],
              });
              console.log('Local notification scheduled');
            } catch (error) {
              console.log('Local notifications not available, using browser notifications:', error);
              
              // Fallback to browser notifications
              if ('Notification' in window && Notification.permission === 'granted') {
                const notification = new Notification(`${senderName} in ${groupName}`, {
                  body: messageText,
                  icon: '/favicon.jpg',
                  badge: '/favicon.jpg',
                  tag: `message-${newMessage.id}`,
                  requireInteraction: false,
                  silent: false,
                });

                notification.onclick = () => {
                  window.focus();
                  notification.close();
                };
              }
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up message notifications subscription');
      supabase.removeChannel(channel);
    };
  }, [currentUserId, userGroups]);

  return null;
};
