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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  optionText: {
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
  
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPoliticalLeanModal, setShowPoliticalLeanModal] = useState(false);
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

  const renderDropdownModal = (visible, setVisible, options, selectedValue, onSelect, title) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: accessibleColors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: accessibleColors.border }]}>
            <Text style={[styles.modalTitle, { fontSize: getScaledFontSize(18), color: accessibleColors.text }]}>
              {title}
            </Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color={accessibleColors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsList}>
            {options.map((option, index) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              const isSelected = selectedValue === optionValue;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    { borderBottomColor: accessibleColors.border },
                    isSelected && { backgroundColor: accessibleColors.primaryLight }
                  ]}
                  onPress={() => {
                    onSelect(optionValue);
                    setVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    { fontSize: getScaledFontSize(16), color: accessibleColors.text },
                    isSelected && { color: accessibleColors.primary, fontWeight: '600' }
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
      </View>
    </Modal>
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
              <Text style={[styles.label, { fontSize: getScaledFontSize(14), color: accessibleColors.text }]}>
                Platform *
              </Text>
              <TouchableOpacity
                style={[
                  styles.dropdown,
                  { 
                    backgroundColor: accessibleColors.background,
                    borderColor: accessibleColors.border
                  }
                ]}
                onPress={() => setShowPlatformModal(true)}
              >
                <Text style={[
                  styles.dropdownText,
                  { 
                    fontSize: getScaledFontSize(16),
                    color: formData.platform ? accessibleColors.text : accessibleColors.secondary
                  }
                ]}>
                  {formData.platform || 'Select Platform'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={accessibleColors.secondary} />
              </TouchableOpacity>
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontSize: getScaledFontSize(14), color: accessibleColors.text }]}>
                Category *
              </Text>
              <TouchableOpacity
                style={[
                  styles.dropdown,
                  { 
                    backgroundColor: accessibleColors.background,
                    borderColor: accessibleColors.border
                  }
                ]}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={[
                  styles.dropdownText,
                  { 
                    fontSize: getScaledFontSize(16),
                    color: formData.category ? accessibleColors.text : accessibleColors.secondary
                  }
                ]}>
                  {formData.category || 'Select Category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={accessibleColors.secondary} />
              </TouchableOpacity>
            </View>

            {/* Political Lean (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontSize: getScaledFontSize(14), color: accessibleColors.text }]}>
                Political Lean (if applicable)
              </Text>
              <TouchableOpacity
                style={[
                  styles.dropdown,
                  { 
                    backgroundColor: accessibleColors.background,
                    borderColor: accessibleColors.border
                  }
                ]}
                onPress={() => setShowPoliticalLeanModal(true)}
              >
                <Text style={[
                  styles.dropdownText,
                  { 
                    fontSize: getScaledFontSize(16),
                    color: formData.politicalLean ? accessibleColors.text : accessibleColors.secondary
                  }
                ]}>
                  {POLITICAL_LEANS.find(lean => lean.value === formData.politicalLean)?.label || 'Select Political Lean (Optional)'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={accessibleColors.secondary} />
              </TouchableOpacity>
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

      {/* Modals */}
      {renderDropdownModal(
        showPlatformModal,
        setShowPlatformModal,
        PLATFORMS,
        formData.platform,
        (value) => handleInputChange('platform', value),
        'Select Platform'
      )}

      {renderDropdownModal(
        showCategoryModal,
        setShowCategoryModal,
        CATEGORIES,
        formData.category,
        (value) => handleInputChange('category', value),
        'Select Category'
      )}

      {renderDropdownModal(
        showPoliticalLeanModal,
        setShowPoliticalLeanModal,
        POLITICAL_LEANS,
        formData.politicalLean,
        (value) => handleInputChange('politicalLean', value),
        'Select Political Lean'
      )}
    </>
  );
}
