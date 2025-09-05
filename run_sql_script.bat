@echo off
setlocal

REM Set the path to MySQL executable
set "MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe"

REM Connection details
set "MYSQL_HOST=localhost"
set "MYSQL_PORT=3307"
set "MYSQL_USER=root"
set "MYSQL_PASSWORD=Ganesha123*"

REM Run the SQL script
echo Running SQL script against %MYSQL_HOST%:%MYSQL_PORT% as %MYSQL_USER% ...
"%MYSQL_PATH%" -h %MYSQL_HOST% -P %MYSQL_PORT% -u %MYSQL_USER% -p%MYSQL_PASSWORD% < "%~dp0database-setup.sql"

if %ERRORLEVEL% EQU 0 (
    echo SQL script executed successfully!
) else (
    echo Error executing SQL script. Exit code: %ERRORLEVEL%
)

pause
