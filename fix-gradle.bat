@echo off
REM Fix Gradle daemon issues

echo ========================================
echo Fixing Gradle Daemon Issues
echo ========================================
echo.

cd android

echo Stopping all Gradle daemons...
call gradlew.bat --stop
echo.

echo Cleaning Gradle cache...
if exist "%USERPROFILE%\.gradle\daemon" (
    echo Removing daemon directory...
    rmdir /s /q "%USERPROFILE%\.gradle\daemon" 2>nul
    echo Daemon directory removed.
) else (
    echo Daemon directory not found (already clean).
)

echo.
echo Cleaning project build...
call gradlew.bat clean --no-daemon
echo.

echo ========================================
echo Cleanup complete!
echo ========================================
echo.
echo Now try building again with: build-simple.bat
echo.
pause

cd ..
