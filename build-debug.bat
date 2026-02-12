@echo off
REM Debug version of build script - shows more information

echo ========================================
echo AlphaBlock Miner - Build Script (DEBUG)
echo ========================================
echo.
echo Current directory: %CD%
echo JAVA_HOME: %JAVA_HOME%
echo PATH: %PATH%
echo.
pause

REM Set Java 11 if not already set
if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\Eclipse Adoptium\jdk-11.0.30.7-hotspot" (
        set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.30.7-hotspot"
        set "PATH=%JAVA_HOME%\bin;%PATH%"
        echo Java 11 auto-configured: %JAVA_HOME%
        echo.
    )
)

echo After Java setup:
echo JAVA_HOME: %JAVA_HOME%
echo.
pause

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: Must run from project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo Found package.json, continuing...
pause

REM Step 3: Build type selection
echo.
echo Select build type:
echo   1. Debug (for testing)
echo   2. Release (for distribution)
set /p build_type="Enter choice (1 or 2): "

echo You selected: %build_type%
pause

REM Ensure local.properties exists
if not exist "android\local.properties" (
    echo Creating android\local.properties...
    echo sdk.dir=C\:\\Users\\%USERNAME%\\AppData\\Local\\Android\\Sdk > android\local.properties
)

echo About to change to android directory...
pause

cd android
if %errorlevel% neq 0 (
    echo ERROR: Failed to change to android directory!
    pause
    exit /b 1
)

echo Now in directory: %CD%
pause

if "%build_type%"=="1" (
    echo Building DEBUG APK...
    echo.
    if not exist "gradlew.bat" (
        echo ERROR: gradlew.bat not found!
        echo Current directory: %CD%
        pause
        exit /b 1
    )
    
    echo About to run: gradlew.bat assembleDebug
    echo JAVA_HOME: %JAVA_HOME%
    pause
    
    call gradlew.bat assembleDebug
    set BUILD_RESULT=%errorlevel%
    
    echo.
    echo Gradle finished with exit code: %BUILD_RESULT%
    pause
    
    cd ..
    
    if %BUILD_RESULT% neq 0 (
        echo Build FAILED!
        pause
        exit /b %BUILD_RESULT%
    )
    
    echo Build successful!
    pause
) else (
    echo Invalid choice or not implemented in debug script
    pause
)
