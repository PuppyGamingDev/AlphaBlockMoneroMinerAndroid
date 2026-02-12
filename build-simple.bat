@echo off
REM Simplified build script with maximum debugging

echo ========================================
echo AlphaBlock Miner - Simple Build Script
echo ========================================
echo.

REM Set Java 11
if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\Eclipse Adoptium\jdk-11.0.30.7-hotspot" (
        set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.30.7-hotspot"
        set "PATH=%JAVA_HOME%\bin;%PATH%"
        echo Java 11 configured: %JAVA_HOME%
    )
)

echo.
echo Current directory: %CD%
echo JAVA_HOME: %JAVA_HOME%
echo.

REM Check directories
if not exist "android" (
    echo ERROR: android directory not found!
    pause
    exit /b 1
)

if not exist "android\local.properties" (
    echo Creating android\local.properties...
    echo sdk.dir=C\:\\Users\\%USERNAME%\\AppData\\Local\\Android\\Sdk > android\local.properties
)

echo.
echo Changing to android directory...
cd android
if %errorlevel% neq 0 (
    echo ERROR: Failed to cd to android!
    pause
    exit /b 1
)

echo Now in: %CD%
echo.

if not exist "gradlew.bat" (
    echo ERROR: gradlew.bat not found!
    pause
    exit /b 1
)

echo Found gradlew.bat
echo.
echo Starting Gradle build...
echo This will take 5-10 minutes. Please wait...
echo.
echo Using --no-daemon to avoid daemon issues...
echo.

call gradlew.bat assembleDebug --no-daemon

set BUILD_RESULT=%errorlevel%
echo.
echo ========================================
echo Build finished with exit code: %BUILD_RESULT%
echo ========================================
echo.

cd ..

if %BUILD_RESULT% equ 0 (
    echo SUCCESS! APK created at:
    echo android\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo BUILD FAILED! Check errors above.
)

echo.
echo Press any key to exit...
pause >nul
