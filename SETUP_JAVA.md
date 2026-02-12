# Java Setup for AlphaBlock Miner

## Current Status

- **Your Java:** Java 10.0.2
- **Required:** Java 11 (for React Native 0.68)
- **Gradle:** Updated to 7.6 (supports Java 10-21)

## Quick Fix: Use Java 10 (May Work)

Gradle 7.6 supports Java 10, so try building now:

```powershell
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

## Recommended: Install Java 11

React Native 0.68 officially requires Java 11. Here's how to set it up:

### Step 1: Download Java 11

**Option A: Oracle JDK 11**
- https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html
- Download Windows x64 installer

**Option B: OpenJDK 11 (Recommended - Free)**
- https://adoptium.net/temurin/releases/?version=11
- Download "JDK 11" → Windows x64 → .msi installer

### Step 2: Install

Run the installer. Note the installation path (usually `C:\Program Files\Java\jdk-11` or `C:\Program Files\Eclipse Adoptium\jdk-11.x.x-hotspot`).

### Step 3: Set JAVA_HOME

**Temporarily (for this PowerShell session):**
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-11"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
java -version  # Verify it shows Java 11
```

**Permanently:**
1. Right-click "This PC" → Properties
2. Advanced system settings → Environment Variables
3. Under "System variables", click "New":
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Java\jdk-11` (your actual path)
4. Edit "Path" variable, add: `%JAVA_HOME%\bin`
5. Click OK on all dialogs
6. **Restart PowerShell/Command Prompt**

### Step 4: Verify

```powershell
java -version
# Should show: openjdk version "11.x.x" or java version "11.x.x"
```

### Step 5: Build

```powershell
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

## Troubleshooting

**"JAVA_HOME not set"**
- Make sure JAVA_HOME points to the JDK folder (not JRE)
- Restart your terminal after setting environment variables

**"Unsupported class file version"**
- This means a newer Java is being used somewhere
- Check: `.\gradlew.bat --version` to see which Java Gradle uses
- Set JAVA_HOME explicitly to Java 11

**Multiple Java versions**
- Windows may have multiple Java installations
- Use `where java` to see all Java executables
- Set JAVA_HOME to the Java 11 installation specifically
