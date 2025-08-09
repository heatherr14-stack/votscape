import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../utils/colors';
import { useAccessibility } from '../contexts/AccessibilityContext';

// Available election years with metadata
const ELECTION_OPTIONS = [
  {
    year: '2024',
    label: '2024 Presidential',
    description: 'Harris vs Trump',
    type: 'Presidential',
    date: 'November 5, 2024'
  },
  {
    year: '2022',
    label: '2022 Midterm',
    description: 'Congressional Elections',
    type: 'Midterm',
    date: 'November 8, 2022'
  },
  {
    year: '2020',
    label: '2020 Presidential',
    description: 'Biden vs Trump',
    type: 'Presidential',
    date: 'November 3, 2020'
  },
  {
    year: '2018',
    label: '2018 Midterm',
    description: 'Congressional Elections',
    type: 'Midterm',
    date: 'November 6, 2018'
  },
  {
    year: '2016',
    label: '2016 Presidential',
    description: 'Trump vs Clinton',
    type: 'Presidential',
    date: 'November 8, 2016'
  },
  {
    year: '2014',
    label: '2014 Midterm',
    description: 'Congressional Elections',
    type: 'Midterm',
    date: 'November 4, 2014'
  },
  {
    year: '2012',
    label: '2012 Presidential',
    description: 'Obama vs Romney',
    type: 'Presidential',
    date: 'November 6, 2012'
  }
];

export default function ElectionDropdown({ 
  selectedYear = '2020', 
  onYearChange,
  disabled = false,
  style = {},
  compact = false
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { getScaledFontSize, getAccessibleColors } = useAccessibility();
  const accessibleColors = getAccessibleColors();

  const selectedElection = ELECTION_OPTIONS.find(option => option.year === selectedYear);

  const handleYearSelect = (year) => {
    if (year !== selectedYear && onYearChange) {
      onYearChange(year);
    }
    setIsModalVisible(false);
  };

  const renderDropdownButton = () => (
    <TouchableOpacity
      style={[
        compact ? styles.compactDropdownButton : styles.dropdownButton,
        disabled && styles.disabledButton,
        { borderColor: accessibleColors.primary },
        style
      ]}
      onPress={() => !disabled && setIsModalVisible(true)}
      activeOpacity={disabled ? 1 : 0.7}
      accessibilityLabel={`Election year selector. Currently selected: ${selectedElection?.label}`}
      accessibilityHint="Tap to change election year"
      accessibilityRole="button"
    >
      <View style={styles.dropdownContent}>
        {!compact && (
          <View style={styles.dropdownText}>
            <Text style={[
              styles.dropdownLabel,
              { fontSize: getScaledFontSize(12) },
              disabled && styles.disabledText
            ]}>
              Election Year
            </Text>
            <Text style={[
              styles.dropdownValue,
              { fontSize: getScaledFontSize(16) },
              disabled && styles.disabledText
            ]}>
              {selectedElection?.label || 'Select Year'}
            </Text>
          </View>
        )}
        {compact && (
          <Text style={[
            styles.compactDropdownText,
            { fontSize: getScaledFontSize(14) },
            disabled && styles.disabledText
          ]}>
            {selectedElection?.year || 'Year'}
          </Text>
        )}
        <Ionicons 
          name={isModalVisible ? "chevron-up" : "chevron-down"} 
          size={compact ? 16 : 20} 
          color={disabled ? colors.textLight : accessibleColors.primary} 
        />
      </View>
    </TouchableOpacity>
  );

  const renderElectionOption = (option) => {
    const isSelected = option.year === selectedYear;
    
    return (
      <Pressable
        key={option.year}
        style={[
          styles.optionItem,
          isSelected && { 
            backgroundColor: accessibleColors.primary + '20',
            borderColor: accessibleColors.primary,
            borderWidth: 1
          }
        ]}
        onPress={() => handleYearSelect(option.year)}
        accessibilityLabel={`${option.label}, ${option.description}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        <View style={styles.optionContent}>
          <View style={styles.optionHeader}>
            <Text style={[
              styles.optionTitle,
              { fontSize: getScaledFontSize(16) },
              isSelected && { color: accessibleColors.primary, fontWeight: 'bold' }
            ]}>
              {option.label}
            </Text>
            {isSelected && (
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={accessibleColors.primary} 
              />
            )}
          </View>
          <Text style={[
            styles.optionDescription,
            { fontSize: getScaledFontSize(14) }
          ]}>
            {option.description}
          </Text>
          <Text style={[
            styles.optionDate,
            { fontSize: getScaledFontSize(12) }
          ]}>
            {option.date}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}
      accessibilityViewIsModal={true}
    >
      <Pressable 
        style={styles.modalOverlay}
        onPress={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable onPress={() => {}} style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[
                styles.modalTitle,
                { fontSize: getScaledFontSize(20) }
              ]}>
                Select Election Year
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
                accessibilityLabel="Close election year selector"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Election Options */}
            <ScrollView 
              style={styles.optionsContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={[
                styles.sectionDescription,
                { fontSize: getScaledFontSize(14) }
              ]}>
                Choose an election year to view voting data and results
              </Text>
              
              {ELECTION_OPTIONS.map(renderElectionOption)}
            </ScrollView>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderDropdownButton()}
      {renderModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdownButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 48,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  compactDropdownButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minHeight: 32,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
    borderColor: colors.gray,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    flex: 1,
  },
  dropdownLabel: {
    color: colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dropdownValue: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  compactDropdownText: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginRight: 4,
  },
  disabledText: {
    color: colors.textLight,
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
    minHeight: '50%',
  },
  modalContent: {
    flex: 1,
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
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    flex: 1,
    padding: 20,
  },
  sectionDescription: {
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  optionItem: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  optionDescription: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  optionDate: {
    color: colors.textLight,
    fontStyle: 'italic',
  },
});

// Export election options for use in other components
export { ELECTION_OPTIONS };
