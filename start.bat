@echo off
chcp 65001 >nul
title Smart Campus - Room Availability Checker

echo ====================================================================
echo   Smart Campus: Room Availability Checker (Assignment #04)
echo   Student: Daniyar Orazbaev ^| KBTU ID: 25B031445 ^| Group: WED18-21
echo ====================================================================
echo.

:: Проверка наличия Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ОШИБКА] Node.js не найден в системе!
    echo Установите Node.js с официального сайта: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Установка зависимостей, если папка node_modules еще не создана
if not exist "node_modules" (
    echo [1/3] Установка зависимостей npm install...
    call npm install
    if %errorlevel% neq 0 (
        echo [ОШИБКА] Не удалось установить npm зависимости.
        pause
        exit /b 1
    )
    echo Зависимости успешно установлены!
    echo.
)

:: Запуск тестов для проверки
echo [2/3] Запуск автоматических тестов Vitest (12 тестов)...
call npm test
echo.

:: Запуск Vite dev-сервера и открытие в браузере
echo [3/3] Запуск приложения в браузере...
echo Сервер доступен по адресу: http://localhost:5173
echo (Для завершения работы нажмите Ctrl + C в этом окне)
echo.

:: Открытие браузера через 2 секунды после старта
start "" http://localhost:5173

:: Запуск сервера Vite с флагом --open
call npx vite --open

pause
