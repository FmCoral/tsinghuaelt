@echo off
echo ==============================================
echo            Git�Զ��ϴ�����
echo ==============================================
echo.

:: ����Ƿ�ΪGit�ֿ�
if not exist .git (
    echo ���󣺵�ǰ�ļ��в���Git�ֿ�
    echo ���ȳ�ʼ�����¡�ֿ�������д˽ű�
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

:: ��ʾ���ĵ��ļ��б�
echo �����Ǳ����޸ĵ��ļ���
git diff --name-only
echo.

:: ���������޸�
echo ���ڸ��������޸ĵ��ļ������Ե�...
git add .
echo �ļ��������
echo.

:: �ύ�޸�
echo ���ڴ����ύ��¼�����Ե�...
for /f "tokens=1-3 delims=/: " %%a in ("%time%") do (
    set "formatted_time=%%aʱ%%b��%%c��"
)
git commit -m "�Զ��ύ��%date% %formatted_time% - ͬ���޸�"

if %errorlevel% equ 0 (
    echo �ύ�ɹ�
    echo.
    
    :: ������Զ�ֿ̲�
    echo �������͵�Զ�ֿ̲⣬���Ե�...
    git push
    if %errorlevel% equ 0 (
        echo ������ɣ��޸���ͬ����Զ�ֿ̲�
    ) else (
        echo ����ʧ�ܣ����������Ȩ��
    )
) else (
    echo û����Ҫ�ύ���޸�
)

echo.
echo ==============================================
echo ������������������رմ���...
pause >nul