@echo off
REM Wrapper script that keeps window open
REM This ensures the window stays open even if build.bat exits

echo ========================================
echo AlphaBlock Miner - Build Wrapper
echo ========================================
echo.
echo This will run build.bat and keep the window open.
echo.
pause

call build.bat

echo.
echo ========================================
echo Build script finished.
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
