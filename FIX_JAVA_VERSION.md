# Fix: Java Version Issue

## Problem

The error "Unsupported class file major version 69" means:
- **Class file version 69 = Java 21**
- **Gradle 7.3.3 only supports up to Java 17**

Your system may have multiple Java versions installed, and Gradle is picking up Java 21 instead of Java 11 (which React Native 0.68 requires).

## Solution Options

### Option 1: Set JAVA_HOME to Java 11 (Recommended)

1. **Find Java 11 installation:**
   ```powershell
   dir "C:\Program Files\Java"
   # or
   dir "C:\Program Files (x86)\Java"
   ```

2. **Set JAVA_HOME temporarily (for this session):**
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-11"
   $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
   ```

3. **Or set permanently:**
   - Open System Properties → Environment Variables
   - Add/Edit `JAVA_HOME` = `C:\Program Files\Java\jdk-11`
   - Add `%JAVA_HOME%\bin` to PATH

4. **Verify:**
   ```powershell
   java -version
   # Should show: java version "11.x.x"
   ```

### Option 2: Use Updated Gradle (Already Done)

I've updated:
- Gradle: 7.3.3 → 7.6 (supports Java 21)
- Android Gradle Plugin: 7.0.4 → 7.4.2

Try building again - it should work now with Java 21.

### Option 3: Install Java 11

If you don't have Java 11:

1. Download Java 11 (JDK 11) from:
   - Oracle: https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html
   - Or use OpenJDK: https://adoptium.net/temurin/releases/?version=11

2. Install it

3. Set JAVA_HOME to the Java 11 installation

## Quick Test

After setting JAVA_HOME, verify Gradle uses the correct Java:

```powershell
cd android
.\gradlew.bat --version
```

This will show which Java version Gradle is using.

## Then Build Again

```powershell
cd android
.\gradlew.bat assembleDebug
```
