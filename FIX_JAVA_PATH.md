# Fix: Java 10 Still Showing Instead of Java 11

## Problem

Even after installing Java 11, `java -version` still shows Java 10 because:
1. **JAVA_HOME is not set** (or not in current session)
2. **Oracle Java paths are first in PATH** (`C:\Program Files (x86)\Common Files\Oracle\Java\javapath`)
3. **Current PowerShell session** hasn't reloaded environment variables

## Quick Fix (For This Session)

Run these commands in PowerShell **in order**:

```powershell
# Step 1: Find where Java 11 was installed
# Check common locations:
dir "C:\Program Files\Java"
dir "C:\Program Files\Eclipse Adoptium"
dir "C:\Program Files\Microsoft"
dir "C:\Program Files\Amazon Corretto"

# Step 2: Once you find it (e.g., "C:\Program Files\Eclipse Adoptium\jdk-11.0.20.9-hotspot"):
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-11.0.20.9-hotspot"
# OR if it's in a different location:
# $env:JAVA_HOME = "C:\Program Files\Java\jdk-11"

# Step 3: Put Java 11 FIRST in PATH (before Oracle Java)
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Step 4: Verify
java -version
# Should now show: openjdk version "11.x.x" or java version "11.x.x"

# Step 5: Verify Gradle will use it
cd android
.\gradlew.bat --version
# Should show: JVM: 11.x.x
```

## Permanent Fix

### Option 1: System Environment Variables (Recommended)

1. **Right-click "This PC"** → **Properties**
2. **Advanced system settings** → **Environment Variables**
3. **System variables** → **New** (or Edit if exists):
   - **Variable name:** `JAVA_HOME`
   - **Variable value:** `C:\Program Files\Eclipse Adoptium\jdk-11.0.20.9-hotspot` (your actual Java 11 path)
4. **Edit "Path"** variable:
   - **Move** `%JAVA_HOME%\bin` to the **TOP** of the list (highest priority)
   - **Remove or move down** these Oracle Java paths:
     - `C:\Program Files (x86)\Common Files\Oracle\Java\javapath`
     - `C:\ProgramData\Oracle\Java\javapath`
5. **OK** on all dialogs
6. **Close and reopen PowerShell/Command Prompt**

### Option 2: Remove Oracle Java from PATH

The Oracle Java paths (`C:\Program Files (x86)\Common Files\Oracle\Java\javapath`) are taking precedence. You can:

1. **Remove them from PATH** (System Environment Variables)
2. **Or uninstall Java 10** if you don't need it

## Find Your Java 11 Installation

If you're not sure where Java 11 was installed, check these locations:

```powershell
# Common Java 11 installation locations:
Get-ChildItem "C:\Program Files\Java" -ErrorAction SilentlyContinue
Get-ChildItem "C:\Program Files\Eclipse Adoptium" -ErrorAction SilentlyContinue
Get-ChildItem "C:\Program Files\Microsoft" -Filter "*jdk*" -ErrorAction SilentlyContinue
Get-ChildItem "C:\Program Files\Amazon Corretto" -ErrorAction SilentlyContinue
Get-ChildItem "C:\Program Files\BellSoft" -ErrorAction SilentlyContinue

# Or search the entire Program Files:
Get-ChildItem "C:\Program Files" -Recurse -Filter "java.exe" -ErrorAction SilentlyContinue | Select-Object DirectoryName | Sort-Object -Unique
```

Look for a folder containing `jdk-11` or `jdk11` in the name.

## Verify It Works

After setting JAVA_HOME and updating PATH:

```powershell
# Should show Java 11
java -version

# Should show Java 11 path
echo $env:JAVA_HOME

# Should show Java 11 first
where.exe java

# Gradle should use Java 11
cd android
.\gradlew.bat --version
```

## If Still Not Working

1. **Restart your computer** (ensures all environment variables are loaded)
2. **Open a NEW PowerShell window** (don't use the old one)
3. **Check JAVA_HOME again:** `echo $env:JAVA_HOME`
4. **If still empty**, set it again in the new window
