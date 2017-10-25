@echo off
title Install CPSV-AP Public Service Description Creator - The necessary programs
:: See the title at the top. And this comment will not appear in the command prompt.
:: start "" https://git-scm.com/download/win

:: check if git is installed.
for /f "delims=" %%i in ('git -v 2^>Nul') do set "outputGit=%%i"
:: check if nodejs is installed.
for /f "delims=" %%i in ('node -v 2^>Nul') do set "outputNode=%%i"
:: check if bower is installed.
for /f "delims=" %%i in ('bower -v 2^>Nul') do set "outputBower=%%i"

IF "%outputGit%" EQU "" ( 
	IF "%outputNode%" EQU "" (
		echo Git and Node.js will now be installed. Please click through the installation screens.
		echo After installing node.js, restart your computer. Please run this bat file again afterwards to install the editor.

		pause
		start ./build/Git-2.13.3-64-bit.exe
		start ./build/node-v6.11.2-x64.msi
		pause
		shutdown.exe /r /t 00

	) else (


		IF "%outputBower%" EQU "" (
			echo Bower and Git will now be installed. Please click through the installation screens.
			pause
		
			npm install -g bower
			start ./build/Git-2.13.3-64-bit.exe
			pause
			echo All necessary, supporting programs are now installed. Installing CPSV-AP Public Service Description Creator... This may take a while.
			pause

		) else (
			echo Git will now be installed. Please click through the installation screens.
			pause

			start ./build/Git-2.13.3-64-bit.exe
			pause
			echo All necessary, supporting programs are now installed. Installing CPSV-AP Public Service Description Creator... This may take a while.
			pause

		)
	)
) else (
	IF "%outputNode%" EQU "" (
		echo Node.js will now be installed. Please click through the installation screens.
		echo After installing node.js, restart your computer. Please run this bat file again afterwards to install the editor. This may take a while.

		pause
		start ./build/node-v6.11.2-x64.msi
		pause
		shutdown.exe /r /t 00

	) else (
		IF "%outputBower%" EQU "" (
		echo Bower will now be installed.

		pause
		npm install -g bower
		echo All necessary, supporting programs are now installed. Installing CPSV-AP Public Service Description Creator...
		pause

		) else (
		echo All necessary, supporting programs are already installed. Installing CPSV-AP Public Service Description Creator... This may take a while.
		echo Please respond with 'Y' when asked.
		pause

		)
	)
)

call npm install >nul 2>&1
call bower install >nul 2>&1
cd ./build
CALL ./build.bat
echo The CPSV-AP Public Service Description Creator has been installed successfully.
pause
