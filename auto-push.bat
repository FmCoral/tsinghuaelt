@echo off
echo ==============================================
echo            Git�Զ��ϴ���GitHub����
echo ==============================================
echo.

:: ����Ƿ���Git�ֿ���
if not exist .git (
    echo ���󣺵�ǰ�ļ��в���Git�ֿ�
    echo    ������Ŀ�ļ��������д˽ű�������ִ�� git init ��ʼ���ֿ�
    pause
    exit /b 1
)

:: ���Զ�ֿ̲�����
git remote >nul 2>&1
if %errorlevel% neq 0 (
    echo ����δ����Զ�ֿ̲�
    echo    ����ִ�� git remote add origin [�ֿ��ַ] ����Զ�ֿ̲�
    pause
    exit /b 1
)

:: ���������޸ĵ��ļ�
echo ���ڼ���ļ��޸�...
git add .
echo �ļ�������ɣ��ѽ������޸ļ����ݴ�����
echo.

:: �ύ�޸ģ�����ϸʱ�䣩
echo ���ڴ����ύ��¼...
for /f "tokens=1-3 delims=/: " %%a in ("%time%") do (
    set "formatted_time=%%aʱ%%b��%%c��"
)
git commit -m "�Զ��ύ��%date% %formatted_time% - �Զ�ͬ�������޸�"

:: ����ύ�Ƿ�ɹ�
if %errorlevel% equ 0 (
    echo �ύ�ɹ����ύ��Ϣ���Զ��ύ��%date% %formatted_time%��
    echo.
    
    :: ���͵�Զ�ֿ̲�
    echo �������͵�GitHubԶ�ֿ̲�...
    git push
    
    :: ��������Ƿ�ɹ�
    if %errorlevel% equ 0 (
        echo ������ɣ������޸���ͬ����Զ�ֿ̲�
    ) else (
        echo ����ʧ�ܣ�����ԭ��
        echo    1. ������������
        echo    2. Զ�ֿ̲�Ȩ�޲���
        echo    3. ��Ҫ��ִ�� git pull ͬ��Զ���޸�
    )
) else (
    echo û����Ҫ�ύ���޸ģ������ļ������ϴ��ύһ�£�
)

echo.
echo ==============================================
echo ������������������رմ���...
pause >nul