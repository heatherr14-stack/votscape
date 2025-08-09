import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import { colors } from '../utils/colors';

export default function VoterToolsScreen() {
  const handleLinkPress = async (url, title) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      Alert.alert('Error', `Could not open ${title}. Please try again later.`);
    }
  };

  const voterTools = [
    {
      id: 'register',
      title: 'Register to Vote',
      description: 'Register to vote or update your registration information',
      icon: 'person-add',
      url: 'https://vote.gov/',
      color: colors.primary,
    },
    {
      id: 'status',
      title: 'Check Registration Status',
      description: 'Verify your voter registration status and polling location',
      icon: 'checkmark-circle',
      url: 'https://www.vote.org/am-i-registered-to-vote/',
      color: colors.success,
    },
    {
      id: 'ballot',
      title: 'View Sample Ballot',
      description: 'See what will be on your ballot before election day',
      icon: 'document-text',
      url: 'https://www.ballotpedia.org/Sample_Ballot_Lookup',
      color: colors.info,
    },
    {
      id: 'polling',
      title: 'Find Polling Location',
      description: 'Locate your polling place and get directions',
      icon: 'location',
      url: 'https://www.vote.org/polling-place-locator/',
      color: colors.warning,
    },
  ];

  const socialMediaTools = [
    {
      id: 'instagram',
      title: 'Local Political Voices on Instagram',
      description: 'Follow local politicians and civic organizations',
      icon: 'logo-instagram',
      url: 'https://www.instagram.com/explore/tags/localgovernment/',
      color: '#E4405F',
    },
    {
      id: 'tiktok',
      title: 'Civic Education on TikTok',
      description: 'Learn about local politics and civic engagement',
      icon: 'musical-notes',
      url: 'https://www.tiktok.com/tag/civiceducation',
      color: '#000000',
    },
  ];

  const renderToolCard = (tool) => (
    <TouchableOpacity
      key={tool.id}
      style={styles.toolCard}
      onPress={() => handleLinkPress(tool.url, tool.title)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: tool.color }]}>
        <Ionicons name={tool.icon} size={24} color={colors.white} />
      </View>
      <View style={styles.toolContent}>
        <Text style={styles.toolTitle}>{tool.title}</Text>
        <Text style={styles.toolDescription}>{tool.description}</Text>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={colors.textSecondary} 
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voter Tools</Text>
        <Text style={styles.headerSubtitle}>
          Everything you need to participate in democracy
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registration & Voting</Text>
        <Text style={styles.sectionDescription}>
          Make sure you're ready to vote in upcoming elections
        </Text>
        {voterTools.map(renderToolCard)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stay Connected</Text>
        <Text style={styles.sectionDescription}>
          Follow local political voices and stay informed
        </Text>
        {socialMediaTools.map(renderToolCard)}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons 
            name="information-circle" 
            size={24} 
            color={colors.info} 
            style={styles.infoIcon}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Important Reminder</Text>
            <Text style={styles.infoText}>
              Votscape is a nonpartisan educational tool. We encourage all 
              eligible citizens to participate in the democratic process 
              regardless of political affiliation.
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons 
            name="shield-checkmark" 
            size={24} 
            color={colors.success} 
            style={styles.infoIcon}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Your Privacy</Text>
            <Text style={styles.infoText}>
              Votscape does not collect, store, or share your personal voting 
              information. All external links open in your device's browser.
            </Text>
          </View>
        </View>
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
    padding: 20,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  toolContent: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
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
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
