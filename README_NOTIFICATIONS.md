# Push Notifications Setup Guide

## Overview
This app now has WhatsApp-style push notifications with sound for new group messages. Notifications work even when the app is in the background or closed (when built as an APK).

## Features
- 🔔 Real-time notifications for new group messages
- 🔊 Notification sound plays automatically
- 📳 Haptic feedback on mobile devices
- 👥 Shows sender name and group name
- 💬 Displays message preview
- ✅ Works even when app is closed (APK only)

## How It Works

### Web Version
- Notifications use browser notification API
- Sound plays through HTML5 Audio
- Works when browser is open

### Mobile APK Version
- Uses Capacitor Local Notifications
- Notifications appear in system tray
- Sound plays through native notification system
- Works even when app is completely closed

## Building APK

To convert this to an APK file:

### Prerequisites
1. Install Android Studio
2. Install Node.js and npm
3. Install Capacitor CLI: `npm install -g @capacitor/cli`

### Steps

1. **Build the web app:**
   ```bash
   npm install
   npm run build
   ```

2. **Add Android platform:**
   ```bash
   npx cap add android
   ```

3. **Sync the project:**
   ```bash
   npx cap sync android
   ```

4. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

5. **Configure Android permissions:**
   
   The required permissions are already configured in the project. Android Studio will handle them automatically.

6. **Build APK:**
   - In Android Studio, go to Build > Build Bundle(s) / APK(s) > Build APK(s)
   - The APK will be generated in `android/app/build/outputs/apk/`

### Adding Custom Notification Sound

1. Download or create a notification sound file (MP3 format recommended)
2. Replace the placeholder file at `public/notification-sound.mp3` with your sound
3. Keep the filename as `notification-sound.mp3`
4. Rebuild the project

## Testing Notifications

### In Browser
1. Open the app in browser
2. Allow notifications when prompted
3. Open two browser windows with different users
4. Send a message from one user
5. The other user should see a notification with sound

### In APK
1. Install the APK on an Android device
2. Allow notification permissions
3. Login with two different users on two devices
4. Send a message from one device
5. The other device should receive a notification even if the app is closed

## Technical Details

### Key Files
- `src/hooks/useMessageNotifications.ts` - Main notification logic
- `src/hooks/useGlobalNotifications.ts` - Global notification initialization
- `capacitor.config.ts` - Capacitor configuration
- `public/notification-sound.mp3` - Notification sound file

### How Notifications Are Triggered
1. Real-time listener monitors all groups user is a member of
2. When a new message arrives from another user:
   - Plays notification sound
   - Triggers haptic feedback (mobile only)
   - Shows notification with sender name, group name, and message preview
3. Notifications persist in system tray (APK only)

### Notification Permissions
- Requested automatically when app starts
- Falls back to browser notifications if Capacitor is not available
- User can manage permissions in device settings

## Troubleshooting

### No notifications appearing
- Check notification permissions are enabled
- Verify user is member of the group
- Check browser/system notification settings
- Look for errors in console logs

### No sound playing
- Ensure notification-sound.mp3 file exists in public folder
- Check device volume settings
- Verify sound file is not corrupted
- On mobile, check if device is in silent mode

### Notifications work in browser but not in APK
- Rebuild and resync: `npx cap sync android`
- Check Android Studio build logs
- Verify notification permissions in AndroidManifest.xml

## Support
For issues or questions, check the console logs for detailed error messages.
