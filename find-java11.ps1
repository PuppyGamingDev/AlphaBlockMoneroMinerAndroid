# Script to find Java 11 installation
Write-Host "Searching for Java 11 installations..." -ForegroundColor Cyan

$locations = @(
    "C:\Program Files\Java",
    "C:\Program Files\Eclipse Adoptium",
    "C:\Program Files\Microsoft",
    "C:\Program Files\Amazon Corretto",
    "C:\Program Files\BellSoft",
    "C:\Program Files (x86)\Java",
    "C:\Program Files (x86)\Eclipse Adoptium"
)

$found = @()

foreach ($loc in $locations) {
    if (Test-Path $loc) {
        Write-Host "`nChecking: $loc" -ForegroundColor Yellow
        $jdkDirs = Get-ChildItem $loc -Directory -ErrorAction SilentlyContinue | Where-Object { 
            $_.Name -like '*11*' -or $_.Name -like '*jdk-11*' -or $_.Name -like '*jdk11*'
        }
        foreach ($dir in $jdkDirs) {
            $javaExe = Join-Path $dir.FullName "bin\java.exe"
            if (Test-Path $javaExe) {
                $version = & $javaExe -version 2>&1 | Select-Object -First 1
                Write-Host "  Found: $($dir.FullName)" -ForegroundColor Green
                Write-Host "  Version: $version" -ForegroundColor Gray
                $found += $dir.FullName
            }
        }
    }
}

# Also search for java.exe and check version
Write-Host "`nSearching for all java.exe files..." -ForegroundColor Cyan
$allJava = Get-ChildItem "C:\Program Files" -Recurse -Filter "java.exe" -ErrorAction SilentlyContinue -Depth 4 | Select-Object -First 10
foreach ($java in $allJava) {
    $version = & $java.FullName -version 2>&1 | Select-Object -First 1
    if ($version -like '*11*' -or $version -like '*openjdk version "11*') {
        $jdkPath = Split-Path (Split-Path $java.DirectoryName)
        Write-Host "  Found Java 11: $jdkPath" -ForegroundColor Green
        Write-Host "    Version: $version" -ForegroundColor Gray
        if ($found -notcontains $jdkPath) {
            $found += $jdkPath
        }
    }
}

if ($found.Count -eq 0) {
    Write-Host "`nNo Java 11 found in common locations." -ForegroundColor Red
    Write-Host "Please check where you installed Java 11, or reinstall it." -ForegroundColor Yellow
    Write-Host "`nDownload from: https://adoptium.net/temurin/releases/?version=11" -ForegroundColor Cyan
} else {
    Write-Host "`n=== Java 11 Installations Found ===" -ForegroundColor Green
    for ($i = 0; $i -lt $found.Count; $i++) {
        Write-Host "[$($i+1)] $($found[$i])" -ForegroundColor White
    }
    Write-Host "`nTo use one of these, run:" -ForegroundColor Cyan
    Write-Host '  $env:JAVA_HOME = "' + $found[0] + '"' -ForegroundColor Yellow
    Write-Host '  $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"' -ForegroundColor Yellow
    Write-Host '  java -version' -ForegroundColor Yellow
}
