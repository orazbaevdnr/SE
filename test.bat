@echo off
chcp 65001 >nul
title Smart Campus - Vitest Test Suite Runner

echo ====================================================================
echo   Smart Campus: Запуск автоматических тестов (19 тестов Vitest)
echo ====================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ОШИБКА] Node.js не найден в системе!
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Установка зависимостей...
    call npm install
)

echo Запуск тестов Vitest с подробным отчетом...
echo.
call npm test -- --reporter=verbose
echo.
echo ====================================================================
echo Тестирование завершено.
echo ====================================================================
pause
