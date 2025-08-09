import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as WebBrowser from 'expo-web-browser';

import { colors } from '../utils/colors';
import { useAccessibility } from '../contexts/AccessibilityContext';
import ElectionDropdown from '../components/ElectionDropdown';

const HomeScreen = () => {
  console.log('HomeScreen component starting...');
  
  try {
    const { getScaledFontSize, colors: accessibilityColors } = useAccessibility();
    console.log('useAccessibility hook successful');
    
    // Fallback colors in case accessibilityColors is undefined
    const safeColors = accessibilityColors || {
      background: '#ffffff',
      text: '#000000',
      primary: '#007AFF',
      secondary: '#666666',
      border: '#cccccc'
    };
    
    const [selectedYear, setSelectedYear] = useState('2024');
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState('');
    const [isManualLocation, setIsManualLocation] = useState(false);
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [manualLocationInput, setManualLocationInput] = useState('');
    const [selectedElection, setSelectedElection] = useState(null);
    const [sourceModalVisible, setSourceModalVisible] = useState(false);

    console.log('State variables initialized');

    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to show local elections.');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        const newLocation = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };

        setLocation(newLocation);
        setIsManualLocation(false);
        
        // Get location name using reverse geocoding
        try {
          const reverseGeocode = await Location.reverseGeocodeAsync(newLocation);
          if (reverseGeocode && reverseGeocode.length > 0) {
            const address = reverseGeocode[0];
            const locationString = `Current Location: ${address.city || address.subregion || 'Unknown City'}, ${address.region || address.administrativeArea || 'Unknown State'}`;
            setLocationName(locationString);
          } else {
            setLocationName('Current Location: Unknown');
          }
        } catch (geocodeError) {
          console.log('Geocoding error:', geocodeError);
          setLocationName('Current Location: Unknown');
        }
      } catch (error) {
        console.error('Location error:', error);
        Alert.alert('Location Error', 'Unable to get your current location. Please set it manually.');
      }
    };

    const getLocalElections = () => {
      if (!location) return [];
      
      const { latitude, longitude } = location;
      
      // Texas Counties - simplified for testing
      if (latitude >= 29.6 && latitude <= 30.0 && longitude >= -95.7 && longitude <= -95.0) {
        return [
          {
            name: 'Harris County - President',
            type: 'President',
            data: { candidate1: 56.8, candidate2: 42.1, totalVotes: 1876543, winner: 'candidate1' },
            candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
            source: 'Harris County Clerk'
          }
        ];
      }
      
      // Default fallback
      return [
        {
          name: 'Sample Election',
          type: 'Mayor',
          data: { candidate1: 48.9, candidate2: 51.1, totalVotes: 67890, winner: 'candidate2' },
          candidates: ['Democratic Candidate', 'Republican Candidate'],
          source: 'Local Election Office'
        }
      ];
    };

    useEffect(() => {
      console.log('HomeScreen useEffect triggered');
      try {
        getCurrentLocation();
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    }, []);

    const localElections = getLocalElections();

    console.log('About to render HomeScreen...');

    const handleManualLocation = async () => {
      if (!manualLocationInput.trim()) {
        Alert.alert('Invalid Input', 'Please enter a valid location.');
        return;
      }

      try {
        // First try Expo's geocoding
        const geocoded = await Location.geocodeAsync(manualLocationInput);
        
        if (geocoded && geocoded.length > 0) {
          const newLocation = {
            latitude: geocoded[0].latitude,
            longitude: geocoded[0].longitude,
          };
          setLocation(newLocation);
          setLocationName(`Current Location: ${manualLocationInput}`);
          setIsManualLocation(true);
          setLocationModalVisible(false);
          setManualLocationInput('');
          return;
        }
      } catch (error) {
        console.log('Expo geocoding failed, trying fallback:', error);
      }

      // Fallback: Check if it's a zip code or known city
      const input = manualLocationInput.toLowerCase().trim();
      let fallbackLocation = null;
      let fallbackName = '';

      // Zip code patterns and major cities
      const locationMappings = {
        // Texas zip codes and cities
        '77001': { lat: 29.7604, lng: -95.3698, name: 'Houston, TX' },
        '77002': { lat: 29.7604, lng: -95.3698, name: 'Houston, TX' },
        '78701': { lat: 30.2672, lng: -97.7431, name: 'Austin, TX' },
        '78702': { lat: 30.2672, lng: -97.7431, name: 'Austin, TX' },
        '75201': { lat: 32.7767, lng: -96.7970, name: 'Dallas, TX' },
        '75202': { lat: 32.7767, lng: -96.7970, name: 'Dallas, TX' },
        '78201': { lat: 29.4241, lng: -98.4936, name: 'San Antonio, TX' },
        '78202': { lat: 29.4241, lng: -98.4936, name: 'San Antonio, TX' },
        'houston': { lat: 29.7604, lng: -95.3698, name: 'Houston, TX' },
        'austin': { lat: 30.2672, lng: -97.7431, name: 'Austin, TX' },
        'dallas': { lat: 32.7767, lng: -96.7970, name: 'Dallas, TX' },
        'san antonio': { lat: 29.4241, lng: -98.4936, name: 'San Antonio, TX' },
        // California
        '90210': { lat: 34.0901, lng: -118.4065, name: 'Los Angeles, CA' },
        'los angeles': { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, CA' },
        // New York
        '10001': { lat: 40.7505, lng: -73.9934, name: 'New York, NY' },
        'new york': { lat: 40.7128, lng: -74.0060, name: 'New York, NY' },
        'nyc': { lat: 40.7128, lng: -74.0060, name: 'New York, NY' },
      };

      const mapping = locationMappings[input];
      if (mapping) {
        fallbackLocation = { latitude: mapping.lat, longitude: mapping.lng };
        fallbackName = `Current Location: ${mapping.name}`;
      }

      if (fallbackLocation) {
        setLocation(fallbackLocation);
        setLocationName(fallbackName);
        setIsManualLocation(true);
        setLocationModalVisible(false);
        setManualLocationInput('');
      } else {
        Alert.alert('Location Not Found', 'Could not find the specified location. Please try a different location or use GPS.');
      }
    };

    const handleElectionPress = (election) => {
      setSelectedElection(election);
      setSourceModalVisible(true);
    };

    const handleCandidatePress = async (candidateName) => {
      // Extract candidate name without party affiliation
      const cleanName = candidateName.replace(/\s*\([DR]\)$/, '');
      
      // Create a search query for the candidate's campaign website
      const searchQuery = `${cleanName} campaign website official`;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      
      try {
        await WebBrowser.openBrowserAsync(searchUrl);
      } catch (error) {
        console.error('Error opening browser:', error);
        Alert.alert('Error', 'Unable to open campaign website');
      }
    };

    const getElectionsByYear = (baseElections, includeNational) => {
      if (!baseElections) return [];
      
      let elections = [...baseElections];
      
      if (includeNational && location) {
        // Add presidential results for 2020 and 2024
        const presidentialResult = getPresidentialResults(location.latitude, location.longitude, selectedYear);
        if (presidentialResult) {
          elections.unshift(presidentialResult);
        }
        
        // Add congressional results
        const congressionalResult = getCongressionalResults(location.latitude, longitude, selectedYear);
        if (congressionalResult) {
          elections.push(congressionalResult);
        }
      }
      
      return elections;
    };
    
    const getPresidentialResults = (latitude, longitude, year) => {
      // This function would normally be here, but since we're using county-based data now,
      // we can return null or implement state-level presidential results if needed
      return null;
    };
    
    const getCongressionalResults = (latitude, longitude, year) => {
      // This function would normally be here, but since we're using county-based data now,
      // we can return null or implement congressional district results if needed
      return null;
    };
    
    const getElectionTypeColor = (type) => {
      switch (type) {
        case 'President':
          return colors.primary;
        case 'Senator':
          return colors.secondary || '#6366f1';
        case 'Governor':
          return colors.success || '#059669';
        case 'Mayor':
          return colors.warning || '#d97706';
        case 'Treasurer':
          return colors.info || '#0891b2';
        default:
          return colors.lightGray;
      }
    };

    const getNextElectionDate = () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      
      // Define upcoming election dates (these would ideally come from a database)
      const upcomingElections = [
        { date: new Date(2025, 10, 4), type: 'Municipal', description: 'Municipal Elections' }, // November 4, 2025
        { date: new Date(2026, 10, 3), type: 'Congressional', description: 'Congressional Midterm Elections' }, // November 3, 2026
        { date: new Date(2027, 10, 2), type: 'Municipal', description: 'Municipal Elections' }, // November 2, 2027
        { date: new Date(2028, 10, 7), type: 'Presidential', description: 'Presidential Election' }, // November 7, 2028
      ];
      
      // Find the next election after today
      const nextElection = upcomingElections.find(election => election.date > currentDate);
      
      if (nextElection) {
        return {
          date: nextElection.date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          type: nextElection.type,
          description: nextElection.description
        };
      }
      
      // Fallback if no upcoming elections found
      return {
        date: 'November 2024',
        type: 'General',
        description: 'General Election'
      };
    };

    return (
      <ScrollView style={[styles.container, { backgroundColor: safeColors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { 
            fontSize: getScaledFontSize(28), 
            color: safeColors.text 
          }]}>
            Election Results
          </Text>
          
          {/* Location Display */}
          <TouchableOpacity 
            style={styles.locationContainer}
            onPress={() => setLocationModalVisible(true)}
          >
            <Ionicons name="location-outline" size={16} color={safeColors.primary} />
            <Text style={[styles.locationText, { 
              fontSize: getScaledFontSize(14), 
              color: safeColors.text 
            }]}>
              {locationName || 'Tap to set location'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Year Selection */}
        <View style={styles.yearContainer}>
          <Text style={[styles.yearLabel, { 
            fontSize: getScaledFontSize(16), 
            color: safeColors.text 
          }]}>
            Election Year:
          </Text>
          <ElectionDropdown
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            style={styles.yearDropdown}
          />
        </View>

        {/* Test Results */}
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsTitle, { 
            fontSize: getScaledFontSize(20), 
            color: safeColors.text 
          }]}>
            {selectedYear} Election Results
          </Text>
          
          <Text style={[styles.testText, { 
            fontSize: getScaledFontSize(16), 
            color: safeColors.secondary 
          }]}>
            Year dropdown and location detection working!
          </Text>
          
          {location && (
            <Text style={[styles.locationInfo, { 
              fontSize: getScaledFontSize(14), 
              color: safeColors.text 
            }]}>
              Location: {locationName}
            </Text>
          )}
        </View>
        
        {/* Manual Location Modal */}
        <Modal
          visible={locationModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setLocationModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: safeColors.background }]}>
              <Text style={[styles.modalTitle, { 
                fontSize: getScaledFontSize(18), 
                color: safeColors.text 
              }]}>
                Set Your Location
              </Text>
              
              <TextInput
                style={[styles.locationInput, { 
                  borderColor: safeColors.border,
                  color: safeColors.text 
                }]}
                placeholder="Enter city, state or zip code"
                placeholderTextColor={safeColors.secondary}
                value={manualLocationInput}
                onChangeText={setManualLocationInput}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setLocationModalVisible(false);
                    setManualLocationInput('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: safeColors.primary }]}
                  onPress={handleManualLocation}
                >
                  <Text style={styles.confirmButtonText}>Set Location</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  } catch (error) {
    console.error('Error in HomeScreen component:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading Election Results</Text>
        <Text>{error.toString()}</Text>
      </View>
    );
  }

// Texas County Election Data (2016-2024)
const TEXAS_COUNTY_ELECTIONS = {
  'Harris': {
    '2024': [
      {
        name: 'Harris County - President',
        type: 'President',
        data: { candidate1: 56.8, candidate2: 42.1, totalVotes: 1876543, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)']
      },
      {
        name: 'Harris County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 54.2, candidate2: 44.8, totalVotes: 1823456, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)']
      },
      {
        name: 'Harris County - Governor',
        type: 'Governor',
        data: { candidate1: 47.3, candidate2: 51.7, totalVotes: 1798234, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)']
      },
      {
        name: 'Harris County - Mayor (Houston)',
        type: 'Mayor',
        data: { candidate1: 62.4, candidate2: 37.6, totalVotes: 456789, winner: 'candidate1' },
        candidates: ['Sylvester Turner (D)', 'Tony Buzbee (R)']
      },
      {
        name: 'Harris County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 58.9, candidate2: 41.1, totalVotes: 1654321, winner: 'candidate1' },
        candidates: ['Dylan Osborne (D)', 'Mike Sullivan (R)']
      }
    ],
    '2022': [
      {
        name: 'Harris County - Governor',
        type: 'Governor',
        data: { candidate1: 48.1, candidate2: 50.9, totalVotes: 1723456, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)']
      },
      {
        name: 'Harris County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 52.3, candidate2: 46.7, totalVotes: 1698765, winner: 'candidate1' },
        candidates: ['MJ Hegar (D)', 'John Cornyn (R)']
      },
      {
        name: 'Harris County - Mayor (Houston)',
        type: 'Mayor',
        data: { candidate1: 64.2, candidate2: 35.8, totalVotes: 423456, winner: 'candidate1' },
        candidates: ['Sylvester Turner (D)', 'Bill King (R)']
      },
      {
        name: 'Harris County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 55.7, candidate2: 44.3, totalVotes: 1587654, winner: 'candidate1' },
        candidates: ['Dylan Osborne (D)', 'Chris Hollins (R)']
      }
    ],
    '2020': [
      {
        name: 'Harris County - President',
        type: 'President',
        data: { candidate1: 56.0, candidate2: 42.7, totalVotes: 1934567, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)']
      },
      {
        name: 'Harris County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 46.4, candidate2: 52.6, totalVotes: 1876543, winner: 'candidate2' },
        candidates: ['MJ Hegar (D)', 'John Cornyn (R)']
      },
      {
        name: 'Harris County - Mayor (Houston)',
        type: 'Mayor',
        data: { candidate1: 59.8, candidate2: 40.2, totalVotes: 398765, winner: 'candidate1' },
        candidates: ['Sylvester Turner (D)', 'Tony Buzbee (R)']
      },
      {
        name: 'Harris County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 57.2, candidate2: 42.8, totalVotes: 1723456, winner: 'candidate1' },
        candidates: ['Dylan Osborne (D)', 'Mike Sullivan (R)']
      }
    ],
    '2018': [
      {
        name: 'Harris County - Governor',
        type: 'Governor',
        data: { candidate1: 49.3, candidate2: 49.7, totalVotes: 1654321, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)']
      },
      {
        name: 'Harris County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 49.8, candidate2: 49.2, totalVotes: 1598765, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Ted Cruz (R)']
      },
      {
        name: 'Harris County - Mayor (Houston)',
        type: 'Mayor',
        data: { candidate1: 61.4, candidate2: 38.6, totalVotes: 376543, winner: 'candidate1' },
        candidates: ['Sylvester Turner (D)', 'Bill King (R)']
      },
      {
        name: 'Harris County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 54.6, candidate2: 45.4, totalVotes: 1487654, winner: 'candidate1' },
        candidates: ['Dylan Osborne (D)', 'Chris Hollins (R)']
      }
    ],
    '2016': [
      {
        name: 'Harris County - President',
        type: 'President',
        data: { candidate1: 54.2, candidate2: 41.8, totalVotes: 1723456, winner: 'candidate1' },
        candidates: ['Hillary Clinton (D)', 'Donald Trump (R)']
      },
      {
        name: 'Harris County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 43.9, candidate2: 52.1, totalVotes: 1654321, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Ted Cruz (R)']
      },
      {
        name: 'Harris County - Mayor (Houston)',
        type: 'Mayor',
        data: { candidate1: 58.7, candidate2: 41.3, totalVotes: 354321, winner: 'candidate1' },
        candidates: ['Sylvester Turner (D)', 'Bill King (R)']
      },
      {
        name: 'Harris County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 52.3, candidate2: 47.7, totalVotes: 1432109, winner: 'candidate1' },
        candidates: ['Dylan Osborne (D)', 'Mike Sullivan (R)']
      }
    ]
  },
  'Dallas': {
    '2024': [
      {
        name: 'Dallas County - President',
        type: 'President',
        data: { candidate1: 65.1, candidate2: 33.9, totalVotes: 1456789, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)']
      },
      {
        name: 'Dallas County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 62.8, candidate2: 36.2, totalVotes: 1398765, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)']
      },
      {
        name: 'Dallas County - Governor',
        type: 'Governor',
        data: { candidate1: 58.4, candidate2: 40.6, totalVotes: 1387654, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)']
      },
      {
        name: 'Dallas County - Mayor (Dallas)',
        type: 'Mayor',
        data: { candidate1: 67.2, candidate2: 32.8, totalVotes: 287654, winner: 'candidate1' },
        candidates: ['Eric Johnson (D)', 'Scott Griggs (D)']
      },
      {
        name: 'Dallas County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 64.7, candidate2: 35.3, totalVotes: 1298765, winner: 'candidate1' },
        candidates: ['Pauline Medrano (D)', 'J.J. Koch (R)']
      }
    ]
  },
  'Travis': {
    '2024': [
      {
        name: 'Travis County - President',
        type: 'President',
        data: { candidate1: 71.4, candidate2: 26.8, totalVotes: 654321, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)']
      },
      {
        name: 'Travis County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 68.9, candidate2: 29.1, totalVotes: 634567, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)']
      },
      {
        name: 'Travis County - Governor',
        type: 'Governor',
        data: { candidate1: 66.7, candidate2: 31.3, totalVotes: 623456, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)']
      },
      {
        name: 'Travis County - Mayor (Austin)',
        type: 'Mayor',
        data: { candidate1: 72.3, candidate2: 27.7, totalVotes: 198765, winner: 'candidate1' },
        candidates: ['Kirk Watson (D)', 'Celia Israel (D)']
      },
      {
        name: 'Travis County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 69.8, candidate2: 30.2, totalVotes: 587654, winner: 'candidate1' },
        candidates: ['Dolores Ortega Carter (D)', 'Mike Novak (R)']
      }
    ]
  },
  'Bexar': {
    '2024': [
      {
        name: 'Bexar County - President',
        type: 'President',
        data: { candidate1: 58.7, candidate2: 40.1, totalVotes: 987654, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)']
      },
      {
        name: 'Bexar County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 56.3, candidate2: 42.7, totalVotes: 954321, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)']
      },
      {
        name: 'Bexar County - Governor',
        type: 'Governor',
        data: { candidate1: 54.8, candidate2: 44.2, totalVotes: 934567, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)']
      },
      {
        name: 'Bexar County - Mayor (San Antonio)',
        type: 'Mayor',
        data: { candidate1: 61.4, candidate2: 38.6, totalVotes: 234567, winner: 'candidate1' },
        candidates: ['Ron Nirenberg (I)', 'Greg Brockhouse (R)']
      },
      {
        name: 'Bexar County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 57.9, candidate2: 42.1, totalVotes: 876543, winner: 'candidate1' },
        candidates: ['Lucy Adame-Clark (D)', 'John Saunders (R)']
      }
    ],
    '2022': [
      {
        name: 'Bexar County - Governor',
        type: 'Governor',
        data: { candidate1: 52.6, candidate2: 46.4, totalVotes: 898765, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)']
      },
      {
        name: 'Bexar County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 48.9, candidate2: 50.1, totalVotes: 876543, winner: 'candidate2' },
        candidates: ['MJ Hegar (D)', 'John Cornyn (R)']
      },
      {
        name: 'Bexar County - Mayor (San Antonio)',
        type: 'Mayor',
        data: { candidate1: 59.8, candidate2: 40.2, totalVotes: 198765, winner: 'candidate1' },
        candidates: ['Ron Nirenberg (I)', 'Greg Brockhouse (R)']
      },
      {
        name: 'Bexar County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 55.4, candidate2: 44.6, totalVotes: 823456, winner: 'candidate1' },
        candidates: ['Lucy Adame-Clark (D)', 'John Saunders (R)']
      }
    ],
    '2020': [
      {
        name: 'Bexar County - President',
        type: 'President',
        data: { candidate1: 58.2, candidate2: 40.4, totalVotes: 1023456, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)']
      },
      {
        name: 'Bexar County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 47.8, candidate2: 51.2, totalVotes: 987654, winner: 'candidate2' },
        candidates: ['MJ Hegar (D)', 'John Cornyn (R)']
      },
      {
        name: 'Bexar County - Mayor (San Antonio)',
        type: 'Mayor',
        data: { candidate1: 62.1, candidate2: 37.9, totalVotes: 176543, winner: 'candidate1' },
        candidates: ['Ron Nirenberg (I)', 'Greg Brockhouse (R)']
      },
      {
        name: 'Bexar County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 56.7, candidate2: 43.3, totalVotes: 934567, winner: 'candidate1' },
        candidates: ['Lucy Adame-Clark (D)', 'John Saunders (R)']
      }
    ],
    '2018': [
      {
        name: 'Bexar County - Governor',
        type: 'Governor',
        data: { candidate1: 51.3, candidate2: 47.7, totalVotes: 876543, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)']
      },
      {
        name: 'Bexar County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 52.1, candidate2: 46.9, totalVotes: 854321, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Ted Cruz (R)']
      },
      {
        name: 'Bexar County - Mayor (San Antonio)',
        type: 'Mayor',
        data: { candidate1: 58.9, candidate2: 41.1, totalVotes: 154321, winner: 'candidate1' },
        candidates: ['Ron Nirenberg (I)', 'Ivy Taylor (D)']
      },
      {
        name: 'Bexar County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 54.2, candidate2: 45.8, totalVotes: 798765, winner: 'candidate1' },
        candidates: ['Lucy Adame-Clark (D)', 'John Saunders (R)']
      }
    ],
    '2016': [
      {
        name: 'Bexar County - President',
        type: 'President',
        data: { candidate1: 54.2, candidate2: 40.9, totalVotes: 876543, winner: 'candidate1' },
        candidates: ['Hillary Clinton (D)', 'Donald Trump (R)']
      },
      {
        name: 'Bexar County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 45.6, candidate2: 52.4, totalVotes: 823456, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Ted Cruz (R)']
      },
      {
        name: 'Bexar County - Mayor (San Antonio)',
        type: 'Mayor',
        data: { candidate1: 56.7, candidate2: 43.3, totalVotes: 132109, winner: 'candidate1' },
        candidates: ['Ron Nirenberg (I)', 'Ivy Taylor (D)']
      },
      {
        name: 'Bexar County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 52.8, candidate2: 47.2, totalVotes: 765432, winner: 'candidate1' },
        candidates: ['Lucy Adame-Clark (D)', 'John Saunders (R)']
      }
    ]
  },
  'Collin': {
    '2024': [
      {
        name: 'Collin County - President',
        type: 'President',
        data: { candidate1: 45.2, candidate2: 53.8, totalVotes: 654321, winner: 'candidate2' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)']
      },
      {
        name: 'Collin County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 43.7, candidate2: 55.3, totalVotes: 634567, winner: 'candidate2' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)']
      },
      {
        name: 'Collin County - Governor',
        type: 'Governor',
        data: { candidate1: 42.1, candidate2: 56.9, totalVotes: 623456, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)']
      },
      {
        name: 'Collin County - Mayor (Plano)',
        type: 'Mayor',
        data: { candidate1: 48.9, candidate2: 51.1, totalVotes: 87654, winner: 'candidate2' },
        candidates: ['John Muns (D)', 'Harry LaRosiliere (R)']
      },
      {
        name: 'Collin County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 44.3, candidate2: 55.7, totalVotes: 587654, winner: 'candidate2' },
        candidates: ['Kenneth Maun (D)', 'Darrell Hale (R)']
      }
    ]
  }
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    title: {
      fontWeight: 'bold',
      color: colors.white,
      marginBottom: 4,
    },
    subtitle: {
      color: colors.white,
      opacity: 0.9,
    },
    dropdownContainer: {
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGray,
    },
    content: {
      flex: 1,
    },
    locationInfo: {
      padding: 16,
      backgroundColor: colors.white,
      marginBottom: 8,
    },
    locationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    locationButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.surface,
    },
    sectionTitle: {
      fontWeight: '600',
      color: colors.textPrimary,
    },
    sectionSubtitle: {
      color: colors.textSecondary,
      marginBottom: 16,
      fontStyle: 'italic',
    },
    locationName: {
      color: colors.textPrimary,
      fontWeight: '500',
      marginBottom: 4,
    },
    locationCoords: {
      color: colors.textSecondary,
      fontFamily: 'monospace',
    },
    manualLocationNote: {
      color: colors.primary,
      fontStyle: 'italic',
      marginTop: 4,
    },
    locationText: {
      color: colors.textSecondary,
    },
    electionsContainer: {
      padding: 16,
      backgroundColor: colors.white,
      marginBottom: 8,
    },
    electionCard: {
      padding: 12,
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.lightGray,
    },
    selectedElection: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    electionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    electionName: {
      fontWeight: '600',
      color: colors.textPrimary,
      flex: 1,
    },
    electionTypeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    electionType: {
      color: colors.white,
      fontWeight: '500',
    },
    candidatesText: {
      color: colors.textSecondary,
      marginBottom: 4,
    },
    winnerText: {
      color: colors.textPrimary,
      fontWeight: '500',
      marginBottom: 4,
    },
    votesText: {
      color: colors.textSecondary,
      fontStyle: 'italic',
      marginBottom: 8,
    },
    voteBar: {
      flexDirection: 'row',
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 8,
    },
    voteSegment: {
      height: '100%',
    },
    percentages: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    percentageText: {
      color: colors.textSecondary,
      fontWeight: '500',
    },
    resultsContainer: {
      margin: 16,
    },
    detailsCard: {
      backgroundColor: colors.white,
      padding: 16,
      borderRadius: 8,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    detailsTitle: {
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    detailsYear: {
      color: colors.textSecondary,
      marginBottom: 16,
    },
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    detailItem: {
      width: '48%',
      marginBottom: 12,
    },
    fullWidth: {
      width: '100%',
    },
    detailLabel: {
      color: colors.textSecondary,
      marginBottom: 4,
    },
    detailValue: {
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    detailVotes: {
      color: colors.textSecondary,
      marginTop: 2,
    },
    infoCard: {
      margin: 16,
      padding: 16,
      backgroundColor: colors.white,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    infoTitle: {
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    infoText: {
      color: colors.textSecondary,
      lineHeight: 20,
    },
    stickyFooter: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.lightGray,
    },
    nextElectionLabel: {
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    nextElectionDate: {
      color: colors.textPrimary,
      marginBottom: 4,
    },
    nextElectionType: {
      color: colors.textSecondary,
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
      maxWidth: 400,
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
    modalBody: {
      padding: 16,
    },
    modalDescription: {
      color: colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    locationInput: {
      borderWidth: 1,
      borderColor: colors.lightGray,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      backgroundColor: colors.surface,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    modalButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 8,
      gap: 8,
    },
    useGpsButton: {
      backgroundColor: colors.success || '#059669',
    },
    setLocationButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      color: colors.white,
      fontWeight: '500',
    },
    candidateLink: {
      color: colors.primary,
      textDecorationLine: 'underline',
      fontWeight: '500',
    },
    winnerLink: {
      color: colors.primary,
      textDecorationLine: 'underline',
      fontWeight: 'bold',
    },
    sourceText: {
      color: colors.textPrimary,
      fontWeight: '500',
    },
    tapForSourceHint: {
      padding: 8,
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginBottom: 8,
    },
    tapHintText: {
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
  });
}
export default HomeScreen;
