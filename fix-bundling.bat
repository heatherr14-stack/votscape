@echo off
echo Fixing React Native and Metro bundling issues...
echo.

echo Step 1: Clearing npm cache...
npm cache clean --force

echo Step 2: Removing node_modules...
rmdir /s /q node_modules

echo Step 3: Removing package-lock.json...
del package-lock.json

echo Step 4: Installing fresh dependencies...
npm install

echo Step 5: Installing Metro dependencies explicitly...
npm install metro@0.76.8 metro-core@0.76.8 @expo/metro-config@0.10.7 --save-dev

echo Step 6: Installing Expo CLI globally...
npm install -g @expo/cli@latest

echo Step 7: Clearing Expo cache...
npx expo install --fix

echo Step 8: Starting Expo with cleared cache...
npx expo start --clear

echo.
echo Bundling fix complete! The app should now start properly.
pause
