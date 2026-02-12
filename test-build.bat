@echo off
REM Simple test script to see what's happening

echo Test script starting...
echo Current directory: %CD%
echo.
pause

echo Checking for android directory...
if exist "android" (
    echo android directory found
) else (
    echo ERROR: android directory NOT found!
    pause
    exit /b 1
)

echo.
echo Changing to android directory...
cd android
if %errorlevel% neq 0 (
    echo ERROR: cd failed!
    pause
    exit /b 1
)

echo Now in: %CD%
echo.
pause

echo Checking for gradlew.bat...
if exist "gradlew.bat" (
    echo gradlew.bat found
) else (
    echo ERROR: gradlew.bat NOT found!
    pause
    exit /b 1
)

echo.
echo JAVA_HOME: %JAVA_HOME%
echo.
pause

echo About to run gradlew.bat --version...
call gradlew.bat --version
echo.
echo Gradle finished with code: %errorlevel%
pause

cd ..
