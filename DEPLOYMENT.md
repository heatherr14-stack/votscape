# Votscape Deployment Guide

This guide will help you deploy the Votscape app to Expo hosting and create preview builds.

## Prerequisites

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Create Expo Account** (if needed):
   - Go to [expo.dev](https://expo.dev) and create an account

## Initial Setup

1. **Configure Project ID**:
   ```bash
   eas project:init
   ```
   This will update your `app.json` with a unique project ID.

2. **Update app.json** with your Expo username:
   - Replace `"owner": "your-expo-username"` with your actual Expo username
   - The project ID will be automatically generated

## Building the App

### Development Build
```bash
npm run build:development
```

### Preview Build (Recommended for testing)
```bash
npm run build:preview
```

### Production Build
```bash
npm run build:production
```

## Expo Updates (Web Hosting)

1. **Configure Updates**:
   ```bash
   eas update:configure
   ```

2. **Publish Update**:
   ```bash
   eas update --branch main --message "Initial release"
   ```

## Web Deployment

1. **Build for Web**:
   ```bash
   expo export:web
   ```

2. **Deploy to Expo Hosting**:
   ```bash
   npx serve web-build
   ```

## Getting Preview Links

### For Mobile Apps:
After running a preview build, EAS will provide:
- QR code for testing on physical devices
- Direct download links for iOS/Android
- Expo Go app compatibility (for development builds)

### For Web App:
1. **Start Development Server**:
   ```bash
   npm start
   ```
   Then press `w` to open in web browser

2. **Or use Expo's web hosting**:
   ```bash
   expo publish:web
   ```

## Environment Variables

Before deploying, make sure to:

1. **Add Google Maps API Key**:
   - Get API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` in `app.json`

2. **Configure Firebase/Supabase** (when implemented):
   - Add database configuration
   - Set up environment variables for API keys

## Troubleshooting

### Common Issues:

1. **Metro Bundler Errors** (Cannot find module 'metro/src/ModuleGraph/worker/importLocationsPlugin'):
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules
   npm install
   
   # Clear Metro cache
   expo start --clear
   
   # If still having issues, try:
   npx expo install --fix
   ```

2. **Asset Errors**: 
   - Ensure all referenced assets exist or remove references from `app.json`
   - Current config has asset references removed to prevent errors

3. **Build Failures**:
   - Check that all dependencies are properly installed
   - Ensure `eas.json` configuration is correct

4. **Web Bundle Errors**:
   - Try clearing Metro cache: `expo start --clear`
   - Ensure all imports are correct

5. **Dependency Version Conflicts**:
   ```bash
   # Fix dependency versions
   npx expo install --fix
   
   # Or manually update package.json with compatible versions
   npm install
   ```

## Testing the Deployment

1. **Local Testing**:
   ```bash
   npm run web
   ```

2. **Preview Build Testing**:
   - Use Expo Go app to scan QR code
   - Or download the generated APK/IPA files

3. **Web Testing**:
   - Test in multiple browsers
   - Check responsive design on different screen sizes

## Next Steps

1. Set up continuous deployment with GitHub Actions
2. Configure app store submissions
3. Set up analytics and crash reporting
4. Implement over-the-air updates

## Quick Commands

```bash
# Start development
npm start

# Build preview
npm run build:preview

# Update app
npm run update

# Deploy web version
expo export:web

# Fix dependency issues
npx expo install --fix

# Clear cache and restart
expo start --clear
```

## Support

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Updates Documentation](https://docs.expo.dev/eas-update/introduction/)
