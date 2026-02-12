@echo off
REM AlphaBlock Miner - Quick Build Script for Windows
REM This script helps build the Android APK

echo ========================================
echo AlphaBlock Miner - Build Script
echo ========================================
echo.

REM Set Java 11 if not already set
if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\Eclipse Adoptium\jdk-11.0.30.7-hotspot" (
        set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.30.7-hotspot"
        set "PATH=%JAVA_HOME%\bin;%PATH%"
        echo Java 11 auto-configured: %JAVA_HOME%
        echo.
    ) else (
        echo WARNING: JAVA_HOME not set and Java 11 not found in default location.
        echo Please set JAVA_HOME to your Java 11 installation.
        echo.
    )
)

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: Must run from project root directory
    pause
    exit /b 1
)

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
)

REM Check Android SDK
if "%ANDROID_HOME%"=="" (
    echo Warning: ANDROID_HOME not set. Build may fail.
    echo Set it to: C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    echo.
)

REM Step 1: Install dependencies
echo [1/4] Installing Node.js dependencies...
echo Using --legacy-peer-deps to resolve dependency conflicts...
if exist "node_modules" (
    echo Dependencies already installed. Skipping...
) else (
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo Error: npm install failed
        pause
        exit /b 1
    )
)

REM Step 2: Check for XMRig binaries
echo.
echo [2/4] Checking XMRig binaries...
if exist "android\app\src\main\jniLibs\arm64-v8a\libxmrig.so" (
    echo XMRig binaries found. Skipping native build.
) else (
    echo WARNING: XMRig binaries not found!
    echo You need to build them first:
    echo   cd xmrig\lib-builder\script
    echo   .\libuv-build.sh
    echo   .\hwloc-build.sh
    echo   .\xmrig-build.sh
    echo.
    set /p build_native="Build XMRig binaries now? (y/n): "
    if /i "%build_native%"=="y" (
        cd xmrig\lib-builder\script
        echo Building XMRig binaries...
        REM Note: These are bash scripts - you may need Git Bash or WSL
        bash libuv-build.sh
        bash hwloc-build.sh
        bash xmrig-build.sh
        cd ..\..\..
    ) else (
        echo Skipping native build. APK build may fail without binaries.
    )
)

REM Step 3: Build type selection
echo.
echo [3/4] Select build type:
echo   1. Debug (for testing)
echo   2. Release (for distribution)
set /p build_type="Enter choice (1 or 2): "

REM Debug: Show what was entered
echo.
echo DEBUG: You entered: [%build_type%]
echo DEBUG: build_type variable set to: %build_type%
pause

REM Step 4: Build APK
echo.
echo [4/4] Building Android APK...

REM Ensure local.properties exists
if not exist "android\local.properties" (
    echo Creating android\local.properties with Android SDK path...
    echo sdk.dir=C\:\\Users\\%USERNAME%\\AppData\\Local\\Android\\Sdk > android\local.properties
)

if not exist "android" (
    echo ERROR: android directory not found!
    echo Make sure you're running this from the project root.
    pause
    exit /b 1
)

cd android
if %errorlevel% neq 0 (
    echo ERROR: Failed to change to android directory!
    pause
    exit /b 1
)

if "%build_type%"=="1" (
    echo Building DEBUG APK...
    echo Current directory: %CD%
    echo JAVA_HOME: %JAVA_HOME%
    echo.
    if not exist "gradlew.bat" (
        echo ERROR: gradlew.bat not found in android directory!
        echo Current directory: %CD%
        pause
        exit /b 1
    )
    echo Running gradlew.bat assembleDebug...
    echo.
    call gradlew.bat assembleDebug
    set BUILD_RESULT=%errorlevel%
    echo.
    echo ========================================
    echo Gradle finished with exit code: %BUILD_RESULT%
    echo ========================================
    echo.
    cd ..
    if %BUILD_RESULT% neq 0 (
        echo.
        echo ========================================
        echo Build FAILED! Error code: %BUILD_RESULT%
        echo ========================================
        echo.
        echo Common issues:
        echo - Java version mismatch (need Java 11)
        echo   Current JAVA_HOME: %JAVA_HOME%
        echo   Set JAVA_HOME to Java 11: set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.30.7-hotspot
        echo - Android SDK not found
        echo   Check android\local.properties has correct sdk.dir path
        echo - Missing dependencies
        echo   Run: npm install --legacy-peer-deps
        echo.
        pause
        exit /b %BUILD_RESULT%
    )
    echo.
    echo ========================================
    echo Build successful!
    echo APK location: android\app\build\outputs\apk\debug\app-debug.apk
    echo ========================================
    echo.
    pause
) else if "%build_type%"=="2" (
    echo Building RELEASE APK...
    cd android
    if not exist "app\alphablock-miner.keystore" (
        echo.
        echo WARNING: Keystore not found!
        echo Create one with:
        echo   keytool -genkeypair -v -storetype PKCS12 -keystore app\alphablock-miner.keystore -alias alphablock -keyalg RSA -keysize 2048 -validity 10000
        echo.
        set /p continue="Continue anyway? (y/n): "
        if /i not "%continue%"=="y" (
            cd ..
            pause
            exit /b 1
        )
    )
    echo.
    if not exist "local.properties" (
        echo Creating local.properties with Android SDK path...
        echo sdk.dir=C\:\\Users\\%USERNAME%\\AppData\\Local\\Android\\Sdk > local.properties
    )
    call gradlew.bat assembleRelease
    set BUILD_RESULT=%errorlevel%
    cd ..
    if %BUILD_RESULT% neq 0 (
        echo.
        echo ========================================
        echo Build FAILED! Error code: %BUILD_RESULT%
        echo ========================================
        echo.
        echo Common issues:
        echo - Java version mismatch (need Java 11)
        echo   Current JAVA_HOME: %JAVA_HOME%
        echo   Set JAVA_HOME to Java 11: set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.30.7-hotspot
        echo - Android SDK not found
        echo   Check android\local.properties has correct sdk.dir path
        echo - Missing keystore for release build
        echo.
        pause
        exit /b %BUILD_RESULT%
    )
    echo.
    echo ========================================
    echo Build successful!
    echo APK location: android\app\build\outputs\apk\release\app-release.apk
    echo ========================================
    echo.
    pause
) else (
    echo DEBUG: build_type was NOT 1 or 2
    echo DEBUG: build_type value: [%build_type%]
    echo Invalid choice. Exiting.
    echo.
    pause
    exit /b 1
)

REM Final safety pause
echo.
echo Script reached end. Press any key...
pause
