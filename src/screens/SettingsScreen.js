import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../utils/colors';
import { 
  useAccessibility, 
  FONT_SCALES, 
  COLOR_BLIND_MODES 
} from '../contexts/AccessibilityContext';

export default function SettingsScreen() {
  const {
    settings,
    setColorBlindMode,
    setFontScale,
    setHighContrast,
    resetSettings,
    getScaledFontSize,
    getAccessibleColors,
    isColorBlindModeEnabled,
    isHighContrastEnabled,
    currentFontScaleLabel,
    currentColorBlindModeLabel,
  } = useAccessibility();

  const [showFontModal, setShowFontModal] = useState(false);
  const [showColorBlindModal, setShowColorBlindModal] = useState(false);

  const accessibleColors = getAccessibleColors();

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all accessibility settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetSettings();
            Alert.alert('Settings Reset', 'All accessibility settings have been reset to default.');
          }
        },
      ]
    );
  };

  const renderSettingCard = ({ title, description, icon, children, iconColor = accessibleColors.primary }) => (
    <View style={styles.settingCard}>
      <View style={styles.settingHeader}>
        <View style={[styles.settingIcon, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingTitle, { fontSize: getScaledFontSize(16) }]}>
            {title}
          </Text>
          <Text style={[styles.settingDescription, { fontSize: getScaledFontSize(14) }]}>
            {description}
          </Text>
        </View>
      </View>
      {children}
    </View>
  );

  const renderFontScaleModal = () => (
    <Modal
      visible={showFontModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFontModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { fontSize: getScaledFontSize(20) }]}>
              Font Size
            </Text>
            <TouchableOpacity onPress={() => setShowFontModal(false)}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {Object.values(FONT_SCALES).map((scale) => (
              <TouchableOpacity
                key={scale.value}
                style={[
                  styles.optionItem,
                  settings.fontScale === scale.value && styles.selectedOption
                ]}
                onPress={() => {
                  setFontScale(scale.value);
                  setShowFontModal(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  { fontSize: 16 * scale.value },
                  settings.fontScale === scale.value && styles.selectedOptionText
                ]}>
                  {scale.label}
                </Text>
                <Text style={[
                  styles.optionExample,
                  { fontSize: 14 * scale.value }
                ]}>
                  Sample text at this size
                </Text>
                {settings.fontScale === scale.value && (
                  <Ionicons name="checkmark" size={20} color={accessibleColors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderColorBlindModal = () => (
    <Modal
      visible={showColorBlindModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowColorBlindModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { fontSize: getScaledFontSize(20) }]}>
              Color Vision Support
            </Text>
            <TouchableOpacity onPress={() => setShowColorBlindModal(false)}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {Object.values(COLOR_BLIND_MODES).map((mode) => (
              <TouchableOpacity
                key={mode.value}
                style={[
                  styles.optionItem,
                  settings.colorBlindMode === mode.value && styles.selectedOption
                ]}
                onPress={() => {
                  setColorBlindMode(mode.value);
                  setShowColorBlindModal(false);
                }}
              >
                <View style={styles.colorModeOption}>
                  <Text style={[
                    styles.optionText,
                    { fontSize: getScaledFontSize(16) },
                    settings.colorBlindMode === mode.value && styles.selectedOptionText
                  ]}>
                    {mode.label}
                  </Text>
                  
                  {/* Color preview */}
                  <View style={styles.colorPreview}>
                    <View style={[styles.colorSample, { backgroundColor: mode.value === 'none' ? colors.democrat : getAccessibleColors().democrat }]} />
                    <View style={[styles.colorSample, { backgroundColor: mode.value === 'none' ? colors.republican : getAccessibleColors().republican }]} />
                    <View style={[styles.colorSample, { backgroundColor: mode.value === 'none' ? colors.independent : getAccessibleColors().independent }]} />
                  </View>
                </View>
                
                {settings.colorBlindMode === mode.value && (
                  <Ionicons name="checkmark" size={20} color={accessibleColors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontSize: getScaledFontSize(28) }]}>
          Settings
        </Text>
        <Text style={[styles.headerSubtitle, { fontSize: getScaledFontSize(16) }]}>
          Customize your Votscape experience
        </Text>
      </View>

      {/* Accessibility Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(20) }]}>
          Accessibility
        </Text>
        
        {/* Font Size Setting */}
        {renderSettingCard({
          title: 'Font Size',
          description: `Current: ${currentFontScaleLabel}`,
          icon: 'text',
          iconColor: accessibleColors.info,
          children: (
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => setShowFontModal(true)}
            >
              <Text style={[styles.settingButtonText, { fontSize: getScaledFontSize(14) }]}>
                {currentFontScaleLabel}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )
        })}

        {/* Color Vision Support */}
        {renderSettingCard({
          title: 'Color Vision Support',
          description: `Current: ${currentColorBlindModeLabel}`,
          icon: 'eye',
          iconColor: accessibleColors.warning,
          children: (
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => setShowColorBlindModal(true)}
            >
              <Text style={[styles.settingButtonText, { fontSize: getScaledFontSize(14) }]}>
                {currentColorBlindModeLabel}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )
        })}

        {/* High Contrast Toggle */}
        {renderSettingCard({
          title: 'High Contrast Mode',
          description: 'Enhanced contrast for better readability',
          icon: 'contrast',
          iconColor: accessibleColors.error,
          children: (
            <Switch
              value={isHighContrastEnabled}
              onValueChange={setHighContrast}
              trackColor={{ false: colors.lightGray, true: accessibleColors.primary + '40' }}
              thumbColor={isHighContrastEnabled ? accessibleColors.primary : colors.gray}
            />
          )
        })}
      </View>

      {/* App Information Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(20) }]}>
          App Information
        </Text>
        
        {renderSettingCard({
          title: 'Version',
          description: 'Votscape v1.0.0',
          icon: 'information-circle',
          children: null
        })}

        {renderSettingCard({
          title: 'Privacy Policy',
          description: 'Learn how we protect your data',
          icon: 'shield-checkmark',
          iconColor: accessibleColors.success,
          children: (
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          )
        })}
      </View>

      {/* Reset Settings */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.resetButton, { borderColor: accessibleColors.error }]}
          onPress={handleResetSettings}
        >
          <Ionicons name="refresh" size={20} color={accessibleColors.error} />
          <Text style={[styles.resetButtonText, { 
            fontSize: getScaledFontSize(16),
            color: accessibleColors.error 
          }]}>
            Reset All Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Accessibility Info */}
      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons 
            name="accessibility" 
            size={24} 
            color={accessibleColors.info} 
            style={styles.infoIcon}
          />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { fontSize: getScaledFontSize(14) }]}>
              Accessibility Features
            </Text>
            <Text style={[styles.infoText, { fontSize: getScaledFontSize(12) }]}>
              Votscape is designed to be accessible to all users. Our settings help 
              accommodate different visual needs and preferences to ensure everyone 
              can participate in civic engagement.
            </Text>
          </View>
        </View>
      </View>

      {/* Modals */}
      {renderFontScaleModal()}
      {renderColorBlindModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    color: colors.textSecondary,
    lineHeight: 18,
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
  },
  settingButtonText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  resetButtonText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  infoSection: {
    padding: 20,
    paddingTop: 0,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    color: colors.textSecondary,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  selectedOption: {
    backgroundColor: colors.primary + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  optionText: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  selectedOptionText: {
    color: colors.primary,
  },
  optionExample: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  colorModeOption: {
    flex: 1,
  },
  colorPreview: {
    flexDirection: 'row',
    marginTop: 8,
  },
  colorSample: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
});
