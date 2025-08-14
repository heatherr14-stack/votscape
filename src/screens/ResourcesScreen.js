import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Location from 'expo-location';

import { colors } from '../utils/colors';
import { useAccessibility } from '../contexts/AccessibilityContext';
import SuggestionForm from '../components/SuggestionForm';

// US States data
const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

// State-specific creators data - expanded to include all types of local creators
const STATE_CREATORS = {
  'AL': [
    { name: '@alabamapolitics', platform: 'Instagram', category: 'Political', politicalLean: 'right', description: 'Alabama political news and analysis', url: 'https://instagram.com/alabamapolitics' },
    { name: '@visitalabama', platform: 'Instagram', category: 'Tourism & Travel', description: 'Alabama attractions and travel destinations', url: 'https://instagram.com/visitalabama' },
    { name: '@birminghameats', platform: 'Instagram', category: 'Food & Dining', description: 'Birmingham area restaurants and food scene', url: 'https://instagram.com/birminghameats' },
  ],
  'AK': [
    { name: '@alaskapolitics', platform: 'Instagram', category: 'Political', politicalLean: 'center', description: 'Alaska political news and updates', url: 'https://instagram.com/alaskapolitics' },
    { name: '@visitalaska', platform: 'Instagram', category: 'Tourism & Travel', description: 'Alaska wilderness and travel experiences', url: 'https://instagram.com/visitalaska' },
    { name: '@anchorageeats', platform: 'Instagram', category: 'Food & Dining', description: 'Anchorage dining and local cuisine', url: 'https://instagram.com/anchorageeats' },
  ],
  'AZ': [
    { name: '@arizonapolitics', platform: 'Instagram', category: 'Political', politicalLean: 'center', description: 'Arizona political coverage and analysis', url: 'https://instagram.com/arizonapolitics' },
    { name: '@visitarizona', platform: 'Instagram', category: 'Tourism & Travel', description: 'Arizona attractions and desert adventures', url: 'https://instagram.com/visitarizona' },
    { name: '@phoenixfoodie', platform: 'Instagram', category: 'Food & Dining', description: 'Phoenix area restaurants and food culture', url: 'https://instagram.com/phoenixfoodie' },
  ],
  'AR': [
    { name: '@arkansaspolitics', platform: 'Instagram', category: 'Political', politicalLean: 'right', description: 'Arkansas political news and updates', url: 'https://instagram.com/arkansaspolitics' },
    { name: '@visitarkansas', platform: 'Instagram', category: 'Tourism & Travel', description: 'Arkansas natural beauty and attractions', url: 'https://instagram.com/visitarkansas' },
    { name: '@littlerockeats', platform: 'Instagram', category: 'Food & Dining', description: 'Little Rock dining and local flavors', url: 'https://instagram.com/littlerockeats' },
  ],
  'CA': [
    { name: '@californiacivics', platform: 'TikTok', category: 'Political', politicalLean: 'left', description: 'California voting guides and local politics', url: 'https://tiktok.com/@californiacivics' },
    { name: '@visitcalifornia', platform: 'Instagram', category: 'Tourism & Travel', description: 'California attractions and travel destinations', url: 'https://instagram.com/visitcalifornia' },
    { name: '@laist', platform: 'Instagram', category: 'Local News', description: 'Los Angeles area news and community stories', url: 'https://instagram.com/laist' },
    { name: '@goldenstatevotes', platform: 'Instagram', category: 'Political', politicalLean: 'center', description: 'CA ballot measures and candidate information', url: 'https://instagram.com/goldenstatevotes' },
  ],
  'CO': [
    { name: '@coloradopolitics', platform: 'Instagram', category: 'Political', politicalLean: 'center', description: 'Colorado political news and analysis', url: 'https://instagram.com/coloradopolitics' },
    { name: '@visitcolorado', platform: 'Instagram', category: 'Tourism & Travel', description: 'Colorado outdoor adventures and attractions', url: 'https://instagram.com/visitcolorado' },
    { name: '@denvereats', platform: 'Instagram', category: 'Food & Dining', description: 'Denver area restaurants and craft beer scene', url: 'https://instagram.com/denvereats' },
  ],
  'CT': [
    { name: '@connecticutpolitics', platform: 'Instagram', category: 'Political', politicalLean: 'left', description: 'Connecticut political coverage', url: 'https://instagram.com/connecticutpolitics' },
    { name: '@visitct', platform: 'Instagram', category: 'Tourism & Travel', description: 'Connecticut attractions and New England charm', url: 'https://instagram.com/visitct' },
    { name: '@hartfordeats', platform: 'Instagram', category: 'Food & Dining', description: 'Hartford area dining and local cuisine', url: 'https://instagram.com/hartfordeats' },
  ],
  'DE': [
    { name: '@delawarepolitics', platform: 'Instagram', category: 'Political', politicalLean: 'left', description: 'Delaware political news and updates', url: 'https://instagram.com/delawarepolitics' },
    { name: '@visitdelaware', platform: 'Instagram', category: 'Tourism & Travel', description: 'Delaware beaches and attractions', url: 'https://instagram.com/visitdelaware' },
    { name: '@wilmingtoneats', platform: 'Instagram', category: 'Food & Dining', description: 'Wilmington dining and coastal cuisine', url: 'https://instagram.com/wilmingtoneats' },
  ],
  'FL': [
    { name: '@floridavoterinfo', platform: 'TikTok', category: 'Political', politicalLean: 'center', description: 'Florida elections and ballot guides', url: 'https://tiktok.com/@floridavoterinfo' },
    { name: '@visitflorida', platform: 'Instagram', category: 'Tourism & Travel', description: 'Florida attractions and vacation destinations', url: 'https://instagram.com/visitflorida' },
    { name: '@miamiherald', platform: 'Instagram', category: 'Local News', description: 'South Florida news and community coverage', url: 'https://instagram.com/miamiherald' },
    { name: '@sunshinestatecivics', platform: 'Instagram', category: 'Political', politicalLean: 'right', description: 'FL civic engagement and voting', url: 'https://instagram.com/sunshinestatecivics' },
  ],
  'GA': [
    { name: '@georgiapolitics', platform: 'Instagram', category: 'Political', politicalLean: 'center', description: 'Georgia political news and analysis', url: 'https://instagram.com/georgiapolitics' },
    { name: '@exploregeorgia', platform: 'Instagram', category: 'Tourism & Travel', description: 'Georgia attractions and Southern charm', url: 'https://instagram.com/exploregeorgia' },
    { name: '@atlantaeats', platform: 'Instagram', category: 'Food & Dining', description: 'Atlanta dining and Southern cuisine', url: 'https://instagram.com/atlantaeats' },
  ],
  'HI': [
    { name: '@hawaiipolitics', platform: 'Instagram', category: 'Political', politicalLean: 'left', description: 'Hawaii political coverage and island issues', url: 'https://instagram.com/hawaiipolitics' },
    { name: '@gohawaii', platform: 'Instagram', category: 'Tourism & Travel', description: 'Hawaii islands and tropical adventures', url: 'https://instagram.com/gohawaii' },
    { name: '@honolulueats', platform: 'Instagram', category: 'Food & Dining', description: 'Honolulu dining and Hawaiian cuisine', url: 'https://instagram.com/honolulueats' },
  ],
  'ID': [
    { name: '@idahopolitics', platform: 'Instagram', category: 'Political', politicalLean: 'right', description: 'Idaho political news and updates', url: 'https://instagram.com/idahopolitics' },
    { name: '@visitidaho', platform: 'Instagram', category: 'Tourism & Travel', description: 'Idaho outdoor adventures and natural beauty', url: 'https://instagram.com/visitidaho' },
    { name: '@boiseeats', platform: 'Instagram', category: 'Food & Dining', description: 'Boise area restaurants and local cuisine', url: 'https://instagram.com/boiseeats' },
  ],
  'IL': [
    { name: '@illinoispolitics', platform: 'Instagram', category: 'Political', politicalLean: 'left', description: 'Illinois political coverage and Chicago politics', url: 'https://instagram.com/illinoispolitics' },
    { name: '@enjoyillinois', platform: 'Instagram', category: 'Tourism & Travel', description: 'Illinois attractions and Midwest experiences', url: 'https://instagram.com/enjoyillinois' },
    { name: '@chicagoeats', platform: 'Instagram', category: 'Food & Dining', description: 'Chicago dining and deep-dish culture', url: 'https://instagram.com/chicagoeats' },
  ],
  'IN': [
    { name: '@indianapolitics', platform: 'Instagram', category: 'Political', politicalLean: 'right', description: 'Indiana political news and analysis', url: 'https://instagram.com/indianapolitics' },
    { name: '@visitindiana', platform: 'Instagram', category: 'Tourism & Travel', description: 'Indiana attractions and Hoosier hospitality', url: 'https://instagram.com/visitindiana' },
    { name: '@indianapoliseats', platform: 'Instagram', category: 'Food & Dining', description: 'Indianapolis dining and local flavors', url: 'https://instagram.com/indianapoliseats' },
  ],
  'IA': [
    { name: '@iowapolitics', platform: 'Instagram', category: 'Political', politicalLean: 'center', description: 'Iowa political coverage and caucus news', url: 'https://instagram.com/iowapolitics' },
    { name: '@traveliowa', platform: 'Instagram', category: 'Tourism & Travel', description: 'Iowa attractions and heartland experiences', url: 'https://instagram.com/traveliowa' },
    { name: '@desmoineseats', platform: 'Instagram', category: 'Food & Dining', description: 'Des Moines dining and farm-to-table cuisine', url: 'https://instagram.com/desmoineseats' },
  ],
  'KS': [
    { name: '@kansaspolitics', platform: 'Instagram', category: 'Political', politicalLean: 'right', description: 'Kansas political news and updates', url: 'https://instagram.com/kansaspolitics' },
    { name: '@travelks', platform: 'Instagram', category: 'Tourism & Travel', description: 'Kansas attractions and prairie experiences', url: 'https://instagram.com/travelks' },
    { name: '@wichitaeats', platform: 'Instagram', category: 'Food & Dining', description: 'Wichita area restaurants and local cuisine', url: 'https://instagram.com/wichitaeats' },
  ],
  'KY': [
    { name: '@kentuckypolitics', platform: 'Instagram', category: 'Political', politicalLean: 'right', description: 'Kentucky political coverage and bourbon country', url: 'https://instagram.com/kentuckypolitics' },
    { name: '@kentuckytourism', platform: 'Instagram', category: 'Tourism & Travel', description: 'Kentucky attractions and bluegrass culture', url: 'https://instagram.com/kentuckytourism' },
    { name: '@louisvilleeats', platform: 'Instagram', category: 'Food & Dining', description: 'Louisville dining and bourbon cuisine', url: 'https://instagram.com/louisvilleeats' },
  ],
  'LA': [
    { name: '@louisianapolitics', platform: 'Instagram', category: 'Political', politicalLean: 'right', description: 'Louisiana political news and Bayou politics', url: 'https://instagram.com/louisianapolitics' },
    { name: '@louisianatravel', platform: 'Instagram', category: 'Tourism & Travel', description: 'Louisiana culture and Creole experiences', url: 'https://instagram.com/louisianatravel' },
    { name: '@neworleanseats', platform: 'Instagram', category: 'Food & Dining', description: 'New Orleans dining and Creole cuisine', url: 'https://instagram.com/neworleanseats' },
  ],
  'ME': [
    { name: '@mainepolitics', platform: 'Instagram', category: 'Political', politicalLean: 'left', description: 'Maine political coverage and Down East issues', url: 'https://instagram.com/mainepolitics' },
    { name: '@visitmaine', platform: 'Instagram', category: 'Tourism & Travel', description: 'Maine coast and lighthouse adventures', url: 'https://instagram.com/visitmaine' },
    { name: '@portlandeats', platform: 'Instagram', category: 'Food & Dining', description: 'Portland dining and fresh seafood', url: 'https://instagram.com/portlandeats' },
  ],
  'MD': [
    { name: '@marylandpolitics', platform: 'Instagram', category: 'Political', politicalLean: 'left', description: 'Maryland political news and Baltimore coverage', url: 'https://instagram.com/marylandpolitics' },
    { name: '@visitmaryland', platform: 'Instagram', category: 'Tourism & Travel', description: 'Maryland attractions and Chesapeake Bay', url: 'https://instagram.com/visitmaryland' },
    { name: '@baltimoreeats', platform: 'Instagram', category: 'Food & Dining', description: 'Baltimore dining and crab cuisine', url: 'https://instagram.com/baltimoreeats' },
  ],
  'MA': [
    { name: '@massachusettspolitics', platform: 'Instagram', category: 'Political', politicalLean: 'left', description: 'Massachusetts political coverage and Boston politics', url: 'https://instagram.com/massachusettspolitics' },
    { name: '@massvacation', platform: 'Instagram', category: 'Tourism & Travel', description: 'Massachusetts attractions and New England history', url: 'https://instagram.com/massvacation' },
    { name: '@bostoneats', platform: 'Instagram', category: 'Food & Dining', description: 'Boston dining and New England cuisine', url: 'https://instagram.com/bostoneats' },
  ],
  'MI': [
    { name: '@michiganpolitics', platform: 'Instagram', category: 'Political', politicalLean: 'center', description: 'Michigan political news and Great Lakes issues', url: 'https://instagram.com/michiganpolitics' },
    { name: '@michigan', platform: 'Instagram', category: 'Tourism & Travel', description: 'Michigan attractions and Great Lakes adventures', url: 'https://instagram.com/michigan' },
    { name: '@detroiteats', platform: 'Instagram', category: 'Food & Dining', description: 'Detroit dining and Motor City cuisine', url: 'https://instagram.com/detroiteats' },
  ],
  'MN': [
    { name: '@minnesotapolitics', platform: 'Instagram', category: 'Political', politicalLean: 'left', description: 'Minnesota political coverage and Twin Cities news', url: 'https://instagram.com/minnesotapolitics' },
    { name: '@exploreminnesota', platform: 'Instagram', category: 'Tourism & Travel', description: 'Minnesota attractions and Land of 10,000 Lakes', url: 'https://instagram.com/exploreminnesota' },
    { name: '@minneapoliseats', platform: 'Instagram', category: 'Food & Dining', description: 'Minneapolis dining and Nordic cuisine', url: 'https://instagram.com/minneapoliseats' },
  ],
  'MS': [
    { name: '@mississippipolitics', platform: 'Instagram', category: 'Political', politicalLean: 'right', description: 'Mississippi political news and Delta coverage', url: 'https://instagram.com/mississippipolitics' },
    { name: '@visitmississippi', platform: 'Instagram', category: 'Tourism & Travel', description: 'Mississippi culture and Southern hospitality', url: 'https://instagram.com/visitmississippi' },
    { name: '@jacksoneats', platform: 'Instagram', category: 'Food & Dining', description: 'Jackson area dining and Southern cuisine', url: 'https://instagram.com/jacksoneats' },
  ],
  'MO': [
    { name: '@missouripolitics', platform: 'Instagram', category: 'Political', politicalLean: 'right', description: 'Missouri political coverage and Show-Me State news', url: 'https://instagram.com/missouripolitics' },
    { name: '@visitmissouri', platform: 'Instagram', category: 'Tourism & Travel', description: 'Missouri attractions and heartland experiences', url: 'https://instagram.com/visitmissouri' },
    { name: '@kansascityeats', platform: 'Instagram', category: 'Food & Dining', description: 'Kansas City BBQ and local dining', url: 'https://instagram.com/kansascityeats' },
  ],
  'MT': [
    { name: '@montanapolitics', platform: 'Instagram', category: 'Political', politicalLean: 'right', description: 'Montana political news and Big Sky coverage', url: 'https://instagram.com/montanapolitics' },
    { name: '@visitmontana', platform: 'Instagram', category: 'Tourism & Travel', description: 'Montana wilderness and outdoor adventures', url: 'https://instagram.com/visitmontana' },
    { name: '@billingsmeats', platform: 'Instagram', category: 'Food & Dining', description: 'Billings area dining and ranch cuisine', url: 'https://instagram.com/billingsmeats' },
  ],
};

const getPoliticalLeanIcon = (lean) => {
  switch (lean) {
    case 'left':
      return { name: 'chevron-back-circle', color: '#3B82F6' }; // Blue for left/Democratic
    case 'center':
      return { name: 'radio-button-on', color: '#6B7280' }; // Gray for center/nonpartisan
    case 'right':
      return { name: 'chevron-forward-circle', color: '#EF4444' }; // Red for right/Republican
    default:
      return null;
  }
};

export default function ResourcesScreen() {
  const [selectedState, setSelectedState] = useState(null);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [suggestionModalVisible, setSuggestionModalVisible] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const { getScaledFontSize, getAccessibleColors } = useAccessibility();
  
  // Get accessible colors
  const accessibleColors = getAccessibleColors();

  useEffect(() => {
    detectUserState();
  }, []);

  const detectUserState = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationLoading(false);
        setSelectedState({ code: 'CA', name: 'California' }); // Default to CA
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      
      // Simple state detection based on coordinates
      const stateFromCoords = getStateFromCoordinates(location.coords.latitude, location.coords.longitude);
      setSelectedState(stateFromCoords);
      setLocationLoading(false);
    } catch (error) {
      console.error('Error detecting location:', error);
      setSelectedState({ code: 'CA', name: 'California' }); // Default to CA
      setLocationLoading(false);
    }
  };

  const getStateFromCoordinates = (lat, lng) => {
    // Simple coordinate-based state detection
    if (lat >= 32.5 && lat <= 42 && lng >= -124.4 && lng <= -114.1) return { code: 'CA', name: 'California' };
    if (lat >= 25.8 && lat <= 31 && lng >= -106.6 && lng <= -93.5) return { code: 'TX', name: 'Texas' };
    if (lat >= 40.5 && lat <= 45.0 && lng >= -79.8 && lng <= -71.8) return { code: 'NY', name: 'New York' };
    if (lat >= 24.4 && lat <= 31.0 && lng >= -87.6 && lng <= -80.0) return { code: 'FL', name: 'Florida' };
    
    // Default to California if we can't determine
    return { code: 'CA', name: 'California' };
  };

  const handleLinkPress = async (url, title) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      Alert.alert('Error', `Could not open ${title}. Please try again later.`);
    }
  };

  const getStateSpecificResources = () => {
    if (!selectedState) return [];
    
    const baseUrl = 'https://www.sos.';
    const stateCode = selectedState.code.toLowerCase();
    
    return [
      {
        id: 'state-sos',
        title: `${selectedState.name} Secretary of State`,
        description: 'Official state election information and voter services',
        icon: 'business',
        url: `${baseUrl}${stateCode === 'ca' ? 'ca.gov' : stateCode === 'tx' ? 'texas.gov' : stateCode === 'ny' ? 'ny.gov' : stateCode === 'fl' ? 'fl.gov' : 'state.' + stateCode + '.us'}`,
        color: accessibleColors.primary,
        category: 'official'
      },
      {
        id: 'state-ballot',
        title: `${selectedState.name} Sample Ballot`,
        description: 'View your local ballot and candidate information',
        icon: 'ballot',
        url: `https://ballotpedia.org/${selectedState.name}`,
        color: accessibleColors.info,
        category: 'ballot'
      },
      {
        id: 'state-polling',
        title: `${selectedState.name} Polling Locations`,
        description: 'Find your polling place and voting hours',
        icon: 'location',
        url: `https://vote.org/polling-place-locator/`,
        color: accessibleColors.success,
        category: 'voting'
      }
    ];
  };

  const getStateCreators = () => {
    if (!selectedState || !STATE_CREATORS[selectedState.code]) {
      return [
        { name: '@CivicEngagement101', platform: 'TikTok', description: 'General civic education and voting tips', url: 'https://tiktok.com/@civicengagement101' },
        { name: '@VoteReady', platform: 'Instagram', description: 'Nonpartisan voting information and guides', url: 'https://instagram.com/voteready' },
      ];
    }
    
    return STATE_CREATORS[selectedState.code];
  };

  const voterTools = [
    {
      id: 'register',
      title: 'Register to Vote',
      description: 'Register to vote or update your registration information',
      icon: 'person-add',
      url: 'https://vote.org/register-to-vote/',
      color: accessibleColors.primary,
      category: 'registration'
    },
    {
      id: 'status',
      title: 'Check Registration Status',
      description: 'Verify your voter registration status and information',
      icon: 'checkmark-circle',
      url: 'https://vote.org/am-i-registered-to-vote/',
      color: accessibleColors.success,
      category: 'registration'
    },
    {
      id: 'absentee',
      title: 'Request Absentee Ballot',
      description: 'Apply for an absentee or mail-in ballot',
      icon: 'mail',
      url: 'https://vote.org/absentee-ballot/',
      color: accessibleColors.info,
      category: 'voting'
    }
  ];

  const educationalResources = [
    {
      id: 'ballotpedia',
      title: 'Ballotpedia',
      description: 'Comprehensive information on elections and candidates',
      icon: 'library',
      url: 'https://ballotpedia.org/',
      color: accessibleColors.primary,
      category: 'education'
    },
    {
      id: 'govtrack',
      title: 'GovTrack',
      description: 'Track Congress and federal legislation',
      icon: 'analytics',
      url: 'https://www.govtrack.us/',
      color: accessibleColors.info,
      category: 'education'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* State Selector Header */}
        <View style={styles.stateHeader}>
          <Text style={[styles.stateHeaderTitle, { fontSize: getScaledFontSize(18) }]}>
            Select Your State for Local Resources
          </Text>
          <TouchableOpacity
            style={styles.stateSelector}
            onPress={() => setStateModalVisible(true)}
            accessibilityLabel="Select state"
            accessibilityHint="Choose your state to see local resources and creators"
          >
            <Ionicons name="location" size={20} color={accessibleColors.primary} />
            <Text style={[styles.stateText, { fontSize: getScaledFontSize(16) }]}>
              {locationLoading ? 'Detecting...' : selectedState ? selectedState.name : 'Select State'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* State-Specific Creators */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(20) }]}>
            {selectedState ? `${selectedState.name} ` : ''}Local Creators to Follow
          </Text>
          <Text style={[styles.sectionSubtitle, { fontSize: getScaledFontSize(14) }]}>
            Educational content creators focused on {selectedState ? selectedState.name : 'general'} civic engagement
          </Text>
          {getStateCreators().map((creator, index) => (
            <TouchableOpacity
              key={index}
              style={styles.creatorCard}
              onPress={() => handleLinkPress(creator.url, creator.name)}
              accessibilityLabel={`${creator.name} on ${creator.platform}`}
              accessibilityHint={creator.description}
            >
              <View style={styles.creatorIcon}>
                <Ionicons 
                  name={creator.platform === 'TikTok' ? 'musical-notes' : 'camera'} 
                  size={20} 
                  color={accessibleColors.primary} 
                />
              </View>
              <View style={styles.creatorContent}>
                <Text style={[styles.creatorName, { fontSize: getScaledFontSize(16) }]}>
                  {creator.name}
                </Text>
                <Text style={[styles.creatorPlatform, { fontSize: getScaledFontSize(12) }]}>
                  {creator.platform}
                </Text>
                <Text style={[styles.creatorDescription, { fontSize: getScaledFontSize(14) }]}>
                  {creator.description}
                </Text>
                {creator.politicalLean && (
                  <View style={styles.creatorLean}>
                    <Ionicons 
                      name={getPoliticalLeanIcon(creator.politicalLean).name} 
                      size={16} 
                      color={getPoliticalLeanIcon(creator.politicalLean).color} 
                    />
                    <Text style={[styles.creatorLeanText, { fontSize: getScaledFontSize(12) }]}>
                      {creator.politicalLean.charAt(0).toUpperCase() + creator.politicalLean.slice(1)}
                    </Text>
                  </View>
                )}
              </View>
              <Ionicons name="open-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Suggest a Creator Button */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(20) }]}>
            Suggest a Creator
          </Text>
          <TouchableOpacity
            style={styles.suggestButton}
            onPress={() => setSuggestionModalVisible(true)}
            accessibilityLabel="Suggest a creator"
            accessibilityHint="Open the suggestion form to recommend a local creator"
          >
            <Text style={[styles.suggestButtonText, { fontSize: getScaledFontSize(16) }]}>
              Suggest a Creator
            </Text>
          </TouchableOpacity>
        </View>

        {/* State-Specific Resources */}
        {selectedState && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(20) }]}>
              {selectedState.name} Resources
            </Text>
            {getStateSpecificResources().map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={[styles.toolCard, { borderLeftColor: tool.color }]}
                onPress={() => handleLinkPress(tool.url, tool.title)}
                accessibilityLabel={tool.title}
                accessibilityHint={tool.description}
              >
                <View style={styles.toolIcon}>
                  <Ionicons name={tool.icon} size={24} color={tool.color} />
                </View>
                <View style={styles.toolContent}>
                  <Text style={[styles.toolTitle, { fontSize: getScaledFontSize(16) }]}>
                    {tool.title}
                  </Text>
                  <Text style={[styles.toolDescription, { fontSize: getScaledFontSize(14) }]}>
                    {tool.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* General Voter Tools */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(20) }]}>
            Voter Tools
          </Text>
          {voterTools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[styles.toolCard, { borderLeftColor: tool.color }]}
              onPress={() => handleLinkPress(tool.url, tool.title)}
              accessibilityLabel={tool.title}
              accessibilityHint={tool.description}
            >
              <View style={styles.toolIcon}>
                <Ionicons name={tool.icon} size={24} color={tool.color} />
              </View>
              <View style={styles.toolContent}>
                <Text style={[styles.toolTitle, { fontSize: getScaledFontSize(16) }]}>
                  {tool.title}
                </Text>
                <Text style={[styles.toolDescription, { fontSize: getScaledFontSize(14) }]}>
                  {tool.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Educational Resources */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(20) }]}>
            Educational Resources
          </Text>
          {educationalResources.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={[styles.toolCard, { borderLeftColor: resource.color }]}
              onPress={() => handleLinkPress(resource.url, resource.title)}
              accessibilityLabel={resource.title}
              accessibilityHint={resource.description}
            >
              <View style={styles.toolIcon}>
                <Ionicons name={resource.icon} size={24} color={resource.color} />
              </View>
              <View style={styles.toolContent}>
                <Text style={[styles.toolTitle, { fontSize: getScaledFontSize(16) }]}>
                  {resource.title}
                </Text>
                <Text style={[styles.toolDescription, { fontSize: getScaledFontSize(14) }]}>
                  {resource.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, { fontSize: getScaledFontSize(12) }]}>
            Votscape is nonpartisan and does not endorse any candidates or political parties. 
            All external links are provided for educational purposes only.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Footer with Last Updated Date */}
      <View style={[styles.stickyFooter, { backgroundColor: accessibleColors.surface }]}>
        <Text style={[styles.lastUpdatedText, { color: accessibleColors.textSecondary, fontSize: getScaledFontSize(12) }]}>
          Data last updated: August 7, 2025
        </Text>
      </View>

      {/* State Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={stateModalVisible}
        onRequestClose={() => setStateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontSize: getScaledFontSize(18) }]}>
                Select Your State
              </Text>
              <TouchableOpacity
                onPress={() => setStateModalVisible(false)}
                accessibilityLabel="Close state selection"
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.stateList}>
              {US_STATES.map((state) => (
                <TouchableOpacity
                  key={state.code}
                  style={[
                    styles.stateOption,
                    selectedState?.code === state.code && styles.selectedStateOption
                  ]}
                  onPress={() => {
                    setSelectedState(state);
                    setStateModalVisible(false);
                  }}
                  accessibilityLabel={`Select ${state.name}`}
                >
                  <Text style={[
                    styles.stateOptionText,
                    { fontSize: getScaledFontSize(16) },
                    selectedState?.code === state.code && styles.selectedStateText
                  ]}>
                    {state.name}
                  </Text>
                  {selectedState?.code === state.code && (
                    <Ionicons name="checkmark" size={20} color={accessibleColors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Suggestion Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={suggestionModalVisible}
        onRequestClose={() => setSuggestionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontSize: getScaledFontSize(18) }]}>
                Suggest a Creator
              </Text>
              <TouchableOpacity
                onPress={() => setSuggestionModalVisible(false)}
                accessibilityLabel="Close suggestion form"
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <SuggestionForm />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  stateHeader: {
    backgroundColor: colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  stateHeaderTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  stateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  stateText: {
    flex: 1,
    marginLeft: 8,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  section: {
    backgroundColor: colors.white,
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toolIcon: {
    marginRight: 16,
  },
  toolContent: {
    flex: 1,
  },
  toolTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  toolDescription: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  creatorIcon: {
    marginRight: 12,
  },
  creatorContent: {
    flex: 1,
  },
  creatorName: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  creatorPlatform: {
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  creatorDescription: {
    color: colors.textSecondary,
    lineHeight: 18,
  },
  creatorLean: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  creatorLeanText: {
    color: colors.textSecondary,
    marginLeft: 4,
  },
  disclaimer: {
    backgroundColor: colors.surface,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  disclaimerText: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastUpdatedText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: colors.black,
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
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  stateList: {
    maxHeight: 400,
  },
  stateOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  selectedStateOption: {
    backgroundColor: colors.primaryLight,
  },
  stateOptionText: {
    color: colors.textPrimary,
  },
  selectedStateText: {
    color: colors.primary,
    fontWeight: '600',
  },
  suggestButton: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
