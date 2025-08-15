const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure resolver works properly
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add resolver configuration for web libraries
config.resolver.alias = {
  ...(config.resolver.alias || {}),
};

module.exports = config;
