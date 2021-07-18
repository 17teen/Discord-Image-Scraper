@echo off
title Discord Image Scraper
:top
node scrape.js
pause
cls
node post.js
pause
exit