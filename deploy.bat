@echo off

rem Git 操作
git pull origin source

git add .
git commit -m "backup"
git push origin source

rem Hexo 生成和部署
hexo g
hexo d

rem 完成提示
echo Finish

rem 等待用户按任意键继续
echo 按任意键继续
pause >nul
