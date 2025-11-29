# Building Android APK - Complete Guide

## Prerequisites

Before you start, make sure you have:

1. **Node.js and npm** installed (v16 or higher)
2. **Android Studio** downloaded and installed
3. **Java Development Kit (JDK)** 11 or higher

## Step-by-Step Build Process

### Step 1: Export Project from Lovable

1. In Lovable, click the **GitHub** button in the top right
2. Click **Export to GitHub** to create a repository
3. Clone the repository to your local machine:
   ```bash
   git clone <your-repo-url>
   cd <your-project-name>
   ```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Add Notification Sound (Important!)

1. Download a notification sound (MP3 format, 1-2 seconds)
2. Save it as `public/notification-sound.mp3`
3. This is required for notification sounds to work

### Step 4: Build the Web App

```bash
npm run build
```

This creates the `dist` folder with your compiled app.

### Step 5: Install Capacitor CLI (if not already installed)

```bash
npm install -g @capacitor/cli
```

### Step 6: Add Android Platform

```bash
npx cap add android
```

This creates the `android` folder with native Android project files.

### Step 7: Sync Capacitor

```bash
npx cap sync android
```

This copies your web app to the Android project and updates native dependencies.

### Step 8: Configure Android Project

1. Open Android Studio
2. Click "Open an Existing Project"
3. Navigate to your project folder and select the `android` folder
4. Wait for Gradle sync to complete (this may take a few minutes)

### Step 9: Update App Information (Optional)

Edit `android/app/src/main/AndroidManifest.xml` to customize:
- App name
- App icon
- Permissions (already configured for notifications)

### Step 10: Build APK

In Android Studio:

1. Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
2. Wait for the build to complete
3. Click "locate" in the notification to find your APK
4. Or find it at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 11: Install APK on Device

#### Via USB:
1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging**
3. Connect your device to computer
4. In Android Studio: **Run** > **Run 'app'**

#### Via APK File:
1. Copy `app-debug.apk` to your device
2. Open the APK file on your device
3. Allow "Install from Unknown Sources" if prompted
4. Install the app

## Testing Notifications

1. **Install app on two devices** (or use one device + browser)
2. **Login with different users** on each
3. **Join the same group** on both accounts
4. **Send a message** from one device
5. **Check notification** appears on other device with sound

### Expected Behavior:
- ✅ Notification appears in system tray
- ✅ Sound plays automatically
- ✅ Shows sender name and group name
- ✅ Shows message preview
- ✅ Works even when app is closed
- ✅ Tapping notification opens the app

## Building Release APK (For Production)

For a signed release APK:

1. Generate keystore:
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Update `android/app/build.gradle` with signing config

3. Build release APK:
   - In Android Studio: **Build** > **Generate Signed Bundle / APK**
   - Select APK
   - Choose your keystore
   - Select release build variant

## Common Issues & Solutions

### Issue: Gradle Build Fails
**Solution:** 
- Update Android Studio to latest version
- Update Gradle wrapper: `./gradlew wrapper --gradle-version 8.0`
- Clean and rebuild: **Build** > **Clean Project**, then **Build** > **Rebuild Project**

### Issue: App Crashes on Launch
**Solution:**
- Check logcat in Android Studio for errors
- Verify all dependencies are installed: `npm install`
- Resync Capacitor: `npx cap sync android`

### Issue: Notifications Don't Work
**Solution:**
- Ensure notification-sound.mp3 exists in public folder
- Check notification permissions are granted in app settings
- Verify real-time subscriptions are working (check console logs)
- Make sure Supabase connection is active

### Issue: Sound Doesn't Play
**Solution:**
- Verify notification-sound.mp3 is valid MP3 file
- Check device is not in silent mode
- Test sound file in media player
- Ensure file is in public folder before building

## App Size Optimization (Optional)

To reduce APK size:

1. Enable ProGuard/R8 minification in `android/app/build.gradle`
2. Use Android App Bundle (.aab) instead of APK for Play Store
3. Enable code shrinking and resource shrinking

## Publishing to Google Play Store

1. Build release AAB: **Build** > **Generate Signed Bundle**
2. Create Google Play Developer account ($25 one-time fee)
3. Create new app in Play Console
4. Upload AAB and fill in store listing
5. Submit for review

## Need Help?

- Check Capacitor docs: https://capacitorjs.com/docs/android
- Android Studio docs: https://developer.android.com/studio
- Lovable docs: https://docs.lovable.dev/

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Build web app
npm run build

# Add Android platform (first time only)
npx cap add android

# Sync changes to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on connected device
npx cap run android
```

## Version Information

- Minimum Android SDK: 22 (Android 5.1)
- Target Android SDK: 33 (Android 13)
- Capacitor: 5.x
- Node.js: 16+

---

**Important:** Always test your app thoroughly on multiple devices before releasing!
