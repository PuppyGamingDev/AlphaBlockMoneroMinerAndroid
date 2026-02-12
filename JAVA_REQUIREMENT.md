# Java Version Requirement

## The Issue

**Android Gradle Plugin 7.4.2 requires Java 11**, but you're using Java 10.

**React Native 0.68 also requires Java 11.**

## Solution: Install Java 11

You **must** install Java 11 to build this project. Java 10 won't work.

### Quick Setup

1. **Download Java 11 (OpenJDK - Free):**
   - Go to: https://adoptium.net/temurin/releases/?version=11
   - Download: JDK 11 → Windows x64 → .msi installer

2. **Install it** (note the installation path)

3. **Set JAVA_HOME** (temporarily for this session):
   ```powershell
   # Find where Java 11 was installed (usually one of these):
   $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-11.0.20.9-hotspot"
   # OR
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-11"
   
   # Verify:
   & "$env:JAVA_HOME\bin\java.exe" -version
   # Should show: openjdk version "11.x.x"
   ```

4. **Add to PATH:**
   ```powershell
   $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
   ```

5. **Verify Gradle uses Java 11:**
   ```powershell
   cd android
   .\gradlew.bat --version
   # Should show: JVM: 11.x.x
   ```

6. **Build:**
   ```powershell
   .\gradlew.bat clean
   .\gradlew.bat assembleDebug
   ```

### Permanent Setup

To make Java 11 permanent:

1. **System Properties** → **Environment Variables**
2. **System variables** → **New**:
   - Name: `JAVA_HOME`
   - Value: `C:\Program Files\Eclipse Adoptium\jdk-11.0.20.9-hotspot` (your actual path)
3. **Edit "Path"** → **New** → Add: `%JAVA_HOME%\bin`
4. **OK** on all dialogs
5. **Restart PowerShell/Command Prompt**

## Why Java 11?

- React Native 0.68 requires Java 11
- Android Gradle Plugin 7.0.4+ requires Java 11
- Gradle 7.6 supports Java 11 (and up to Java 19)

## Current Status

- ✅ Gradle: Updated to 7.6 (supports Java 11)
- ✅ Android Gradle Plugin: 7.0.4 (requires Java 11)
- ❌ Your Java: 10.0.2 (needs to be 11)

**Next step:** Install Java 11 and set JAVA_HOME.
