import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { useAccessibility } from '../contexts/AccessibilityContext';

const PLATFORMS = [
  'Instagram',
  'TikTok',
  'Twitter/X',
  'YouTube',
  'Facebook',
  'LinkedIn',
  'Other'
];

const CATEGORIES = [
  'Political',
  'News & Media',
  'Community Events',
  'Food & Dining',
  'Tourism & Travel',
  'Arts & Culture',
  'Sports & Recreation',
  'Business & Economy',
  'Education',
  'Other'
];

const POLITICAL_LEANS = [
  { value: 'left', label: 'Left-leaning' },
  { value: 'center', label: 'Center/Nonpartisan' },
  { value: 'right', label: 'Right-leaning' },
  { value: 'none', label: 'Not Political' }
];

const styles = StyleSheet.create({
  modalScrollView: {
    flex: 1,
  },
  container: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formContent: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
  },
  dropdownText: {
    flex: 1,
  },
  submitButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disclaimer: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  optionsList: {
    maxHeight: 400,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    minHeight: 56,
  },
  optionText: {
    flex: 1,
    fontWeight: '500',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 0,
    minHeight: 44,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    minHeight: 44,
    borderBottomWidth: 1,
  },
  dropdownOptionText: {
    flex: 1,
  },
});

export default function SuggestionForm() {
  const { getScaledFontSize, getAccessibleColors } = useAccessibility();
  
  // Get accessible colors
  const accessibleColors = getAccessibleColors();
  
  const [formData, setFormData] = useState({
    creatorName: '',
    platform: '',
    category: '',
    politicalLean: '',
    description: '',
    url: '',
    submitterEmail: ''
  });
  
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPoliticalLeanDropdown, setShowPoliticalLeanDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.creatorName.trim()) {
      Alert.alert('Missing Information', 'Please enter the creator name or handle.');
      return false;
    }
    if (!formData.platform) {
      Alert.alert('Missing Information', 'Please select a platform.');
      return false;
    }
    if (!formData.category) {
      Alert.alert('Missing Information', 'Please select a category.');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Missing Information', 'Please provide a description.');
      return false;
    }
    if (!formData.url.trim()) {
      Alert.alert('Missing Information', 'Please provide the creator\'s URL or profile link.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // In a real app, this would submit to a backend service
      // For now, we'll just show a success message
      console.log('Suggestion submitted:', formData);
      
      Alert.alert(
        'Thank You!',
        'Your suggestion has been submitted for review. We appreciate your contribution to helping others discover local creators!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                creatorName: '',
                platform: '',
                category: '',
                politicalLean: '',
                description: '',
                url: '',
                submitterEmail: ''
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInlineDropdown = (options, selectedValue, onSelect, placeholder, isOpen, setIsOpen) => (
    <View>
      <TouchableOpacity
        style={[
          styles.dropdown,
          { 
            backgroundColor: accessibleColors.background,
            borderColor: accessibleColors.border,
            borderBottomLeftRadius: isOpen ? 0 : 8,
            borderBottomRightRadius: isOpen ? 0 : 8,
          }
        ]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[
          styles.dropdownText,
          { 
            fontSize: getScaledFontSize(16),
            color: selectedValue ? accessibleColors.text : accessibleColors.secondary 
          }
        ]}>
          {selectedValue ? (typeof selectedValue === 'string' ? selectedValue : 
            options.find(opt => (typeof opt === 'string' ? opt : opt.value) === selectedValue)?.label || selectedValue) 
            : placeholder}
        </Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={accessibleColors.text} 
        />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={[
          styles.dropdownOptions,
          { 
            backgroundColor: accessibleColors.background,
            borderColor: accessibleColors.border,
          }
        ]}>
          <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
            {options.map((option, index) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              const isSelected = selectedValue === optionValue;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownOption,
                    { 
                      backgroundColor: isSelected ? accessibleColors.primaryLight : accessibleColors.background,
                      borderBottomColor: accessibleColors.border 
                    }
                  ]}
                  onPress={() => {
                    onSelect(optionValue);
                    setIsOpen(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    { 
                      fontSize: getScaledFontSize(16), 
                      color: isSelected ? accessibleColors.primary : accessibleColors.text,
                      fontWeight: isSelected ? '600' : '400'
                    }
                  ]}>
                    {optionLabel}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color={accessibleColors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <>
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, { backgroundColor: accessibleColors.surface, padding: 16 }]}>
          <View style={styles.formContent}>
            {/* Creator Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontSize: getScaledFontSize(14), color: accessibleColors.text }]}>
                Creator Name/Handle *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    fontSize: getScaledFontSize(16),
                    color: accessibleColors.text,
                    backgroundColor: accessibleColors.background,
                    borderColor: accessibleColors.border
                  }
                ]}
                value={formData.creatorName}
                onChangeText={(value) => handleInputChange('creatorName', value)}
                placeholder="e.g., @localcreator or Local Creator Name"
                placeholderTextColor={accessibleColors.secondary}
              />
            </View>

            {/* Platform */}
            <View style={styles.inputGroup}>
              {renderInlineDropdown(
                PLATFORMS,
                formData.platform,
                (value) => handleInputChange('platform', value),
                'Select Platform',
                showPlatformDropdown,
                setShowPlatformDropdown
              )}
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              {renderInlineDropdown(
                CATEGORIES,
                formData.category,
                (value) => handleInputChange('category', value),
                'Select Category',
                showCategoryDropdown,
                setShowCategoryDropdown
              )}
            </View>

            {/* Political Lean (Optional) */}
            <View style={styles.inputGroup}>
              {renderInlineDropdown(
                POLITICAL_LEANS,
                formData.politicalLean,
                (value) => handleInputChange('politicalLean', value),
                'Select Political Lean (Optional)',
                showPoliticalLeanDropdown,
                setShowPoliticalLeanDropdown
              )}
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontSize: getScaledFontSize(14), color: accessibleColors.text }]}>
                Description *
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  { 
                    fontSize: getScaledFontSize(16),
                    color: accessibleColors.text,
                    backgroundColor: accessibleColors.background,
                    borderColor: accessibleColors.border
                  }
                ]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Brief description of what this creator posts about..."
                placeholderTextColor={accessibleColors.secondary}
                multiline={true}
                numberOfLines={3}
              />
            </View>

            {/* URL */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontSize: getScaledFontSize(14), color: accessibleColors.text }]}>
                Profile URL *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    fontSize: getScaledFontSize(16),
                    color: accessibleColors.text,
                    backgroundColor: accessibleColors.background,
                    borderColor: accessibleColors.border
                  }
                ]}
                value={formData.url}
                onChangeText={(value) => handleInputChange('url', value)}
                placeholder="https://..."
                placeholderTextColor={accessibleColors.secondary}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            {/* Submitter Email (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontSize: getScaledFontSize(14), color: accessibleColors.text }]}>
                Your Email (optional, for follow-up)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    fontSize: getScaledFontSize(16),
                    color: accessibleColors.text,
                    backgroundColor: accessibleColors.background,
                    borderColor: accessibleColors.border
                  }
                ]}
                value={formData.submitterEmail}
                onChangeText={(value) => handleInputChange('submitterEmail', value)}
                placeholder="your.email@example.com"
                placeholderTextColor={accessibleColors.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: accessibleColors.primary },
                isSubmitting && { opacity: 0.6 }
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={[styles.submitButtonText, { fontSize: getScaledFontSize(16) }]}>
                {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.disclaimer, { fontSize: getScaledFontSize(12), color: accessibleColors.secondary }]}>
              * Required fields. All suggestions will be reviewed before being added to the app.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
