# How to Build AlphaBlock Miner

## ⚠️ Important: Don't Double-Click build.bat!

When you double-click a `.bat` file in Windows, the window closes immediately when the script finishes, even if there are errors. 

## ✅ Correct Way to Build

### Option 1: Use Command Prompt (Recommended)

1. **Open Command Prompt** (not PowerShell, regular CMD)
   - Press `Win + R`
   - Type `cmd` and press Enter

2. **Navigate to project directory:**
   ```cmd
   cd C:\Users\mike\AlphaBlockMoneroMinerAndroid
   ```

3. **Run the build script:**
   ```cmd
   build.bat
   ```

4. **Select option 1** for debug build

The window will stay open and you'll see all output, including any errors.

### Option 2: Use the Wrapper Script

Double-click `run-build.bat` instead of `build.bat`. This keeps the window open.

### Option 3: Use PowerShell

1. **Open PowerShell**
2. **Navigate to project:**
   ```powershell
   cd C:\Users\mike\AlphaBlockMoneroMinerAndroid
   ```
3. **Run:**
   ```powershell
   .\build.bat
   ```

## What to Expect

When you run `build.bat` and select option 1:

1. ✅ Checks for dependencies (already installed)
2. ✅ Checks for XMRig binaries (found)
3. ✅ Prompts for build type (select 1)
4. ✅ Changes to android directory
5. ✅ Runs `gradlew.bat assembleDebug`
6. ⏳ **This takes 5-10 minutes** - be patient!
7. ✅ Shows success message with APK location

## If Build Fails

The script will show error messages and pause. Common issues:

- **Java version wrong**: Make sure JAVA_HOME points to Java 11
- **Android SDK not found**: Check `android/local.properties` has correct path
- **Missing dependencies**: Run `npm install --legacy-peer-deps`

## APK Location

After successful build:
- **Debug APK**: `android\app\build\outputs\apk\debug\app-debug.apk`
- **Release APK**: `android\app\build\outputs\apk\release\app-release.apk`

## Quick Test

To verify everything is set up correctly, run:

```cmd
cd C:\Users\mike\AlphaBlockMoneroMinerAndroid
test-build.bat
```

This will test each step and pause so you can see what's happening.
