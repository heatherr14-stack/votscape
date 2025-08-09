const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure resolver works properly
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
