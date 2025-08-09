import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import { useAccessibility } from '../contexts/AccessibilityContext';
import { colors } from '../utils/colors';
import ElectionDropdown from '../components/ElectionDropdown';

const { width, height } = Dimensions.get('window');

// Conditional import for expo-maps to prevent app crashes
let MapView, Marker, Polygon;
let mapsAvailable = false;

try {
  const ExpoMaps = require('expo-maps');
  MapView = ExpoMaps.MapView;
  Marker = ExpoMaps.Marker;
  Polygon = ExpoMaps.Polygon;
  mapsAvailable = true;
  console.log('Expo Maps loaded successfully');
} catch (error) {
  console.log('Expo Maps not available:', error.message);
  mapsAvailable = false;
}

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [mapRegion, setMapRegion] = useState(null);
  const [electionRegions, setElectionRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getScaledFontSize, getAccessibleColors } = useAccessibility();
  const accessibleColors = getAccessibleColors();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      generateElectionRegions();
    }
  }, [location, selectedYear]);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location services to see election results in your area.',
          [{ text: 'OK' }]
        );
        // Default to Los Angeles
        const defaultLocation = { latitude: 34.0522, longitude: -118.2437 };
        setLocation(defaultLocation);
        setMapRegion({
          ...defaultLocation,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setLocationName('Los Angeles, CA (Default)');
        setIsLoading(false);
        return;
      }

      let locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
      });

      const coords = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      };

      setLocation(coords);
      setMapRegion({
        ...coords,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Get location name
      try {
        let reverseGeocode = await Location.reverseGeocodeAsync(coords);
        if (reverseGeocode && reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          const city = address.city || address.subAdministrativeArea || address.district;
          const state = address.region || address.administrativeArea;
          
          if (city && state) {
            setLocationName(`${city}, ${state}`);
          } else if (state) {
            setLocationName(state);
          } else {
            setLocationName('Current Location');
          }
        }
      } catch (geocodeError) {
        console.log('Geocoding error:', geocodeError);
        setLocationName('Current Location');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Location error:', error);
      // Fallback to Los Angeles
      const defaultLocation = { latitude: 34.0522, longitude: -118.2437 };
      setLocation(defaultLocation);
      setMapRegion({
        ...defaultLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLocationName('Los Angeles, CA (Default)');
      setIsLoading(false);
    }
  };

  const generateElectionRegions = () => {
    if (!location) return;

    // Generate mock election regions around the user's location
    const regions = [];
    const baseLatitude = location.latitude;
    const baseLongitude = location.longitude;

    // Create several regions around the user's location
    const regionData = [
      { name: 'District 1', winner: 'Democratic', margin: 15, offset: { lat: 0.01, lng: 0.01 } },
      { name: 'District 2', winner: 'Republican', margin: 8, offset: { lat: -0.01, lng: 0.01 } },
      { name: 'District 3', winner: 'Democratic', margin: 22, offset: { lat: 0.01, lng: -0.01 } },
      { name: 'District 4', winner: 'Republican', margin: 12, offset: { lat: -0.01, lng: -0.01 } },
      { name: 'District 5', winner: 'Democratic', margin: 6, offset: { lat: 0.02, lng: 0 } },
      { name: 'District 6', winner: 'Republican', margin: 18, offset: { lat: -0.02, lng: 0 } },
    ];

    regionData.forEach((region, index) => {
      const centerLat = baseLatitude + region.offset.lat;
      const centerLng = baseLongitude + region.offset.lng;
      
      // Create a polygon for each district
      const coordinates = [
        { latitude: centerLat + 0.005, longitude: centerLng + 0.005 },
        { latitude: centerLat + 0.005, longitude: centerLng - 0.005 },
        { latitude: centerLat - 0.005, longitude: centerLng - 0.005 },
        { latitude: centerLat - 0.005, longitude: centerLng + 0.005 },
      ];

      regions.push({
        id: index,
        name: region.name,
        coordinates,
        winner: region.winner,
        margin: region.margin,
        fillColor: region.winner === 'Democratic' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(239, 68, 68, 0.4)',
        strokeColor: region.winner === 'Democratic' ? '#3B82F6' : '#EF4444',
      });
    });

    setElectionRegions(regions);
  };

  const onRegionPress = (region) => {
    Alert.alert(
      region.name,
      `${selectedYear} Election Results\nWinner: ${region.winner}\nMargin: +${region.margin}%`,
      [{ text: 'OK' }]
    );
  };

  // Enhanced fallback component for when maps aren't available
  const MapFallback = () => (
    <View style={styles.fallbackContainer}>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.mapTitle, { fontSize: getScaledFontSize(18) }]}>
          Interactive Election Map
        </Text>
        <Text style={[styles.mapSubtitle, { fontSize: getScaledFontSize(14) }]}>
          Map loading...
        </Text>
        
        <View style={styles.locationDisplay}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={[styles.locationDisplayText, { fontSize: getScaledFontSize(14) }]}>
            {locationName}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.regionsContainer}>
        <Text style={[styles.regionsTitle, { fontSize: getScaledFontSize(16) }]}>
          Election Results in Your Area ({selectedYear})
        </Text>
        
        {electionRegions.map((region) => (
          <TouchableOpacity
            key={region.id}
            style={[
              styles.regionCard,
              { borderLeftColor: region.strokeColor }
            ]}
            onPress={() => onRegionPress(region)}
          >
            <View style={styles.regionHeader}>
              <Text style={[styles.regionName, { fontSize: getScaledFontSize(16) }]}>
                {region.name}
              </Text>
              <View style={[
                styles.winnerBadge,
                { backgroundColor: region.winner === 'Democratic' ? '#3B82F6' : '#EF4444' }
              ]}>
                <Text style={[styles.winnerText, { fontSize: getScaledFontSize(12) }]}>
                  {region.winner}
                </Text>
              </View>
            </View>
            <Text style={[styles.marginText, { fontSize: getScaledFontSize(14) }]}>
              Margin: +{region.margin}%
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={[styles.loadingText, { fontSize: getScaledFontSize(16) }]}>
          Loading map and election data...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Controls */}
      <View style={styles.topControls}>
        <View style={styles.locationInfo}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={[styles.locationText, { fontSize: getScaledFontSize(14) }]}>
            {locationName}
          </Text>
        </View>
        
        <View style={styles.dropdownContainer}>
          <ElectionDropdown
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            compact={true}
          />
        </View>
      </View>

      {/* Conditional rendering: Use map if available, fallback otherwise */}
      {mapsAvailable ? (
        mapRegion ? (
          <>
            {/* Interactive Map */}
            <MapView
              style={styles.map}
              initialRegion={mapRegion}
              showsUserLocation={true}
              showsMyLocationButton={true}
              showsCompass={true}
              zoomEnabled={true}
              scrollEnabled={true}
              pitchEnabled={true}
              rotateEnabled={true}
            >
              {/* User Location Marker */}
              {location && (
                <Marker
                  coordinate={location}
                  title="Your Location"
                  description={locationName}
                />
              )}

              {/* Election Result Regions */}
              {electionRegions.map((region) => (
                <Polygon
                  key={region.id}
                  coordinates={region.coordinates}
                  fillColor={region.fillColor}
                  strokeColor={region.strokeColor}
                  strokeWidth={2}
                  onPress={() => onRegionPress(region)}
                />
              ))}
            </MapView>

            {/* Legend */}
            <View style={styles.legend}>
              <Text style={[styles.legendTitle, { fontSize: getScaledFontSize(14) }]}>
                Election Results ({selectedYear})
              </Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#3B82F6' }]} />
                  <Text style={[styles.legendText, { fontSize: getScaledFontSize(12) }]}>
                    Democratic
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
                  <Text style={[styles.legendText, { fontSize: getScaledFontSize(12) }]}>
                    Republican
                  </Text>
                </View>
              </View>
              <Text style={[styles.legendNote, { fontSize: getScaledFontSize(10) }]}>
                Tap regions for detailed results
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { fontSize: getScaledFontSize(16) }]}>
              Loading map and location data...
            </Text>
          </View>
        )
      ) : (
        <MapFallback />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textPrimary,
    textAlign: 'center',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: 8,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  dropdownContainer: {
    marginLeft: 16,
  },
  map: {
    flex: 1,
    width: width,
    height: height - 200,
  },
  legend: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendTitle: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    color: colors.textPrimary,
  },
  legendNote: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  mapPlaceholder: {
    width: width - 32,
    height: height / 2,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapTitle: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  mapSubtitle: {
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  locationDisplayText: {
    marginLeft: 8,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  regionsContainer: {
    flex: 1,
    width: width - 32,
  },
  regionsTitle: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  regionCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  regionName: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  winnerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  winnerText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  marginText: {
    color: colors.textSecondary,
  },
});
