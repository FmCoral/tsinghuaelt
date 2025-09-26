@echo off
echo ==============================================
echo            Git自动上传脚本
echo ==============================================
echo.

:: 检查是否为Git仓库
if not exist .git (
    echo 错误：当前文件夹不是Git仓库
    echo 请先初始化仓库并连接到远程仓库
    pause
    exit /b 1
)

:: 检查远程仓库配置
git remote >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未配置远程仓库
    echo 请先执行 git remote add origin [仓库地址] 配置远程仓库
    pause
    exit /b 1
)

:: 显示修改的文件列表
echo 以下是修改的文件：
git diff --name-only
echo.

:: 暂存修改
echo 正在暂存所有修改的文件...
git add .
echo 文件暂存完成
echo.

:: 提交修改
echo 正在生成提交记录...
for /f "tokens=1-3 delims=/: " %%a in ("%time%") do (
    set "formatted_time=%%a时%%b分%%c秒"
)
git commit -m "自动提交于%date% %formatted_time% - 同步修改"

if %errorlevel% equ 0 (
    echo 提交成功
    echo.
    
    :: 推送到远程仓库
    echo 正在推送到远程仓库...
    git push
    if %errorlevel% equ 0 (
        echo 推送成功，修改已同步到远程仓库
    ) else (
        echo 推送失败，请检查网络或权限
    )
) else (
    echo 没有需要提交的修改
)

echo.
echo ==============================================
echo 操作完成，即将关闭窗口...
pause >nul