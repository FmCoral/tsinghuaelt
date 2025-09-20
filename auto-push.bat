@echo off
echo ==============================================
echo            Git自动上传工具
echo ==============================================
echo.

:: 检查Git仓库
if not exist .git (
    echo 错误：当前不是Git仓库，请先初始化或克隆仓库
    pause
    exit /b 1
)

:: 检查远程仓库
git remote >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未关联远程仓库，请先执行 git remote add origin [地址]
    pause
    exit /b 1
)

:: 跟踪并提交修改
echo 检测文件修改...
git add .
echo 跟踪完成
echo.

echo 创建提交记录...
for /f "tokens=1-3 delims=/: " %%a in ("%time%") do (
    set "formatted_time=%%a时%%b分%%c秒"
)
git commit -m "自动提交：%date% %formatted_time% - 同步修改"

if %errorlevel% equ 0 (
    echo 提交成功
    echo.
    
    echo 推送至远程仓库...
    git push
    if %errorlevel% equ 0 (
        echo 推送完成！修改已同步
    ) else (
        echo 推送失败，请检查网络或权限
    )
) else (
    echo 无修改需提交
)

echo.
echo ==============================================
echo 操作结束，按任意键关闭
pause >nul