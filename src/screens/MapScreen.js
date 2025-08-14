import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useAccessibility } from '../contexts/AccessibilityContext';

// Cross-platform map component
function CrossPlatformMap({ location, loading }) {
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

  if (Platform.OS === 'web') {
    // Web fallback - simple location display
    return (
      <View style={styles.webMapContainer}>
        <View style={styles.webMapPlaceholder}>
          <Text style={[styles.webMapText, { fontSize: getScaledFontSize(18) }]}>
            📍 Interactive Map
          </Text>
          <Text style={[styles.webMapSubtext, { fontSize: getScaledFontSize(14) }]}>
            Your Location: {location?.lat?.toFixed(4)}, {location?.lng?.toFixed(4)}
          </Text>
          <Text style={[styles.webMapNote, { fontSize: getScaledFontSize(12) }]}>
            Full map functionality available on mobile app
          </Text>
        </View>
      </View>
    );
  } else {
    // Mobile: Use expo-maps if available
    try {
      const MapView = require('expo-maps').default;
      const Marker = require('expo-maps').Marker;
      
      return (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
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
            Latitude: {location.latitude?.toFixed(6)}
          </Text>
          <Text style={[styles.fallbackText, { fontSize: getScaledFontSize(14) }]}>
            Longitude: {location.longitude?.toFixed(6)}
          </Text>
          <Text style={[styles.fallbackNote, { fontSize: getScaledFontSize(12) }]}>
            Install expo-maps for full map functionality
          </Text>
        </View>
      );
    }
  }
}

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
              setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
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

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontSize: getScaledFontSize(20) }]}>
          Votscape Map
        </Text>
        <Text style={[styles.headerSubtitle, { fontSize: getScaledFontSize(14) }]}>
          Your location and future election results
        </Text>
      </View>

      {/* Map Content */}
      <View style={styles.mapContent}>
        <CrossPlatformMap location={location} loading={loading} />
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
  webMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f4f8',
  },
  webMapPlaceholder: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  webMapText: {
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  webMapSubtext: {
    color: '#333',
    marginBottom: 8,
  },
  webMapNote: {
    color: '#666',
    fontStyle: 'italic',
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
