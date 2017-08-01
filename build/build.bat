rmdir ..\release /s
cd ..\libs
node dojo/dojo.js load=build --profile ../build/rdforms.profile.js --release >nul 2>&1