# Quick Fix: Set Java 11 in Current Session

## The Problem

Oracle Java 10 paths are first in your PATH, so `java -version` shows Java 10 even though Java 11 is installed.

## Quick Solution (For This PowerShell Session)

**Step 1:** Find where Java 11 was installed. Check these locations:
- `C:\Program Files\Java\jdk-11*`
- `C:\Program Files\Eclipse Adoptium\jdk-11*`
- `C:\Program Files\Microsoft\jdk-11*`
- `C:\Program Files\Amazon Corretto\jdk11*`

**Step 2:** Once you find it, run these commands (replace with your actual path):

```powershell
# Set JAVA_HOME to your Java 11 installation
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-11.0.20.9-hotspot"
# OR if it's in a different location:
# $env:JAVA_HOME = "C:\Program Files\Java\jdk-11"

# Put Java 11 FIRST in PATH (before Oracle Java)
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Verify it works
java -version
# Should now show: openjdk version "11.x.x" or java version "11.x.x"
```

**Step 3:** Verify Gradle will use it:

```powershell
cd android
.\gradlew.bat --version
# Should show: JVM: 11.x.x
```

**Step 4:** Build:

```powershell
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

## If You Can't Find Java 11

You may need to reinstall it. Download from:
- **Eclipse Adoptium (Recommended):** https://adoptium.net/temurin/releases/?version=11
- Download: **JDK 11** → **Windows x64** → **.msi installer**
- During installation, note the installation path
- Then use that path in Step 2 above

## Make It Permanent

After verifying it works in this session:

1. **Right-click "This PC"** → **Properties**
2. **Advanced system settings** → **Environment Variables**
3. **System variables** → **New** (or Edit):
   - **Name:** `JAVA_HOME`
   - **Value:** `C:\Program Files\Eclipse Adoptium\jdk-11.0.20.9-hotspot` (your path)
4. **Edit "Path"**:
   - **Add** `%JAVA_HOME%\bin` at the **TOP** of the list
   - **Move down or remove** these Oracle paths:
     - `C:\Program Files (x86)\Common Files\Oracle\Java\javapath`
     - `C:\ProgramData\Oracle\Java\javapath`
5. **OK** on all dialogs
6. **Close and reopen PowerShell**

## Need Help Finding Java 11?

Tell me where you installed Java 11, or run this to search:

```powershell
Get-ChildItem "C:\Program Files" -Recurse -Filter "java.exe" -ErrorAction SilentlyContinue -Depth 3 | ForEach-Object { $v = & $_.FullName -version 2>&1 | Select-Object -First 1; if ($v -like '*11*') { Write-Host "$($_.DirectoryName) - $v" } }
```
