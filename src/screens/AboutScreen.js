import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import { colors } from '../utils/colors';

export default function AboutScreen() {
  const handleLinkPress = async (url) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  const features = [
    {
      icon: 'map',
      title: 'Interactive Voting Maps',
      description: 'Visualize election results with color-coded regional overlays',
    },
    {
      icon: 'calendar',
      title: 'Historical Data',
      description: 'Access voting data from multiple election years',
    },
    {
      icon: 'information-circle',
      title: 'Detailed Results',
      description: 'Tap regions for comprehensive vote breakdowns',
    },
    {
      icon: 'person-circle',
      title: 'Voter Resources',
      description: 'Tools for registration, status checks, and civic engagement',
    },
    {
      icon: 'eye',
      title: 'Accessibility First',
      description: 'Colorblind-safe palettes and readable fonts',
    },
    {
      icon: 'shield-checkmark',
      title: 'Nonpartisan',
      description: 'Educational focus without political bias',
    },
  ];

  const accessibilityFeatures = [
    'Colorblind-safe color palette',
    'High contrast text and backgrounds',
    'Large, readable fonts',
    'Screen reader compatibility',
    'Simple, intuitive navigation',
    'Clear visual indicators',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="map" size={48} color={colors.primary} />
        </View>
        <Text style={styles.appName}>Votscape</Text>
        <Text style={styles.tagline}>Civic Voting Map</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Votscape</Text>
        <Text style={styles.description}>
          Votscape is an educational tool designed to help citizens understand 
          local voting patterns and engage with the democratic process. Our 
          mission is to make election data accessible, understandable, and 
          actionable for all Americans.
        </Text>
        <Text style={styles.description}>
          We believe that informed citizens make stronger democracies. By 
          visualizing how communities have voted in past elections, we hope 
          to encourage civic participation and help users make informed 
          decisions about their political engagement.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons 
                name={feature.icon} 
                size={24} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility</Text>
        <Text style={styles.description}>
          Votscape is designed to be accessible to all users, including those 
          with visual impairments or color vision differences.
        </Text>
        <View style={styles.accessibilityList}>
          {accessibilityFeatures.map((feature, index) => (
            <View key={index} style={styles.accessibilityItem}>
              <Ionicons 
                name="checkmark-circle" 
                size={16} 
                color={colors.success} 
                style={styles.checkIcon}
              />
              <Text style={styles.accessibilityText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Sources</Text>
        <Text style={styles.description}>
          Election data is sourced from official state and county election 
          authorities. We strive to provide accurate, up-to-date information 
          for educational purposes only.
        </Text>
        <Text style={styles.disclaimer}>
          Votscape is not affiliated with any political party, candidate, or 
          advocacy organization. We maintain strict nonpartisan neutrality 
          in our data presentation and educational content.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <Text style={styles.description}>
          Your privacy is important to us. Votscape does not collect, store, 
          or share personal information about your voting history or political 
          preferences. Location data is used only to show relevant local 
          information and is not transmitted to our servers.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get Involved</Text>
        <Text style={styles.description}>
          Democracy works best when everyone participates. Use the Voter Tools 
          section to register to vote, check your registration status, and 
          find your polling location.
        </Text>
        
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => handleLinkPress('https://vote.gov/')}
        >
          <Ionicons name="open-outline" size={20} color={colors.primary} />
          <Text style={styles.linkText}>Visit Vote.gov</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ for democracy
        </Text>
        <Text style={styles.footerText}>
          © 2024 Votscape - Educational Use Only
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.surface,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: colors.textLight,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
    fontStyle: 'italic',
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  accessibilityList: {
    marginTop: 12,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkIcon: {
    marginRight: 8,
  },
  accessibilityText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 4,
  },
});
