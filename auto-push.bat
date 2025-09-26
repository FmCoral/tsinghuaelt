@echo off
echo ==============================================
echo            Git�Զ��ϴ��ű�
echo ==============================================
echo.

:: ����Ƿ�ΪGit�ֿ�
if not exist .git (
    echo ���󣺵�ǰ�ļ��в���Git�ֿ�
    echo ���ȳ�ʼ���ֿⲢ���ӵ�Զ�ֿ̲�
    pause
    exit /b 1
)

:: ���Զ�ֿ̲�����
git remote >nul 2>&1
if %errorlevel% neq 0 (
    echo ����δ����Զ�ֿ̲�
    echo ����ִ�� git remote add origin [�ֿ��ַ] ����Զ�ֿ̲�
    pause
    exit /b 1
)

:: ��ʾ�޸ĵ��ļ��б�
echo �������޸ĵ��ļ���
git diff --name-only
echo.

:: �ݴ��޸�
echo �����ݴ������޸ĵ��ļ�...
git add .
echo �ļ��ݴ����
echo.

:: �ύ�޸�
echo ���������ύ��¼...
for /f "tokens=1-3 delims=/: " %%a in ("%time%") do (
    set "formatted_time=%%aʱ%%b��%%c��"
)
git commit -m "�Զ��ύ��%date% %formatted_time% - ͬ���޸�"

if %errorlevel% equ 0 (
    echo �ύ�ɹ�
    echo.
    
    :: ���͵�Զ�ֿ̲�
    echo �������͵�Զ�ֿ̲�...
    git push
    if %errorlevel% equ 0 (
        echo ���ͳɹ����޸���ͬ����Զ�ֿ̲�
    ) else (
        echo ����ʧ�ܣ����������Ȩ��
    )
) else (
    echo û����Ҫ�ύ���޸�
)

echo.
echo ==============================================
echo ������ɣ������رմ���...
pause >nul