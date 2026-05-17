@echo off
setlocal ENABLEEXTENSIONS

REM =========================================================
REM ASP.NET + Vite HTTPS Development Certificate (PEM/KEY)
REM Location: %APPDATA%\ASP.NET\https
REM =========================================================

set CERT_DIR=%APPDATA%\ASP.NET\https
set KEY_FILE=%CERT_DIR%\schoolmanagementsystem.client.key
set CERT_FILE=%CERT_DIR%\schoolmanagementsystem.client.pem

echo.
echo Using certificate directory:
echo   %CERT_DIR%
echo.

REM Create directory if it does not exist
if not exist "%CERT_DIR%" (
    echo Creating directory...
    mkdir "%CERT_DIR%"
)

REM Check if cert already exists
if exist "%KEY_FILE%" if exist "%CERT_FILE%" (
    echo Certificate already exists:
    echo   %KEY_FILE%
    echo   %CERT_FILE%
    echo.
    choice /M "Do you want to overwrite it"
    if errorlevel 2 (
        echo Aborted.
        goto :EOF
    )
)

REM Generate key and certificate
echo Generating localhost.key and localhost.pem...
echo.

openssl req -x509 -nodes -days 365 ^
  -newkey rsa:2048 ^
  -keyout "%KEY_FILE%" ^
  -out "%CERT_FILE%" ^
  -subj "/CN=localhost" ^
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

if errorlevel 1 (
    echo.
    echo ERROR: OpenSSL failed.
    echo Make sure OpenSSL is installed and available in PATH.
    goto :EOF
)

echo.
echo SUCCESS.
echo Generated:
echo   %KEY_FILE%
echo   %CERT_FILE%
echo.

echo You can now start Vite with HTTPS enabled.
echo.

pause
