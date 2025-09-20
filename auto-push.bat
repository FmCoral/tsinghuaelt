@echo off
echo 开始自动上传到GitHub...

:: 跟踪所有修改的文件
git add .

:: 自动生成带时间的提交信息
git commit -m "自动提交：%date% %time%"

:: 推送到GitHub
git push

echo 上传完成！
pause