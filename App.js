import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { AccessibilityProvider } from './src/contexts/AccessibilityContext';
import { colors } from './src/utils/colors';
import HomeScreen from './src/screens/HomeScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StateDetailsScreen from './src/screens/StateDetailsScreen';
import MapScreen from './src/screens/MapScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AccessibilityProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Votscape') {
                iconName = focused ? 'map' : 'map-outline';
              } else if (route.name === 'Results') {
                iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              } else if (route.name === 'Resources') {
                iconName = focused ? 'library' : 'library-outline';
              } else if (route.name === 'State Details') {
                iconName = focused ? 'flag' : 'flag-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Votscape" 
            component={MapScreen}
            options={{ 
              title: 'Votscape',
              headerShown: false
            }}
          />
          <Tab.Screen 
            name="Results" 
            component={HomeScreen}
            options={{ 
              title: 'Election Results',
              headerShown: false
            }}
          />
          <Tab.Screen 
            name="State Details" 
            component={StateDetailsScreen}
            options={{ title: 'State Officials' }}
          />
          <Tab.Screen 
            name="Resources" 
            component={ResourcesScreen}
            options={{ title: 'Resources' }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Accessibility Settings' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AccessibilityProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
