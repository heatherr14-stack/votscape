import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const AccessibilityContext = createContext();

// Storage keys
const STORAGE_KEYS = {
  COLOR_BLIND_MODE: 'accessibility_color_blind_mode',
  FONT_SCALE: 'accessibility_font_scale',
  HIGH_CONTRAST: 'accessibility_high_contrast',
};

// Font scale options
export const FONT_SCALES = {
  SMALL: { label: 'Small', value: 0.85 },
  NORMAL: { label: 'Normal', value: 1.0 },
  LARGE: { label: 'Large', value: 1.15 },
  EXTRA_LARGE: { label: 'Extra Large', value: 1.3 },
};

// Color blind mode options
export const COLOR_BLIND_MODES = {
  NONE: { label: 'Standard Colors', value: 'none' },
  PROTANOPIA: { label: 'Protanopia (Red-Blind)', value: 'protanopia' },
  DEUTERANOPIA: { label: 'Deuteranopia (Green-Blind)', value: 'deuteranopia' },
  TRITANOPIA: { label: 'Tritanopia (Blue-Blind)', value: 'tritanopia' },
  HIGH_CONTRAST: { label: 'High Contrast', value: 'high_contrast' },
};

// Default accessibility settings
const DEFAULT_SETTINGS = {
  colorBlindMode: COLOR_BLIND_MODES.NONE.value,
  fontScale: FONT_SCALES.NORMAL.value,
  highContrast: false,
};

// Accessibility Provider Component
export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from storage on app start
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [colorBlindMode, fontScale, highContrast] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.COLOR_BLIND_MODE),
        AsyncStorage.getItem(STORAGE_KEYS.FONT_SCALE),
        AsyncStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST),
      ]);

      setSettings({
        colorBlindMode: colorBlindMode || DEFAULT_SETTINGS.colorBlindMode,
        fontScale: fontScale ? parseFloat(fontScale) : DEFAULT_SETTINGS.fontScale,
        highContrast: highContrast === 'true',
      });
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.COLOR_BLIND_MODE, newSettings.colorBlindMode),
        AsyncStorage.setItem(STORAGE_KEYS.FONT_SCALE, newSettings.fontScale.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, newSettings.highContrast.toString()),
      ]);
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  };

  // Update color blind mode
  const setColorBlindMode = async (mode) => {
    const newSettings = { ...settings, colorBlindMode: mode };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  // Update font scale
  const setFontScale = async (scale) => {
    const newSettings = { ...settings, fontScale: scale };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  // Update high contrast mode
  const setHighContrast = async (enabled) => {
    const newSettings = { ...settings, highContrast: enabled };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  // Reset to default settings
  const resetSettings = async () => {
    setSettings(DEFAULT_SETTINGS);
    await saveSettings(DEFAULT_SETTINGS);
  };

  // Get scaled font size
  const getScaledFontSize = (baseFontSize) => {
    return Math.round(baseFontSize * settings.fontScale);
  };

  // Get accessible colors based on color blind mode
  const getAccessibleColors = () => {
    const baseColors = {
      // Standard colors from colors.js
      primary: '#2563eb',
      democrat: '#2563eb',
      republican: '#dc2626',
      independent: '#059669',
      other: '#7c3aed',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#0891b2',
    };

    switch (settings.colorBlindMode) {
      case COLOR_BLIND_MODES.PROTANOPIA.value:
        return {
          ...baseColors,
          republican: '#8B4513', // Brown instead of red
          error: '#8B4513',
          democrat: '#0066CC', // Stronger blue
        };
      
      case COLOR_BLIND_MODES.DEUTERANOPIA.value:
        return {
          ...baseColors,
          independent: '#FF6600', // Orange instead of green
          success: '#FF6600',
          republican: '#CC0000', // Darker red
        };
      
      case COLOR_BLIND_MODES.TRITANOPIA.value:
        return {
          ...baseColors,
          primary: '#CC0066', // Magenta instead of blue
          democrat: '#CC0066',
          info: '#CC0066',
        };
      
      case COLOR_BLIND_MODES.HIGH_CONTRAST.value:
        return {
          ...baseColors,
          primary: '#000000',
          democrat: '#000000',
          republican: '#FFFFFF',
          independent: '#FFFF00',
          other: '#FF00FF',
          success: '#00FF00',
          warning: '#FFFF00',
          error: '#FF0000',
          info: '#00FFFF',
        };
      
      default:
        return baseColors;
    }
  };

  const contextValue = {
    settings,
    isLoading,
    setColorBlindMode,
    setFontScale,
    setHighContrast,
    resetSettings,
    getScaledFontSize,
    getAccessibleColors,
    // Helper functions
    isColorBlindModeEnabled: settings.colorBlindMode !== COLOR_BLIND_MODES.NONE.value,
    isHighContrastEnabled: settings.highContrast,
    currentFontScaleLabel: Object.values(FONT_SCALES).find(scale => scale.value === settings.fontScale)?.label || 'Custom',
    currentColorBlindModeLabel: Object.values(COLOR_BLIND_MODES).find(mode => mode.value === settings.colorBlindMode)?.label || 'Unknown',
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook to use accessibility context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// HOC for components that need accessibility-aware styling
export const withAccessibility = (Component) => {
  return (props) => {
    const accessibility = useAccessibility();
    return <Component {...props} accessibility={accessibility} />;
  };
};
