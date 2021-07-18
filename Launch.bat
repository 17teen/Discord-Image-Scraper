@echo off
title Launch

if exist node_modules\ (
  echo You've already installed this
  echo Navigate to Global directory or the Private directory
) else (
  echo Modules will be installed.
  pause  
  call npm i >> NUL
  echo Succesfully installed!
  echo Please re-run this file.
)