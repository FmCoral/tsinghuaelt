@echo off
echo ==============================================
echo            Git自动上传到GitHub工具
echo ==============================================
echo.

:: 检查是否在Git仓库中
if not exist .git (
    echo 错误：当前文件夹不是Git仓库
    echo    请在项目文件夹中运行此脚本，或先执行 git init 初始化仓库
    pause
    exit /b 1
)

:: 检查远程仓库配置
git remote >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未配置远程仓库
    echo    请先执行 git remote add origin [仓库地址] 关联远程仓库
    pause
    exit /b 1
)

:: 跟踪所有修改的文件
echo 正在检测文件修改...
git add .
echo 文件跟踪完成（已将所有修改加入暂存区）
echo.

:: 提交修改（带详细时间）
echo 正在创建提交记录...
for /f "tokens=1-3 delims=/: " %%a in ("%time%") do (
    set "formatted_time=%%a时%%b分%%c秒"
)
git commit -m "自动提交：%date% %formatted_time% - 自动同步本地修改"

:: 检查提交是否成功
if %errorlevel% equ 0 (
    echo 提交成功（提交信息：自动提交：%date% %formatted_time%）
    echo.
    
    :: 推送到远程仓库
    echo 正在推送到GitHub远程仓库...
    git push
    
    :: 检查推送是否成功
    if %errorlevel% equ 0 (
        echo 推送完成！本地修改已同步到远程仓库
    ) else (
        echo 推送失败！可能原因：
        echo    1. 网络连接问题
        echo    2. 远程仓库权限不足
        echo    3. 需要先执行 git pull 同步远程修改
    )
) else (
    echo 没有需要提交的修改（所有文件已与上次提交一致）
)

echo.
echo ==============================================
echo 操作结束，按任意键关闭窗口...
pause >nul