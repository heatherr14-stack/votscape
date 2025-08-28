import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useAccessibility } from '../contexts/AccessibilityContext';
import WebMap from '../components/WebMap';
import ElectionDropdown from '../components/ElectionDropdown';

// Cross-platform map component
function CrossPlatformMap({ location, loading, selectedYear }) {
  const { getScaledFontSize } = useAccessibility();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, { fontSize: getScaledFontSize(16) }]}>
          Loading map and location data...
        </Text>
      </View>
    );
  }

  // Normalize location data for both web and mobile
  const normalizedLocation = Platform.OS === 'web' 
    ? { latitude: location?.lat, longitude: location?.lng }
    : { latitude: location?.latitude, longitude: location?.longitude };

  if (!normalizedLocation.latitude || !normalizedLocation.longitude) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={[styles.fallbackTitle, { fontSize: getScaledFontSize(18) }]}>
          📍 Location Error
        </Text>
        <Text style={[styles.fallbackText, { fontSize: getScaledFontSize(14) }]}>
          Unable to determine your location
        </Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    // Web: Use Leaflet map with election results
    return (
      <View style={styles.mapContainer}>
        <WebMap location={normalizedLocation} selectedYear={selectedYear} />
      </View>
    );
  } else {
    // Mobile: Use expo-maps
    try {
      const MapView = require('expo-maps').default;
      const Marker = require('expo-maps').Marker;
      
      return (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: normalizedLocation.latitude,
              longitude: normalizedLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: normalizedLocation.latitude,
                longitude: normalizedLocation.longitude,
              }}
              title="You are here"
              description="Your current location"
            />
          </MapView>
        </View>
      );
    } catch (error) {
      // Fallback if expo-maps is not available
      return (
        <View style={styles.fallbackContainer}>
          <Text style={[styles.fallbackTitle, { fontSize: getScaledFontSize(18) }]}>
            📍 Location Found
          </Text>
          <Text style={[styles.fallbackText, { fontSize: getScaledFontSize(14) }]}>
            Latitude: {normalizedLocation.latitude?.toFixed(6)}
          </Text>
          <Text style={[styles.fallbackText, { fontSize: getScaledFontSize(14) }]}>
            Longitude: {normalizedLocation.longitude?.toFixed(6)}
          </Text>
          <Text style={[styles.fallbackNote, { fontSize: getScaledFontSize(12) }]}>
            Install expo-maps for full map functionality
          </Text>
        </View>
      );
    }
  }
}

// County detection logic from HomeScreen
const detectCountyFromCoordinates = (latitude, longitude) => {
  const countyBounds = {
    // Texas Counties with approximate boundaries
    'Harris': { 
      minLat: 29.5, maxLat: 30.1, 
      minLng: -95.8, maxLng: -94.9 
    },
    'Dallas': { 
      minLat: 32.5, maxLat: 33.0, 
      minLng: -97.0, maxLng: -96.5 
    },
    'Bexar': { 
      minLat: 29.1, maxLat: 29.8, 
      minLng: -98.9, maxLng: -98.1 
    },
    'Travis': { 
      minLat: 30.0, maxLat: 30.6, 
      minLng: -98.1, maxLng: -97.4 
    },
    'Collin': { 
      minLat: 33.0, maxLat: 33.4, 
      minLng: -96.8, maxLng: -96.3 
    },
    'Tarrant': { 
      minLat: 32.6, maxLat: 33.0, 
      minLng: -97.5, maxLng: -97.0 
    },
    'Fort Bend': { 
      minLat: 29.4, maxLat: 29.8, 
      minLng: -96.1, maxLng: -95.6 
    },
    'Williamson': { 
      minLat: 30.4, maxLat: 30.8, 
      minLng: -97.9, maxLng: -97.4 
    },
    'Denton': { 
      minLat: 33.0, maxLat: 33.4, 
      minLng: -97.3, maxLng: -96.9 
    },
    'El Paso': { 
      minLat: 31.6, maxLat: 32.0, 
      minLng: -106.7, maxLng: -106.2 
    },
    // Delaware Counties
    'New Castle': { 
      minLat: 39.4, maxLat: 39.8, 
      minLng: -75.8, maxLng: -75.4 
    },
    'Kent': { 
      minLat: 39.0, maxLat: 39.4, 
      minLng: -75.6, maxLng: -75.2 
    },
    'Sussex': { 
      minLat: 38.4, maxLat: 39.0, 
      minLng: -75.8, maxLng: -75.0 
    },
    // Hawaii Counties
    'Honolulu': { 
      minLat: 21.2, maxLat: 21.7, 
      minLng: -158.3, maxLng: -157.6 
    },
    'Hawaii': { 
      minLat: 18.9, maxLat: 20.3, 
      minLng: -156.1, maxLng: -154.8 
    },
    'Maui': { 
      minLat: 20.5, maxLat: 21.0, 
      minLng: -156.7, maxLng: -155.9 
    },
    'Kauai': { 
      minLat: 21.8, maxLat: 22.3, 
      minLng: -159.8, maxLng: -159.3 
    },
    'Kalawao': { 
      minLat: 21.1, maxLat: 21.3, 
      minLng: -157.0, maxLng: -156.8 
    },
    // Rhode Island Counties
    'Providence': { 
      minLat: 41.7, maxLat: 42.0, 
      minLng: -71.7, maxLng: -71.3 
    },
    'Washington': { 
      minLat: 41.3, maxLat: 41.6, 
      minLng: -71.7, maxLng: -71.3 
    },
    'Bristol': { 
      minLat: 41.7, maxLat: 42.0, 
      minLng: -71.3, maxLng: -70.9 
    },
    'Newport': { 
      minLat: 41.3, maxLat: 41.6, 
      minLng: -71.3, maxLng: -70.9 
    }
  };

  // Check which county the coordinates fall into
  for (const [county, bounds] of Object.entries(countyBounds)) {
    if (latitude >= bounds.minLat && latitude <= bounds.maxLat &&
        longitude >= bounds.minLng && longitude <= bounds.maxLng) {
      return county;
    }
  }
  
  return null; // No county detected
};

// Get state for a detected county
const getStateForCounty = (county) => {
  const TEXAS_COUNTIES = ['Harris', 'Dallas', 'Bexar', 'Travis', 'Collin', 'Tarrant', 'Fort Bend', 'Williamson', 'Denton', 'El Paso'];
  const DELAWARE_COUNTIES = ['New Castle', 'Kent', 'Sussex'];
  const HAWAII_COUNTIES = ['Honolulu', 'Hawaii', 'Maui', 'Kauai', 'Kalawao'];
  const RHODE_ISLAND_COUNTIES = ['Providence', 'Washington', 'Bristol', 'Newport'];
  
  if (TEXAS_COUNTIES.includes(county)) return 'Texas';
  if (DELAWARE_COUNTIES.includes(county)) return 'Delaware';
  if (HAWAII_COUNTIES.includes(county)) return 'Hawaii';
  if (RHODE_ISLAND_COUNTIES.includes(county)) return 'Rhode Island';
  
  return 'Unknown';
};

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const { getScaledFontSize } = useAccessibility();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      if (Platform.OS === 'web') {
        // Web geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const county = detectCountyFromCoordinates(position.coords.latitude, position.coords.longitude);
              const state = county ? getStateForCounty(county) : null;
              const locationName = county && state ? `Current Location: ${state} - ${county}` : 'Unknown Location';
              setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              setLocationName(locationName);
              setLoading(false);
            },
            (err) => {
              console.error('Web geolocation error:', err);
              setError('Unable to access your location');
              // Fallback to default location (San Francisco)
              setLocation({ lat: 37.7749, lng: -122.4194 });
              setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
          );
        } else {
          setError('Geolocation not supported in your browser');
          setLocation({ lat: 37.7749, lng: -122.4194 });
          setLoading(false);
        }
      } else {
        // Mobile: Expo Location
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setError('Location permission denied');
          Alert.alert(
            'Permission Denied',
            'Location access is required to show your position on the map.',
            [{ text: 'OK' }]
          );
          // Fallback to default location
          setLocation({
            latitude: 37.7749,
            longitude: -122.4194,
          });
          setLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const county = detectCountyFromCoordinates(currentLocation.coords.latitude, currentLocation.coords.longitude);
        const state = county ? getStateForCounty(county) : null;
        const locationName = county && state ? `Current Location: ${state} - ${county}` : 'Unknown Location';
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        setLocationName(locationName);
        setLoading(false);
      }
    } catch (err) {
      console.error('Location error:', err);
      setError('Failed to get location');
      // Fallback to default location
      setLocation(Platform.OS === 'web' 
        ? { lat: 37.7749, lng: -122.4194 }
        : { latitude: 37.7749, longitude: -122.4194 }
      );
      setLoading(false);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontSize: getScaledFontSize(20) }]}>
          Votscape Map
        </Text>
        <Text style={[styles.headerSubtitle, { fontSize: getScaledFontSize(14) }]}>
          {locationName || 'Getting your location...'}
        </Text>
        <ElectionDropdown onYearChange={handleYearChange} />
      </View>

      {/* Map Content */}
      <View style={styles.mapContent}>
        <CrossPlatformMap location={location} loading={loading} selectedYear={selectedYear} />
      </View>

      {/* Status Info */}
      {error && (
        <View style={styles.statusContainer}>
          <Text style={[styles.errorText, { fontSize: getScaledFontSize(14) }]}>
            ⚠️ {error}
          </Text>
        </View>
      )}

      {!loading && location && !error && (
        <View style={styles.statusContainer}>
          <Text style={[styles.successText, { fontSize: getScaledFontSize(14) }]}>
            ✅ Location found successfully
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  mapContent: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    textAlign: 'center',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  fallbackTitle: {
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
  },
  fallbackText: {
    color: '#333',
    marginBottom: 8,
  },
  fallbackNote: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  statusContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  successText: {
    color: '#34C759',
    textAlign: 'center',
  },
});
