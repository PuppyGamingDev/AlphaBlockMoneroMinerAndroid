# Quick Build Instructions

## ✅ Good News: XMRig Binaries Already Exist!

The XMRig native binaries are already in place:
- `android/app/src/main/jniLibs/arm64-v8a/libxmrig.so` ✓
- `android/app/src/main/jniLibs/armeabi-v7a/libxmrig.so` ✓
- And for x86/x86_64 ✓

**You can skip the native build step!**

## Simple Build Steps

### 1. Install Dependencies (if not done)
```bash
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is needed due to a peer dependency conflict with `@brightlayer-ui/react-native-progress-icons`. This is safe and won't affect functionality.

### 2. Build Debug APK (for testing)
```bash
cd android
.\gradlew.bat assembleDebug
```

The APK will be at: `android\app\build\outputs\apk\debug\app-debug.apk`

### 3. Install on Device
```bash
# Connect Android device via USB with USB debugging enabled
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

Or copy the APK to your phone and install manually.

## For Release Build (Distribution)

### 1. Create Keystore
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore android\app\alphablock-miner.keystore -alias alphablock -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Update build.gradle
Uncomment and configure the `signingConfigs` section in `android/app/build.gradle` (see instructions below).

### 3. Build Release
```bash
cd android
.\gradlew.bat assembleRelease
```

## Prerequisites Check

Make sure you have:
- ✅ Node.js installed
- ✅ Java 11 (JDK 11)
- ✅ Android Studio with Android SDK 29+
- ✅ `ANDROID_HOME` environment variable set

## Using the Build Script

I've created `build.bat` - just run:
```bash
build.bat
```

It will guide you through the process!
