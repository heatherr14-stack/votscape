# Votscape - Civic Voting Map App

A React Native + Expo mobile application that helps citizens visualize local voting patterns and engage with the democratic process.

## Features

- **Interactive Voting Maps**: View color-coded regional overlays showing election results
- **Historical Data**: Access voting data from multiple election years (2020, 2018, 2016, 2014)
- **Detailed Results**: Tap on regions to see comprehensive vote breakdowns
- **Voter Tools**: Registration, status checks, and polling location finder
- **Social Media Integration**: Links to local political voices on Instagram and TikTok
- **Accessibility First**: Colorblind-safe palettes and readable fonts
- **Nonpartisan**: Educational focus without political bias

## Tech Stack

- **React Native** with **Expo**
- **react-native-maps** for interactive mapping
- **React Navigation** for screen navigation
- **Expo Location** for user location services
- **Expo Web Browser** for external link handling

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone or download the project**:
   ```bash
   cd C:\Users\heavi\CascadeProjects\votscape
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Google Maps API** (Required for maps):
   - Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the following APIs:
     - Maps SDK for Android
     - Maps SDK for iOS
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` in `app.json` with your actual API key

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Run on device/simulator**:
   - For iOS: `npm run ios`
   - For Android: `npm run android`
   - For web: `npm run web`

## Project Structure

```
votscape/
├── App.js                          # Main app entry point with navigation
├── app.json                        # Expo configuration
├── package.json                    # Dependencies and scripts
├── src/
│   ├── components/
│   │   └── RegionModal.js          # Modal for displaying region details
│   ├── screens/
│   │   ├── MapScreen.js            # Main map with voting overlays
│   │   ├── VoterToolsScreen.js     # Registration and civic tools
│   │   └── AboutScreen.js          # App information and features
│   └── utils/
│       ├── colors.js               # Accessibility-friendly color palette
│       └── votingData.js           # Mock voting data and utilities
└── README.md
```

## Key Components

### MapScreen
- Interactive map with location services
- Election year dropdown selector
- Color-coded voting overlays
- Tappable regions with detailed modals
- Legend for party identification

### VoterToolsScreen
- Voter registration links
- Registration status checker
- Sample ballot viewer
- Polling location finder
- Social media civic engagement links

### AboutScreen
- App information and mission
- Feature overview
- Accessibility information
- Privacy and security details

## Data Sources

Currently uses mock data for demonstration. In production, this would connect to:
- Official state and county election APIs
- Certified election authority databases
- Real-time polling location services

## Accessibility Features

- **Colorblind-safe palette**: Carefully chosen colors that work for all users
- **High contrast**: Strong contrast ratios for readability
- **Large fonts**: Readable text sizes throughout the app
- **Screen reader support**: Proper accessibility labels and hints
- **Simple navigation**: Intuitive tab-based interface

## API Keys Required

1. **Google Maps API Key**: Required for map functionality
   - Add to `app.json` under `expo.android.config.googleMaps.apiKey`
   - Enable Maps SDK for Android and iOS in Google Cloud Console

## Development Notes

- The app uses mock voting data in `src/utils/votingData.js`
- Colors are centralized in `src/utils/colors.js` for consistency
- All external links open in the device's browser for security
- Location permission is requested for showing local voting data

## Contributing

This is an educational project focused on civic engagement. Key principles:
- Maintain strict nonpartisan neutrality
- Prioritize accessibility and usability
- Use official data sources only
- Protect user privacy

## License

Educational use only. Not affiliated with any political organization.

## Getting Started

1. Follow the setup instructions above
2. Replace the Google Maps API key in `app.json`
3. Run `npm start` to begin development
4. Test on both iOS and Android devices
5. Ensure location permissions work properly

For questions or issues, refer to the Expo documentation at https://docs.expo.dev/
