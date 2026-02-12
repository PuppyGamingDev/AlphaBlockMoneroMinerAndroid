# AlphaBlock Miner - Build Guide

## Prerequisites

Before building, ensure you have:

1. **Node.js 16+** (check `.nvmrc` for exact version)
2. **Java 11** (JDK 11) - Required for React Native Android builds
3. **Android Studio** with:
   - Android SDK 29+ (API Level 29)
   - Android NDK (version 21.4.7075529 or compatible)
   - CMake 3.18.1+ (via SDK Manager)
4. **Environment Variables:**
   ```bash
   # Windows (PowerShell)
   $env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-11"
   
   # Add to PATH
   $env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
   ```

## Step 1: Install Dependencies

```bash
# Install Node.js dependencies
npm install --legacy-peer-deps
# or
yarn install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag resolves a peer dependency conflict with `@brightlayer-ui/react-native-progress-icons` (it expects RN 0.63, but we use 0.68). This is safe - the package works fine with RN 0.68.

## Step 2: Build XMRig Native Binaries (if needed)

The XMRig binaries must be built first. Check if they exist:

```bash
# Check if binaries exist
dir android\app\src\main\jniLibs\arm64-v8a\libxmrig.so
```

If the binaries don't exist, build them:

```bash
# Navigate to build scripts
cd xmrig\lib-builder\script

# Make scripts executable (if using Git Bash or WSL)
# On Windows PowerShell, scripts should run directly

# Build dependencies (in order)
.\libuv-build.sh
.\hwloc-build.sh
.\xmrig-build.sh

# The install script should copy binaries to jniLibs
# If not, manually copy from build/src/xmrig/build/{arch}/xmrig 
# to android/app/src/main/jniLibs/{arch}/libxmrig.so
```

**Note:** On Windows, you may need to use Git Bash, WSL, or Cygwin to run the `.sh` scripts. Alternatively, you can run the commands manually using the Android NDK toolchain.

## Step 3: Build the Android App

### Debug Build (for testing)

```bash
cd android
.\gradlew.bat assembleDebug
```

The APK will be at: `android\app\build\outputs\apk\debug\app-debug.apk`

### Release Build (for distribution)

First, create a keystore for signing:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore android\app\alphablock-miner.keystore -alias alphablock -keyalg RSA -keysize 2048 -validity 10000
```

You'll be prompted for:
- Keystore password (remember this!)
- Key password (can be same as keystore)
- Your name, organization, etc.

Then configure signing in `android/app/build.gradle` (uncomment and update the signingConfigs section).

Finally, build:

```bash
cd android
.\gradlew.bat assembleRelease
```

The signed APK will be at: `android\app\build\outputs\apk\release\app-release.apk`

## Step 4: Install on Device

### Option A: Using ADB (Android Debug Bridge)

```bash
# Enable USB debugging on your Android device
# Connect device via USB
adb devices  # Verify device is connected

# Install debug APK
adb install android\app\build\outputs\apk\debug\app-debug.apk

# Or install release APK
adb install android\app\build\outputs\apk\release\app-release.apk
```

### Option B: Direct Transfer

1. Copy the APK to your Android device
2. On device: Settings → Security → Enable "Install from unknown sources"
3. Open the APK file on your device and install

## Troubleshooting

### "ANDROID_HOME not set"
- Set the `ANDROID_HOME` environment variable to your Android SDK path
- Usually: `C:\Users\YourName\AppData\Local\Android\Sdk`

### "NDK not found"
- Install NDK via Android Studio: Tools → SDK Manager → SDK Tools → NDK
- Or set `ANDROID_NDK_HOME` environment variable

### "XMRig binary not found"
- Ensure you've built the XMRig binaries (Step 2)
- Check that `libxmrig.so` exists in `android/app/src/main/jniLibs/{arch}/`

### Build fails with "Out of memory"
- Increase Gradle memory in `android/gradle.properties`:
  ```
  org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
  ```

### React Native Metro bundler issues
- Clear cache: `npx react-native start --reset-cache`
- Clean build: `cd android && .\gradlew.bat clean`

## Quick Build Commands

```bash
# Full clean build
cd android
.\gradlew.bat clean
.\gradlew.bat assembleRelease

# Just rebuild React Native bundle
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle
```

## Distribution Checklist

Before distributing the APK:

- [ ] APK is signed with release keystore
- [ ] Version number is correct (1.0.0)
- [ ] App name shows "AlphaBlock Miner"
- [ ] All branding is updated
- [ ] Test on real Android device (Android 10+)
- [ ] Verify mining connects to alphablockmonero.xyz
- [ ] Check APK size (< 50MB recommended)
- [ ] Generate SHA256 hash for verification:
  ```bash
  certutil -hashfile app-release.apk SHA256
  ```
