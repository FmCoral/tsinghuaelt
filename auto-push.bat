@echo off
echo ==============================================
echo            Git�Զ��ϴ�����
echo ==============================================
echo.

:: ���Git�ֿ�
if not exist .git (
    echo ���󣺵�ǰ����Git�ֿ⣬���ȳ�ʼ�����¡�ֿ�
    pause
    exit /b 1
)

:: ���Զ�ֿ̲�
git remote >nul 2>&1
if %errorlevel% neq 0 (
    echo ����δ����Զ�ֿ̲⣬����ִ�� git remote add origin [��ַ]
    pause
    exit /b 1
)

:: ���ٲ��ύ�޸�
echo ����ļ��޸�...
git add .
echo �������
echo.

echo �����ύ��¼...
for /f "tokens=1-3 delims=/: " %%a in ("%time%") do (
    set "formatted_time=%%aʱ%%b��%%c��"
)
git commit -m "�Զ��ύ��%date% %formatted_time% - ͬ���޸�"

if %errorlevel% equ 0 (
    echo �ύ�ɹ�
    echo.
    
    echo ������Զ�ֿ̲�...
    git push
    if %errorlevel% equ 0 (
        echo ������ɣ��޸���ͬ��
    ) else (
        echo ����ʧ�ܣ����������Ȩ��
    )
) else (
    echo ���޸����ύ
)

echo.
echo ==============================================
echo ������������������ر�
pause >nul