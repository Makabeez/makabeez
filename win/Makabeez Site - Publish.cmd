@echo off
rem Publishes the Makabeez site: commits every change and pushes; Vercel deploys on push.
wsl -d Ubuntu --cd /mnt/c/Github/makabeez -- bash -lc "git add -A && (git commit -qm \"site update\" || true) && git push && echo Published. Live in about 30 seconds."
pause
