rmdir ..\release /s >nul 2>&1
cd ..\libs
node dojo/dojo.js load=build --profile ../build/rdforms.profile.js --release >nul 2>&1