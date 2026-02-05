# 🎮 Terra Love - Build Instructions

## How to Create Installable Apps

This guide will help you create:
- 📱 **Android APK** - Install on any Android phone
- 💻 **Windows EXE** - Run on any Windows PC
- 🍎 **Mac App** - Run on Mac
- 🐧 **Linux App** - Run on Linux

---

## 🚀 EASIEST METHOD: Progressive Web App (PWA)

The game already works as a PWA! Users can install it directly from the browser.

### On Android:
1. Open the game URL in Chrome
2. Tap the 3-dot menu (⋮)
3. Tap "Add to Home Screen" or "Install App"
4. The game icon appears on home screen!

### On Windows/Mac/Linux (Chrome):
1. Open the game URL in Chrome
2. Click the install icon (⊕) in the address bar
3. Click "Install"
4. The game opens as a standalone app!

### On iPhone/iPad:
1. Open the game URL in Safari
2. Tap the Share button (□↑)
3. Tap "Add to Home Screen"
4. The game icon appears on home screen!

---

## 📱 METHOD 2: Android APK (Using Capacitor)

### Prerequisites:
- Node.js 18+ installed
- Android Studio installed
- Java JDK 17+ installed

### Steps:

```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Build the web app
npm run build

# 3. Initialize Capacitor (if not done)
npx cap init "Terra Love" "com.terralove.game" --web-dir dist

# 4. Add Android platform
npx cap add android

# 5. Copy web files to Android
npx cap copy android

# 6. Open in Android Studio
npx cap open android
```

### In Android Studio:
1. Wait for Gradle sync to complete
2. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Find APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

### For Release APK (signed):
1. Go to **Build → Generate Signed Bundle / APK**
2. Create a new keystore or use existing
3. Choose "APK"
4. Select "release"
5. Click "Create"

The APK can be shared and installed on any Android device!

---

## 💻 METHOD 3: Windows/Mac/Linux Desktop App (Using Electron)

### Prerequisites:
- Node.js 18+ installed

### Steps:

```bash
# 1. Build the web app first
npm run build

# 2. Go to electron folder
cd electron

# 3. Install dependencies
npm install

# 4. Build for your platform:

# For Windows (creates .exe):
npm run build-win

# For Mac (creates .dmg):
npm run build-mac

# For Linux (creates .AppImage):
npm run build-linux

# For all platforms:
npm run build-all
```

### Output locations:
- Windows: `release/Terra Love Setup 1.0.0.exe` (installer) and `release/Terra Love 1.0.0.exe` (portable)
- Mac: `release/Terra Love-1.0.0.dmg`
- Linux: `release/Terra Love-1.0.0.AppImage`

---

## 🎯 QUICK COMMANDS SUMMARY

```bash
# Build web app
npm run build

# === ANDROID APK ===
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npx cap copy android
npx cap open android
# Then build APK in Android Studio

# === WINDOWS EXE ===
cd electron
npm install
npm run build-win

# === MAC APP ===
cd electron
npm install
npm run build-mac

# === LINUX APP ===
cd electron
npm install
npm run build-linux
```

---

## 🎨 Adding Custom Icons

### For best results, create these icon sizes:
- `public/icon-192.png` (192x192 pixels)
- `public/icon-512.png` (512x512 pixels)

### For Android:
Place icons in `android/app/src/main/res/`:
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### For Windows/Mac:
- Windows: Use `.ico` file (256x256)
- Mac: Use `.icns` file

---

## 📲 Mobile Touch Controls

The game already includes touch controls for mobile:
- **Left side of screen**: D-pad for movement
- **Right side of screen**: Attack (A) and Special (S) buttons
- **Works on any touch device!**

---

## 🐛 Troubleshooting

### Android Build Issues:
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx cap copy android
npx cap open android
```

### Electron Build Issues:
```bash
# Clear cache and reinstall
cd electron
rm -rf node_modules
npm install
npm run build-win
```

### Game not loading:
- Make sure `npm run build` completed successfully
- Check that `dist/index.html` exists

---

## 💕 Made with Love!

Enjoy the game! 🎂🎉
