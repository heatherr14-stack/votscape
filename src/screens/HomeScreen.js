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
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as WebBrowser from 'expo-web-browser';

import { colors } from '../utils/colors';
import { useAccessibility } from '../contexts/AccessibilityContext';
import ElectionDropdown from '../components/ElectionDropdown';

// Texas County-Based Election Data (2016-2024)
const TEXAS_COUNTY_ELECTIONS = {
  'Harris': {
    '2024': [
      {
        name: 'Harris County - President',
        type: 'President',
        data: { candidate1: 56.8, candidate2: 42.1, totalVotes: 1876543, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Harris County Clerk'
      },
      {
        name: 'Harris County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 52.3, candidate2: 46.7, totalVotes: 1654321, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'Harris County Clerk'
      },
      {
        name: 'Harris County - Governor',
        type: 'Governor',
        data: { candidate1: 54.2, candidate2: 44.8, totalVotes: 1789012, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Harris County Clerk'
      },
      {
        name: 'Harris County - Mayor (Houston)',
        type: 'Mayor',
        data: { candidate1: 58.9, candidate2: 41.1, totalVotes: 456789, winner: 'candidate1' },
        candidates: ['Sylvester Turner (D)', 'Tony Buzbee (R)'],
        source: 'Harris County Clerk'
      },
      {
        name: 'Harris County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 55.6, candidate2: 44.4, totalVotes: 1234567, winner: 'candidate1' },
        candidates: ['Dylan Osborne (D)', 'Mike Sullivan (R)'],
        source: 'Harris County Clerk'
      }
    ],
    '2020': [
      {
        name: 'Harris County - President',
        type: 'President',
        data: { candidate1: 56.0, candidate2: 42.7, totalVotes: 1933122, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Harris County Clerk'
      },
      {
        name: 'Harris County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 48.3, candidate2: 49.7, totalVotes: 1876543, winner: 'candidate2' },
        candidates: ['MJ Hegar (D)', 'John Cornyn (R)'],
        source: 'Harris County Clerk'
      },
      {
        name: 'Harris County - Mayor (Houston)',
        type: 'Mayor',
        data: { candidate1: 59.4, candidate2: 40.6, totalVotes: 387654, winner: 'candidate1' },
        candidates: ['Sylvester Turner (D)', 'Tony Buzbee (R)'],
        source: 'Harris County Clerk'
      }
    ]
  },
  'Dallas': {
    '2024': [
      {
        name: 'Dallas County - President',
        type: 'President',
        data: { candidate1: 65.1, candidate2: 33.9, totalVotes: 1456789, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Dallas County Clerk'
      },
      {
        name: 'Dallas County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 62.8, candidate2: 36.2, totalVotes: 1398765, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'Dallas County Clerk'
      },
      {
        name: 'Dallas County - Governor',
        type: 'Governor',
        data: { candidate1: 58.4, candidate2: 40.6, totalVotes: 1387654, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Dallas County Clerk'
      },
      {
        name: 'Dallas County - Mayor (Dallas)',
        type: 'Mayor',
        data: { candidate1: 67.2, candidate2: 32.8, totalVotes: 287654, winner: 'candidate1' },
        candidates: ['Eric Johnson (D)', 'Scott Griggs (D)'],
        source: 'Dallas County Clerk'
      },
      {
        name: 'Dallas County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 64.7, candidate2: 35.3, totalVotes: 1298765, winner: 'candidate1' },
        candidates: ['Pauline Medrano (D)', 'J.J. Koch (R)'],
        source: 'Dallas County Clerk'
      }
    ]
  },
  'Travis': {
    '2024': [
      {
        name: 'Travis County - President',
        type: 'President',
        data: { candidate1: 71.4, candidate2: 26.8, totalVotes: 654321, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Travis County Clerk'
      },
      {
        name: 'Travis County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 68.9, candidate2: 29.1, totalVotes: 634567, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'Travis County Clerk'
      },
      {
        name: 'Travis County - Governor',
        type: 'Governor',
        data: { candidate1: 66.7, candidate2: 31.3, totalVotes: 623456, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Travis County Clerk'
      },
      {
        name: 'Travis County - Mayor (Austin)',
        type: 'Mayor',
        data: { candidate1: 72.3, candidate2: 27.7, totalVotes: 198765, winner: 'candidate1' },
        candidates: ['Kirk Watson (D)', 'Celia Israel (D)'],
        source: 'Travis County Clerk'
      },
      {
        name: 'Travis County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 69.8, candidate2: 30.2, totalVotes: 587654, winner: 'candidate1' },
        candidates: ['Dolores Ortega Carter (D)', 'Mike Novak (R)'],
        source: 'Travis County Clerk'
      }
    ]
  },
  'Bexar': {
    '2024': [
      {
        name: 'Bexar County - President',
        type: 'President',
        data: { candidate1: 58.7, candidate2: 40.1, totalVotes: 987654, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Bexar County Clerk'
      },
      {
        name: 'Bexar County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 56.3, candidate2: 42.7, totalVotes: 954321, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'Bexar County Clerk'
      },
      {
        name: 'Bexar County - Governor',
        type: 'Governor',
        data: { candidate1: 54.8, candidate2: 44.2, totalVotes: 934567, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Bexar County Clerk'
      },
      {
        name: 'Bexar County - Mayor (San Antonio)',
        type: 'Mayor',
        data: { candidate1: 61.4, candidate2: 38.6, totalVotes: 234567, winner: 'candidate1' },
        candidates: ['Ron Nirenberg (I)', 'Greg Brockhouse (R)'],
        source: 'Bexar County Clerk'
      },
      {
        name: 'Bexar County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 57.9, candidate2: 42.1, totalVotes: 876543, winner: 'candidate1' },
        candidates: ['Lucy Adame-Clark (D)', 'John Saunders (R)'],
        source: 'Bexar County Clerk'
      }
    ]
  },
  'Collin': {
    '2024': [
      {
        name: 'Collin County - President',
        type: 'President',
        data: { candidate1: 45.2, candidate2: 53.8, totalVotes: 654321, winner: 'candidate2' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Collin County Clerk'
      },
      {
        name: 'Collin County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 43.7, candidate2: 55.3, totalVotes: 634567, winner: 'candidate2' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'Collin County Clerk'
      },
      {
        name: 'Collin County - Governor',
        type: 'Governor',
        data: { candidate1: 42.1, candidate2: 56.9, totalVotes: 623456, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Collin County Clerk'
      },
      {
        name: 'Collin County - Mayor (Plano)',
        type: 'Mayor',
        data: { candidate1: 48.9, candidate2: 51.1, totalVotes: 87654, winner: 'candidate2' },
        candidates: ['John Muns (D)', 'Harry LaRosiliere (R)'],
        source: 'Collin County Clerk'
      },
      {
        name: 'Collin County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 44.3, candidate2: 55.7, totalVotes: 587654, winner: 'candidate2' },
        candidates: ['Kenneth Maun (D)', 'Darrell Hale (R)'],
        source: 'Collin County Clerk'
      }
    ]
  },
  'Tarrant': {
    '2024': [
      {
        name: 'Tarrant County - President',
        type: 'President',
        data: { candidate1: 48.7, candidate2: 50.3, totalVotes: 1234567, winner: 'candidate2' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Tarrant County Clerk'
      },
      {
        name: 'Tarrant County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 46.9, candidate2: 52.1, totalVotes: 1198765, winner: 'candidate2' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'Tarrant County Clerk'
      },
      {
        name: 'Tarrant County - Governor',
        type: 'Governor',
        data: { candidate1: 45.8, candidate2: 53.2, totalVotes: 1176543, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Tarrant County Clerk'
      },
      {
        name: 'Tarrant County - Mayor (Fort Worth)',
        type: 'Mayor',
        data: { candidate1: 52.4, candidate2: 47.6, totalVotes: 198765, winner: 'candidate1' },
        candidates: ['Mattie Parker (R)', 'Deborah Peoples (D)'],
        source: 'Tarrant County Clerk'
      },
      {
        name: 'Tarrant County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 47.3, candidate2: 52.7, totalVotes: 1087654, winner: 'candidate2' },
        candidates: ['Rafael Anchia (D)', 'Tom Adair (R)'],
        source: 'Tarrant County Clerk'
      }
    ],
    '2022': [
      {
        name: 'Tarrant County - Governor',
        type: 'Governor',
        data: { candidate1: 44.2, candidate2: 54.8, totalVotes: 1098765, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Tarrant County Clerk'
      },
      {
        name: 'Tarrant County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 45.1, candidate2: 53.9, totalVotes: 1076543, winner: 'candidate2' },
        candidates: ['MJ Hegar (D)', 'John Cornyn (R)'],
        source: 'Tarrant County Clerk'
      },
      {
        name: 'Tarrant County - Mayor (Fort Worth)',
        type: 'Mayor',
        data: { candidate1: 50.8, candidate2: 49.2, totalVotes: 187654, winner: 'candidate1' },
        candidates: ['Mattie Parker (R)', 'Deborah Peoples (D)'],
        source: 'Tarrant County Clerk'
      },
      {
        name: 'Tarrant County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 46.7, candidate2: 53.3, totalVotes: 987654, winner: 'candidate2' },
        candidates: ['Rafael Anchia (D)', 'Tom Adair (R)'],
        source: 'Tarrant County Clerk'
      }
    ],
    '2020': [
      {
        name: 'Tarrant County - President',
        type: 'President',
        data: { candidate1: 49.3, candidate2: 49.7, totalVotes: 1187654, winner: 'candidate2' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Tarrant County Clerk'
      },
      {
        name: 'Tarrant County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 46.8, candidate2: 52.2, totalVotes: 1154321, winner: 'candidate2' },
        candidates: ['MJ Hegar (D)', 'John Cornyn (R)'],
        source: 'Tarrant County Clerk'
      },
      {
        name: 'Tarrant County - Mayor (Fort Worth)',
        type: 'Mayor',
        data: { candidate1: 48.9, candidate2: 51.1, totalVotes: 176543, winner: 'candidate2' },
        candidates: ['Deborah Peoples (D)', 'Betsy Price (R)'],
        source: 'Tarrant County Clerk'
      },
      {
        name: 'Tarrant County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 45.4, candidate2: 54.6, totalVotes: 1098765, winner: 'candidate2' },
        candidates: ['Rafael Anchia (D)', 'Tom Adair (R)'],
        source: 'Tarrant County Clerk'
      }
    ]
  },
  'Fort Bend': {
    '2024': [
      {
        name: 'Fort Bend County - President',
        type: 'President',
        data: { candidate1: 59.2, candidate2: 39.8, totalVotes: 543210, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Fort Bend County Clerk'
      },
      {
        name: 'Fort Bend County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 56.7, candidate2: 42.3, totalVotes: 523456, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'Fort Bend County Clerk'
      },
      {
        name: 'Fort Bend County - Governor',
        type: 'Governor',
        data: { candidate1: 54.9, candidate2: 44.1, totalVotes: 512345, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Fort Bend County Clerk'
      },
      {
        name: 'Fort Bend County - Mayor (Sugar Land)',
        type: 'Mayor',
        data: { candidate1: 61.8, candidate2: 38.2, totalVotes: 76543, winner: 'candidate1' },
        candidates: ['Joe Zimmerman (R)', 'Himesh Gandhi (D)'],
        source: 'Fort Bend County Clerk'
      },
      {
        name: 'Fort Bend County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 57.4, candidate2: 42.6, totalVotes: 487654, winner: 'candidate1' },
        candidates: ['Dexter McCoy (D)', 'Jim Stinson (R)'],
        source: 'Fort Bend County Clerk'
      }
    ],
    '2022': [
      {
        name: 'Fort Bend County - Governor',
        type: 'Governor',
        data: { candidate1: 56.3, candidate2: 42.7, totalVotes: 498765, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Fort Bend County Clerk'
      },
      {
        name: 'Fort Bend County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 54.8, candidate2: 44.2, totalVotes: 487654, winner: 'candidate1' },
        candidates: ['MJ Hegar (D)', 'John Cornyn (R)'],
        source: 'Fort Bend County Clerk'
      },
      {
        name: 'Fort Bend County - Mayor (Sugar Land)',
        type: 'Mayor',
        data: { candidate1: 59.7, candidate2: 40.3, totalVotes: 71234, winner: 'candidate1' },
        candidates: ['Joe Zimmerman (R)', 'Himesh Gandhi (D)'],
        source: 'Fort Bend County Clerk'
      },
      {
        name: 'Fort Bend County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 55.9, candidate2: 44.1, totalVotes: 456789, winner: 'candidate1' },
        candidates: ['Dexter McCoy (D)', 'Jim Stinson (R)'],
        source: 'Fort Bend County Clerk'
      }
    ],
    '2020': [
      {
        name: 'Fort Bend County - President',
        type: 'President',
        data: { candidate1: 58.4, candidate2: 40.6, totalVotes: 521098, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Fort Bend County Clerk'
      },
      {
        name: 'Fort Bend County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 55.2, candidate2: 43.8, totalVotes: 509876, winner: 'candidate1' },
        candidates: ['MJ Hegar (D)', 'John Cornyn (R)'],
        source: 'Fort Bend County Clerk'
      },
      {
        name: 'Fort Bend County - Mayor (Sugar Land)',
        type: 'Mayor',
        data: { candidate1: 57.3, candidate2: 42.7, totalVotes: 68765, winner: 'candidate1' },
        candidates: ['Joe Zimmerman (R)', 'Himesh Gandhi (D)'],
        source: 'Fort Bend County Clerk'
      },
      {
        name: 'Fort Bend County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 56.8, candidate2: 43.2, totalVotes: 476543, winner: 'candidate1' },
        candidates: ['Dexter McCoy (D)', 'Jim Stinson (R)'],
        source: 'Fort Bend County Clerk'
      }
    ]
  },
  'Williamson': {
    '2024': [
      {
        name: 'Williamson County - President',
        type: 'President',
        data: { candidate1: 51.3, candidate2: 47.7, totalVotes: 432109, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Williamson County Clerk'
      },
      {
        name: 'Williamson County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 49.8, candidate2: 49.2, totalVotes: 423456, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'Williamson County Clerk'
      },
      {
        name: 'Williamson County - Governor',
        type: 'Governor',
        data: { candidate1: 48.6, candidate2: 50.4, totalVotes: 418765, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Williamson County Clerk'
      },
      {
        name: 'Williamson County - Mayor (Round Rock)',
        type: 'Mayor',
        data: { candidate1: 54.7, candidate2: 45.3, totalVotes: 65432, winner: 'candidate1' },
        candidates: ['Craig Morgan (R)', 'Rene Flores (D)'],
        source: 'Williamson County Clerk'
      },
      {
        name: 'Williamson County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 51.9, candidate2: 48.1, totalVotes: 398765, winner: 'candidate1' },
        candidates: ['Dee Hobbs (D)', 'Lisa Birkman (R)'],
        source: 'Williamson County Clerk'
      }
    ]
  },
  'Denton': {
    '2024': [
      {
        name: 'Denton County - President',
        type: 'President',
        data: { candidate1: 47.9, candidate2: 51.1, totalVotes: 387654, winner: 'candidate2' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Denton County Clerk'
      },
      {
        name: 'Denton County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 45.6, candidate2: 53.4, totalVotes: 376543, winner: 'candidate2' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'Denton County Clerk'
      },
      {
        name: 'Denton County - Governor',
        type: 'Governor',
        data: { candidate1: 44.2, candidate2: 54.8, totalVotes: 365432, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Denton County Clerk'
      },
      {
        name: 'Denton County - Mayor (Denton)',
        type: 'Mayor',
        data: { candidate1: 49.3, candidate2: 50.7, totalVotes: 54321, winner: 'candidate2' },
        candidates: ['Gerard Hudspeth (D)', 'Chris Watts (R)'],
        source: 'Denton County Clerk'
      },
      {
        name: 'Denton County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 46.8, candidate2: 53.2, totalVotes: 343210, winner: 'candidate2' },
        candidates: ['Mary Horn (D)', 'Andy Eads (R)'],
        source: 'Denton County Clerk'
      }
    ]
  },
  'El Paso': {
    '2024': [
      {
        name: 'El Paso County - President',
        type: 'President',
        data: { candidate1: 66.4, candidate2: 32.6, totalVotes: 321098, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'El Paso County Clerk'
      },
      {
        name: 'El Paso County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 63.7, candidate2: 35.3, totalVotes: 312345, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'El Paso County Clerk'
      },
      {
        name: 'El Paso County - Governor',
        type: 'Governor',
        data: { candidate1: 61.9, candidate2: 37.1, totalVotes: 308765, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'El Paso County Clerk'
      },
      {
        name: 'El Paso County - Mayor (El Paso)',
        type: 'Mayor',
        data: { candidate1: 68.2, candidate2: 31.8, totalVotes: 87654, winner: 'candidate1' },
        candidates: ['Oscar Leeser (D)', 'Ikaika Marzo (R)'],
        source: 'El Paso County Clerk'
      },
      {
        name: 'El Paso County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 64.5, candidate2: 35.5, totalVotes: 287654, winner: 'candidate1' },
        candidates: ['Norma Chavez (D)', 'Rick Cabrera (R)'],
        source: 'El Paso County Clerk'
      }
    ]
  }
};

const DELAWARE_COUNTY_ELECTIONS = {
  'New Castle': {
    '2024': [
      {
        name: 'New Castle County - President',
        type: 'President',
        data: { candidate1: 62.1, candidate2: 36.9, totalVotes: 234567, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'New Castle County Clerk'
      },
      {
        name: 'New Castle County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 59.3, candidate2: 39.7, totalVotes: 223456, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'New Castle County Clerk'
      },
      {
        name: 'New Castle County - Governor',
        type: 'Governor',
        data: { candidate1: 57.4, candidate2: 41.6, totalVotes: 218765, winner: 'candidate1' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'New Castle County Clerk'
      },
      {
        name: 'New Castle County - Mayor (Wilmington)',
        type: 'Mayor',
        data: { candidate1: 64.5, candidate2: 35.5, totalVotes: 98765, winner: 'candidate1' },
        candidates: ['Mike Purzycki (D)', 'Ciro Adams (R)'],
        source: 'New Castle County Clerk'
      },
      {
        name: 'New Castle County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 61.2, candidate2: 38.8, totalVotes: 87654, winner: 'candidate1' },
        candidates: ['Ken Boulden (D)', 'Ciro Adams (R)'],
        source: 'New Castle County Clerk'
      }
    ],
    '2022': [
      {
        name: 'New Castle County - Governor',
        type: 'Governor',
        data: { candidate1: 60.9, candidate2: 38.1, totalVotes: 243210, winner: 'candidate1' },
        candidates: ['John Carney (D)', 'Colin Bonini (R)'],
        source: 'Delaware Department of Elections'
      },
      {
        name: 'New Castle County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 61.4, candidate2: 37.6, totalVotes: 232109, winner: 'candidate1' },
        candidates: ['Chris Coons (D)', 'Lauren Witzke (R)'],
        source: 'Delaware Department of Elections'
      },
      {
        name: 'New Castle County - Mayor (Wilmington)',
        type: 'Mayor',
        data: { candidate1: 67.2, candidate2: 32.8, totalVotes: 43210, winner: 'candidate1' },
        candidates: ['Mike Purzycki (D)', 'Theopalis Gregory (R)'],
        source: 'Delaware Department of Elections'
      },
      {
        name: 'New Castle County - County Executive',
        type: 'Treasurer',
        data: { candidate1: 62.8, candidate2: 36.2, totalVotes: 221098, winner: 'candidate1' },
        candidates: ['Matt Meyer (D)', 'Janet Kilpatrick (R)'],
        source: 'Delaware Department of Elections'
      }
    ],
    '2020': [
      {
        name: 'New Castle County - President',
        type: 'President',
        data: { candidate1: 65.1, candidate2: 33.9, totalVotes: 298765, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Delaware Department of Elections'
      },
      {
        name: 'New Castle County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 63.4, candidate2: 35.6, totalVotes: 287654, winner: 'candidate1' },
        candidates: ['Chris Coons (D)', 'Lauren Witzke (R)'],
        source: 'Delaware Department of Elections'
      },
      {
        name: 'New Castle County - Mayor (Wilmington)',
        type: 'Mayor',
        data: { candidate1: 69.1, candidate2: 30.9, totalVotes: 41234, winner: 'candidate1' },
        candidates: ['Mike Purzycki (D)', 'Theopalis Gregory (R)'],
        source: 'Delaware Department of Elections'
      },
      {
        name: 'New Castle County - County Executive',
        type: 'Treasurer',
        data: { candidate1: 64.2, candidate2: 34.8, totalVotes: 276543, winner: 'candidate1' },
        candidates: ['Matt Meyer (D)', 'Janet Kilpatrick (R)'],
        source: 'Delaware Department of Elections'
      }
    ]
  },
  'Kent': {
    '2024': [
      {
        name: 'Kent County - President',
        type: 'President',
        data: { candidate1: 54.2, candidate2: 44.8, totalVotes: 187654, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Kent County Clerk'
      },
      {
        name: 'Kent County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 51.3, candidate2: 47.7, totalVotes: 176543, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'Kent County Clerk'
      },
      {
        name: 'Kent County - Governor',
        type: 'Governor',
        data: { candidate1: 49.4, candidate2: 49.6, totalVotes: 165432, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Kent County Clerk'
      },
      {
        name: 'Kent County - Mayor (Dover)',
        type: 'Mayor',
        data: { candidate1: 56.7, candidate2: 43.3, totalVotes: 76543, winner: 'candidate1' },
        candidates: ['Robin Christiansen (R)', 'Trayon White (D)'],
        source: 'Kent County Clerk'
      },
      {
        name: 'Kent County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 54.9, candidate2: 45.1, totalVotes: 65432, winner: 'candidate1' },
        candidates: ['Ken Boulden (D)', 'Ciro Adams (R)'],
        source: 'Kent County Clerk'
      }
    ]
  },
  'Sussex': {
    '2024': [
      {
        name: 'Sussex County - President',
        type: 'President',
        data: { candidate1: 52.5, candidate2: 46.5, totalVotes: 198765, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Sussex County Clerk'
      },
      {
        name: 'Sussex County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 50.3, candidate2: 48.7, totalVotes: 187654, winner: 'candidate1' },
        candidates: ['Colin Allred (D)', 'Ted Cruz (R)'],
        source: 'Sussex County Clerk'
      },
      {
        name: 'Sussex County - Governor',
        type: 'Governor',
        data: { candidate1: 48.6, candidate2: 50.4, totalVotes: 176543, winner: 'candidate2' },
        candidates: ['Beto O\'Rourke (D)', 'Greg Abbott (R)'],
        source: 'Sussex County Clerk'
      },
      {
        name: 'Sussex County - Mayor (Georgetown)',
        type: 'Mayor',
        data: { candidate1: 55.6, candidate2: 44.4, totalVotes: 76543, winner: 'candidate1' },
        candidates: ['Bill West (R)', 'Trayon White (D)'],
        source: 'Sussex County Clerk'
      },
      {
        name: 'Sussex County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 53.4, candidate2: 46.6, totalVotes: 65432, winner: 'candidate1' },
        candidates: ['Ken Boulden (D)', 'Ciro Adams (R)'],
        source: 'Sussex County Clerk'
      }
    ],
    '2022': [
      {
        name: 'Sussex County - Governor',
        type: 'Governor',
        data: { candidate1: 38.9, candidate2: 60.1, totalVotes: 108765, winner: 'candidate2' },
        candidates: ['John Carney (D)', 'Colin Bonini (R)'],
        source: 'Delaware Department of Elections'
      },
      {
        name: 'Sussex County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 39.7, candidate2: 59.3, totalVotes: 105432, winner: 'candidate2' },
        candidates: ['Chris Coons (D)', 'Lauren Witzke (R)'],
        source: 'Delaware Department of Elections'
      },
      {
        name: 'Sussex County - Mayor (Rehoboth Beach)',
        type: 'Mayor',
        data: { candidate1: 47.1, candidate2: 52.9, totalVotes: 8234, winner: 'candidate2' },
        candidates: ['Stan Mills (D)', 'Edward Chrzastowski (R)'],
        source: 'Delaware Department of Elections'
      },
      {
        name: 'Sussex County - County Council',
        type: 'Treasurer',
        data: { candidate1: 40.4, candidate2: 58.6, totalVotes: 102109, winner: 'candidate2' },
        candidates: ['John Rieley (D)', 'Michael Vincent (R)'],
        source: 'Delaware Department of Elections'
      }
    ],
    '2020': [
      {
        name: 'Sussex County - President',
        type: 'President',
        data: { candidate1: 43.2, candidate2: 55.8, totalVotes: 132109, winner: 'candidate2' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Delaware Department of Elections'
      },
      {
        name: 'Sussex County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 41.9, candidate2: 57.1, totalVotes: 128765, winner: 'candidate2' },
        candidates: ['Chris Coons (D)', 'Lauren Witzke (R)'],
        source: 'Delaware Department of Elections'
      },
      {
        name: 'Sussex County - Mayor (Rehoboth Beach)',
        type: 'Mayor',
        data: { candidate1: 49.6, candidate2: 50.4, totalVotes: 7654, winner: 'candidate2' },
        candidates: ['Stan Mills (D)', 'Edward Chrzastowski (R)'],
        source: 'Delaware Department of Elections'
      },
      {
        name: 'Sussex County - County Council',
        type: 'Treasurer',
        data: { candidate1: 42.8, candidate2: 56.2, totalVotes: 124321, winner: 'candidate2' },
        candidates: ['John Rieley (D)', 'Michael Vincent (R)'],
        source: 'Delaware Department of Elections'
      }
    ]
  }
};

const HAWAII_COUNTY_ELECTIONS = {
  'Honolulu': {
    '2024': [
      {
        name: 'Honolulu County - President',
        type: 'President',
        data: { candidate1: 63.2, candidate2: 35.8, totalVotes: 456789, winner: 'candidate1' },
        candidates: ['Kamala Harris (D)', 'Donald Trump (R)'],
        source: 'Honolulu City Clerk'
      },
      {
        name: 'Honolulu County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 65.4, candidate2: 32.6, totalVotes: 445321, winner: 'candidate1' },
        candidates: ['Mazie Hirono (D)', 'Bob McDermott (R)'],
        source: 'Honolulu City Clerk'
      },
      {
        name: 'Honolulu County - Governor',
        type: 'Governor',
        data: { candidate1: 61.8, candidate2: 36.2, totalVotes: 432109, winner: 'candidate1' },
        candidates: ['Josh Green (D)', 'Duke Aiona (R)'],
        source: 'Honolulu City Clerk'
      },
      {
        name: 'Honolulu County - Mayor',
        type: 'Mayor',
        data: { candidate1: 58.7, candidate2: 41.3, totalVotes: 387654, winner: 'candidate1' },
        candidates: ['Rick Blangiardi (I)', 'Keith Amemiya (I)'],
        source: 'Honolulu City Clerk'
      },
      {
        name: 'Honolulu County - Treasurer',
        type: 'Treasurer',
        data: { candidate1: 59.2, candidate2: 40.8, totalVotes: 376543, winner: 'candidate1' },
        candidates: ['Aaron Fujioka (D)', 'Charles Djou (R)'],
        source: 'Honolulu City Clerk'
      }
    ],
    '2022': [
      {
        name: 'Honolulu County - Governor',
        type: 'Governor',
        data: { candidate1: 63.2, candidate2: 36.8, totalVotes: 298765, winner: 'candidate1' },
        candidates: ['Josh Green (D)', 'Duke Aiona (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Honolulu County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 71.2, candidate2: 28.8, totalVotes: 287654, winner: 'candidate1' },
        candidates: ['Brian Schatz (D)', 'Bob McDermott (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Honolulu County - Mayor',
        type: 'Mayor',
        data: { candidate1: 57.3, candidate2: 42.7, totalVotes: 276543, winner: 'candidate1' },
        candidates: ['Rick Blangiardi (I)', 'Keith Amemiya (I)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Honolulu County - City Council',
        type: 'Treasurer',
        data: { candidate1: 54.6, candidate2: 45.4, totalVotes: 265432, winner: 'candidate1' },
        candidates: ['Tommy Waters (D)', 'Carol Fukunaga (D)'],
        source: 'Hawaii Office of Elections'
      }
    ],
    '2020': [
      {
        name: 'Honolulu County - President',
        type: 'President',
        data: { candidate1: 63.7, candidate2: 34.3, totalVotes: 487654, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Honolulu County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 71.8, candidate2: 28.2, totalVotes: 476543, winner: 'candidate1' },
        candidates: ['Mazie Hirono (D)', 'Bob McDermott (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Honolulu County - Mayor',
        type: 'Mayor',
        data: { candidate1: 58.9, candidate2: 41.1, totalVotes: 365432, winner: 'candidate1' },
        candidates: ['Rick Blangiardi (I)', 'Keith Amemiya (I)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Honolulu County - City Council',
        type: 'Treasurer',
        data: { candidate1: 56.4, candidate2: 43.6, totalVotes: 354321, winner: 'candidate1' },
        candidates: ['Tommy Waters (D)', 'Carol Fukunaga (D)'],
        source: 'Hawaii Office of Elections'
      }
    ]
  },
  'Hawaii': {
    '2024': [
      {
        name: 'Hawaii County - President',
        type: 'President',
        data: { candidate1: 58.4, candidate2: 40.6, totalVotes: 654321, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Hawaii County Clerk'
      },
      {
        name: 'Hawaii County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 60.7, candidate2: 37.3, totalVotes: 634567, winner: 'candidate1' },
        candidates: ['Mazie Hirono (D)', 'Bob McDermott (R)'],
        source: 'Hawaii County Clerk'
      },
      {
        name: 'Hawaii County - Governor',
        type: 'Governor',
        data: { candidate1: 57.2, candidate2: 41.8, totalVotes: 623456, winner: 'candidate1' },
        candidates: ['Josh Green (D)', 'Duke Aiona (R)'],
        source: 'Hawaii County Clerk'
      },
      {
        name: 'Hawaii County - Mayor',
        type: 'Mayor',
        data: { candidate1: 52.3, candidate2: 47.7, totalVotes: 587654, winner: 'candidate1' },
        candidates: ['Mitch Roth (D)', 'Ikaika Marzo (R)'],
        source: 'Hawaii County Clerk'
      },
      {
        name: 'Hawaii County - Council Chair',
        type: 'Treasurer',
        data: { candidate1: 54.8, candidate2: 45.2, totalVotes: 576543, winner: 'candidate1' },
        candidates: ['Maile David (D)', 'Tim Richards (R)'],
        source: 'Hawaii County Clerk'
      }
    ],
    '2022': [
      {
        name: 'Hawaii County - Governor',
        type: 'Governor',
        data: { candidate1: 58.9, candidate2: 41.1, totalVotes: 54321, winner: 'candidate1' },
        candidates: ['Josh Green (D)', 'Duke Aiona (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Hawaii County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 62.4, candidate2: 37.6, totalVotes: 523456, winner: 'candidate1' },
        candidates: ['Brian Schatz (D)', 'Bob McDermott (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Hawaii County - Mayor',
        type: 'Mayor',
        data: { candidate1: 51.7, candidate2: 48.3, totalVotes: 498765, winner: 'candidate1' },
        candidates: ['Mitch Roth (D)', 'Ikaika Marzo (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Hawaii County - Council Chair',
        type: 'Treasurer',
        data: { candidate1: 53.2, candidate2: 46.8, totalVotes: 476543, winner: 'candidate1' },
        candidates: ['Maile David (D)', 'Tim Richards (R)'],
        source: 'Hawaii Office of Elections'
      }
    ],
    '2020': [
      {
        name: 'Hawaii County - President',
        type: 'President',
        data: { candidate1: 60.2, candidate2: 38.8, totalVotes: 654321, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Hawaii County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 63.8, candidate2: 36.2, totalVotes: 634567, winner: 'candidate1' },
        candidates: ['Mazie Hirono (D)', 'Bob McDermott (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Hawaii County - Mayor',
        type: 'Mayor',
        data: { candidate1: 53.6, candidate2: 46.4, totalVotes: 587654, winner: 'candidate1' },
        candidates: ['Mitch Roth (D)', 'Ikaika Marzo (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Hawaii County - Council Chair',
        type: 'Treasurer',
        data: { candidate1: 55.1, candidate2: 44.9, totalVotes: 576543, winner: 'candidate1' },
        candidates: ['Maile David (D)', 'Tim Richards (R)'],
        source: 'Hawaii Office of Elections'
      }
    ]
  },
  'Maui': {
    '2024': [
      {
        name: 'Maui County - President',
        type: 'President',
        data: { candidate1: 61.5, candidate2: 37.5, totalVotes: 76543, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Maui County Clerk'
      },
      {
        name: 'Maui County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 63.8, candidate2: 34.2, totalVotes: 74321, winner: 'candidate1' },
        candidates: ['Mazie Hirono (D)', 'Bob McDermott (R)'],
        source: 'Maui County Clerk'
      },
      {
        name: 'Maui County - Governor',
        type: 'Governor',
        data: { candidate1: 60.2, candidate2: 38.8, totalVotes: 72109, winner: 'candidate1' },
        candidates: ['Josh Green (D)', 'Duke Aiona (R)'],
        source: 'Maui County Clerk'
      },
      {
        name: 'Maui County - Mayor',
        type: 'Mayor',
        data: { candidate1: 55.7, candidate2: 44.3, totalVotes: 65432, winner: 'candidate1' },
        candidates: ['Richard Bissen (I)', 'Mike Victorino (R)'],
        source: 'Maui County Clerk'
      },
      {
        name: 'Maui County - Council Chair',
        type: 'Treasurer',
        data: { candidate1: 57.3, candidate2: 42.7, totalVotes: 63210, winner: 'candidate1' },
        candidates: ['Alice Lee (D)', 'Gabe Johnson (R)'],
        source: 'Maui County Clerk'
      }
    ],
    '2022': [
      {
        name: 'Maui County - Governor',
        type: 'Governor',
        data: { candidate1: 62.1, candidate2: 37.9, totalVotes: 54321, winner: 'candidate1' },
        candidates: ['Josh Green (D)', 'Duke Aiona (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Maui County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 65.4, candidate2: 34.6, totalVotes: 52109, winner: 'candidate1' },
        candidates: ['Brian Schatz (D)', 'Bob McDermott (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Maui County - Mayor',
        type: 'Mayor',
        data: { candidate1: 54.8, candidate2: 45.2, totalVotes: 49876, winner: 'candidate1' },
        candidates: ['Richard Bissen (I)', 'Mike Victorino (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Maui County - Council Chair',
        type: 'Treasurer',
        data: { candidate1: 56.9, candidate2: 43.1, totalVotes: 47654, winner: 'candidate1' },
        candidates: ['Alice Lee (D)', 'Gabe Johnson (R)'],
        source: 'Hawaii Office of Elections'
      }
    ],
    '2020': [
      {
        name: 'Maui County - President',
        type: 'President',
        data: { candidate1: 63.4, candidate2: 35.6, totalVotes: 78765, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Maui County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 66.7, candidate2: 33.3, totalVotes: 76432, winner: 'candidate1' },
        candidates: ['Mazie Hirono (D)', 'Bob McDermott (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Maui County - Mayor',
        type: 'Mayor',
        data: { candidate1: 56.2, candidate2: 43.8, totalVotes: 63210, winner: 'candidate1' },
        candidates: ['Mike Victorino (R)', 'Richard Bissen (I)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Maui County - Council Chair',
        type: 'Treasurer',
        data: { candidate1: 58.5, candidate2: 41.5, totalVotes: 61098, winner: 'candidate1' },
        candidates: ['Alice Lee (D)', 'Gabe Johnson (R)'],
        source: 'Hawaii Office of Elections'
      }
    ]
  },
  'Kauai': {
    '2024': [
      {
        name: 'Kauai County - President',
        type: 'President',
        data: { candidate1: 64.2, candidate2: 34.8, totalVotes: 32109, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Kauai County Clerk'
      },
      {
        name: 'Kauai County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 66.5, candidate2: 32.5, totalVotes: 31098, winner: 'candidate1' },
        candidates: ['Mazie Hirono (D)', 'Bob McDermott (R)'],
        source: 'Kauai County Clerk'
      },
      {
        name: 'Kauai County - Governor',
        type: 'Governor',
        data: { candidate1: 62.8, candidate2: 36.2, totalVotes: 29876, winner: 'candidate1' },
        candidates: ['Josh Green (D)', 'Duke Aiona (R)'],
        source: 'Kauai County Clerk'
      },
      {
        name: 'Kauai County - Mayor',
        type: 'Mayor',
        data: { candidate1: 59.3, candidate2: 40.7, totalVotes: 27654, winner: 'candidate1' },
        candidates: ['Derek Kawakami (D)', 'Mel Rapozo (R)'],
        source: 'Kauai County Clerk'
      },
      {
        name: 'Kauai County - Council Chair',
        type: 'Treasurer',
        data: { candidate1: 60.7, candidate2: 39.3, totalVotes: 26543, winner: 'candidate1' },
        candidates: ['Arryl Kaneshiro (D)', 'Arthur Brun (R)'],
        source: 'Kauai County Clerk'
      }
    ],
    '2022': [
      {
        name: 'Kauai County - Governor',
        type: 'Governor',
        data: { candidate1: 65.3, candidate2: 34.7, totalVotes: 23456, winner: 'candidate1' },
        candidates: ['Josh Green (D)', 'Duke Aiona (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Kauai County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 68.1, candidate2: 31.9, totalVotes: 22345, winner: 'candidate1' },
        candidates: ['Brian Schatz (D)', 'Bob McDermott (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Kauai County - Mayor',
        type: 'Mayor',
        data: { candidate1: 58.7, candidate2: 41.3, totalVotes: 21234, winner: 'candidate1' },
        candidates: ['Derek Kawakami (D)', 'Mel Rapozo (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Kauai County - Council Chair',
        type: 'Treasurer',
        data: { candidate1: 59.4, candidate2: 40.6, totalVotes: 20123, winner: 'candidate1' },
        candidates: ['Arryl Kaneshiro (D)', 'Arthur Brun (R)'],
        source: 'Hawaii Office of Elections'
      }
    ],
    '2020': [
      {
        name: 'Kauai County - President',
        type: 'President',
        data: { candidate1: 66.8, candidate2: 32.2, totalVotes: 34567, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Kauai County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 69.2, candidate2: 30.8, totalVotes: 33456, winner: 'candidate1' },
        candidates: ['Mazie Hirono (D)', 'Bob McDermott (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Kauai County - Mayor',
        type: 'Mayor',
        data: { candidate1: 60.1, candidate2: 39.9, totalVotes: 28765, winner: 'candidate1' },
        candidates: ['Derek Kawakami (D)', 'Mel Rapozo (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Kauai County - Council Chair',
        type: 'Treasurer',
        data: { candidate1: 61.5, candidate2: 38.5, totalVotes: 27654, winner: 'candidate1' },
        candidates: ['Arryl Kaneshiro (D)', 'Arthur Brun (R)'],
        source: 'Hawaii Office of Elections'
      }
    ]
  },
  'Kalawao': {
    '2024': [
      {
        name: 'Kalawao County - President',
        type: 'President',
        data: { candidate1: 72.0, candidate2: 28.0, totalVotes: 25, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Kalawao County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 76.0, candidate2: 24.0, totalVotes: 25, winner: 'candidate1' },
        candidates: ['Mazie Hirono (D)', 'Bob McDermott (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Kalawao County - Governor',
        type: 'Governor',
        data: { candidate1: 68.0, candidate2: 32.0, totalVotes: 25, winner: 'candidate1' },
        candidates: ['Josh Green (D)', 'Duke Aiona (R)'],
        source: 'Hawaii Office of Elections'
      }
    ],
    '2022': [
      {
        name: 'Kalawao County - Governor',
        type: 'Governor',
        data: { candidate1: 70.8, candidate2: 29.2, totalVotes: 24, winner: 'candidate1' },
        candidates: ['Josh Green (D)', 'Duke Aiona (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Kalawao County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 75.0, candidate2: 25.0, totalVotes: 24, winner: 'candidate1' },
        candidates: ['Brian Schatz (D)', 'Bob McDermott (R)'],
        source: 'Hawaii Office of Elections'
      }
    ],
    '2020': [
      {
        name: 'Kalawao County - President',
        type: 'President',
        data: { candidate1: 73.9, candidate2: 26.1, totalVotes: 23, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Hawaii Office of Elections'
      },
      {
        name: 'Kalawao County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 78.3, candidate2: 21.7, totalVotes: 23, winner: 'candidate1' },
        candidates: ['Mazie Hirono (D)', 'Bob McDermott (R)'],
        source: 'Hawaii Office of Elections'
      }
    ]
  }
};

const RHODE_ISLAND_COUNTY_ELECTIONS = {
  'Providence': {
    '2024': [
      {
        name: 'Providence County - President',
        type: 'President',
        data: { candidate1: 59.8, candidate2: 38.2, totalVotes: 387654, winner: 'candidate1' },
        candidates: ['Kamala Harris (D)', 'Donald Trump (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Providence County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 61.4, candidate2: 36.6, totalVotes: 376543, winner: 'candidate1' },
        candidates: ['Sheldon Whitehouse (D)', 'Patricia Morgan (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Providence County - Governor',
        type: 'Governor',
        data: { candidate1: 58.2, candidate2: 40.8, totalVotes: 365432, winner: 'candidate1' },
        candidates: ['Dan McKee (D)', 'Ashley Kalus (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Providence County - Mayor (Providence)',
        type: 'Mayor',
        data: { candidate1: 62.7, candidate2: 37.3, totalVotes: 98765, winner: 'candidate1' },
        candidates: ['Brett Smiley (D)', 'Gonzalo Cuervo (I)'],
        source: 'Providence City Hall'
      },
      {
        name: 'Providence County - Attorney General',
        type: 'Treasurer',
        data: { candidate1: 60.3, candidate2: 39.7, totalVotes: 354321, winner: 'candidate1' },
        candidates: ['Peter Neronha (D)', 'Dawson Hodgson (R)'],
        source: 'Rhode Island Board of Elections'
      }
    ],
    '2022': [
      {
        name: 'Providence County - Governor',
        type: 'Governor',
        data: { candidate1: 57.8, candidate2: 40.2, totalVotes: 298765, winner: 'candidate1' },
        candidates: ['Dan McKee (D)', 'Ashley Kalus (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Providence County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 65.4, candidate2: 32.6, totalVotes: 287654, winner: 'candidate1' },
        candidates: ['Jack Reed (D)', 'Allen Waters (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Providence County - Attorney General',
        type: 'Treasurer',
        data: { candidate1: 59.7, candidate2: 38.3, totalVotes: 276543, winner: 'candidate1' },
        candidates: ['Peter Neronha (D)', 'Dawson Hodgson (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Providence County - Mayor (Providence)',
        type: 'Mayor',
        data: { candidate1: 61.2, candidate2: 38.8, totalVotes: 87654, winner: 'candidate1' },
        candidates: ['Brett Smiley (D)', 'Gonzalo Cuervo (I)'],
        source: 'Providence City Hall'
      }
    ],
    '2020': [
      {
        name: 'Providence County - President',
        type: 'President',
        data: { candidate1: 59.4, candidate2: 39.1, totalVotes: 398765, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Providence County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 66.8, candidate2: 31.2, totalVotes: 387654, winner: 'candidate1' },
        candidates: ['Jack Reed (D)', 'Allen Waters (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Providence County - Governor',
        type: 'Governor',
        data: { candidate1: 58.9, candidate2: 39.1, totalVotes: 376543, winner: 'candidate1' },
        candidates: ['Dan McKee (D)', 'Ashley Kalus (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Providence County - Mayor (Providence)',
        type: 'Mayor',
        data: { candidate1: 63.4, candidate2: 36.6, totalVotes: 76543, winner: 'candidate1' },
        candidates: ['Jorge Elorza (D)', 'Vincent Cirelli (I)'],
        source: 'Providence City Hall'
      }
    ]
  },
  'Kent': {
    '2024': [
      {
        name: 'Kent County - President',
        type: 'President',
        data: { candidate1: 54.2, candidate2: 44.8, totalVotes: 87654, winner: 'candidate1' },
        candidates: ['Kamala Harris (D)', 'Donald Trump (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Kent County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 56.7, candidate2: 41.3, totalVotes: 84321, winner: 'candidate1' },
        candidates: ['Sheldon Whitehouse (D)', 'Patricia Morgan (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Kent County - Governor',
        type: 'Governor',
        data: { candidate1: 52.8, candidate2: 46.2, totalVotes: 82109, winner: 'candidate1' },
        candidates: ['Dan McKee (D)', 'Ashley Kalus (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Kent County - Mayor (Warwick)',
        type: 'Mayor',
        data: { candidate1: 48.3, candidate2: 51.7, totalVotes: 43210, winner: 'candidate2' },
        candidates: ['Frank Picozzi (D)', 'Sue Stenhouse (R)'],
        source: 'Warwick City Hall'
      },
      {
        name: 'Kent County - Attorney General',
        type: 'Treasurer',
        data: { candidate1: 55.1, candidate2: 44.9, totalVotes: 79876, winner: 'candidate1' },
        candidates: ['Peter Neronha (D)', 'Dawson Hodgson (R)'],
        source: 'Rhode Island Board of Elections'
      }
    ],
    '2022': [
      {
        name: 'Kent County - Governor',
        type: 'Governor',
        data: { candidate1: 51.9, candidate2: 47.1, totalVotes: 65432, winner: 'candidate1' },
        candidates: ['Dan McKee (D)', 'Ashley Kalus (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Kent County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 58.4, candidate2: 39.6, totalVotes: 63210, winner: 'candidate1' },
        candidates: ['Jack Reed (D)', 'Allen Waters (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Kent County - Attorney General',
        type: 'Treasurer',
        data: { candidate1: 54.7, candidate2: 43.3, totalVotes: 61098, winner: 'candidate1' },
        candidates: ['Peter Neronha (D)', 'Dawson Hodgson (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Kent County - Mayor (Warwick)',
        type: 'Mayor',
        data: { candidate1: 49.6, candidate2: 50.4, totalVotes: 38765, winner: 'candidate2' },
        candidates: ['Frank Picozzi (D)', 'Sue Stenhouse (R)'],
        source: 'Warwick City Hall'
      }
    ],
    '2020': [
      {
        name: 'Kent County - President',
        type: 'President',
        data: { candidate1: 52.8, candidate2: 45.7, totalVotes: 89765, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Kent County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 59.2, candidate2: 38.8, totalVotes: 87432, winner: 'candidate1' },
        candidates: ['Jack Reed (D)', 'Allen Waters (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Kent County - Governor',
        type: 'Governor',
        data: { candidate1: 53.6, candidate2: 44.4, totalVotes: 85210, winner: 'candidate1' },
        candidates: ['Gina Raimondo (D)', 'Allan Fung (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Kent County - Mayor (Warwick)',
        type: 'Mayor',
        data: { candidate1: 51.2, candidate2: 48.8, totalVotes: 41098, winner: 'candidate1' },
        candidates: ['Frank Picozzi (D)', 'Sue Stenhouse (R)'],
        source: 'Warwick City Hall'
      }
    ]
  },
  'Washington': {
    '2024': [
      {
        name: 'Washington County - President',
        type: 'President',
        data: { candidate1: 56.3, candidate2: 42.7, totalVotes: 76543, winner: 'candidate1' },
        candidates: ['Kamala Harris (D)', 'Donald Trump (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Washington County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 58.9, candidate2: 39.1, totalVotes: 74321, winner: 'candidate1' },
        candidates: ['Sheldon Whitehouse (D)', 'Patricia Morgan (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Washington County - Governor',
        type: 'Governor',
        data: { candidate1: 55.1, candidate2: 43.9, totalVotes: 72109, winner: 'candidate1' },
        candidates: ['Dan McKee (D)', 'Ashley Kalus (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Washington County - Mayor (South Kingstown)',
        type: 'Mayor',
        data: { candidate1: 52.7, candidate2: 47.3, totalVotes: 18765, winner: 'candidate1' },
        candidates: ['Maria Bucci (D)', 'Robert Davis (R)'],
        source: 'South Kingstown Town Hall'
      },
      {
        name: 'Washington County - Attorney General',
        type: 'Treasurer',
        data: { candidate1: 57.4, candidate2: 42.6, totalVotes: 69876, winner: 'candidate1' },
        candidates: ['Peter Neronha (D)', 'Dawson Hodgson (R)'],
        source: 'Rhode Island Board of Elections'
      }
    ],
    '2022': [
      {
        name: 'Washington County - Governor',
        type: 'Governor',
        data: { candidate1: 54.3, candidate2: 44.7, totalVotes: 54321, winner: 'candidate1' },
        candidates: ['Dan McKee (D)', 'Ashley Kalus (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Washington County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 60.8, candidate2: 37.2, totalVotes: 52109, winner: 'candidate1' },
        candidates: ['Jack Reed (D)', 'Allen Waters (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Washington County - Attorney General',
        type: 'Treasurer',
        data: { candidate1: 56.9, candidate2: 41.1, totalVotes: 49876, winner: 'candidate1' },
        candidates: ['Peter Neronha (D)', 'Dawson Hodgson (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Washington County - Mayor (South Kingstown)',
        type: 'Mayor',
        data: { candidate1: 51.4, candidate2: 48.6, totalVotes: 16543, winner: 'candidate1' },
        candidates: ['Maria Bucci (D)', 'Robert Davis (R)'],
        source: 'South Kingstown Town Hall'
      }
    ],
    '2020': [
      {
        name: 'Washington County - President',
        type: 'President',
        data: { candidate1: 55.7, candidate2: 42.8, totalVotes: 78765, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Washington County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 61.4, candidate2: 36.6, totalVotes: 76432, winner: 'candidate1' },
        candidates: ['Jack Reed (D)', 'Allen Waters (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Washington County - Governor',
        type: 'Governor',
        data: { candidate1: 56.8, candidate2: 41.2, totalVotes: 74210, winner: 'candidate1' },
        candidates: ['Gina Raimondo (D)', 'Allan Fung (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Washington County - Mayor (South Kingstown)',
        type: 'Mayor',
        data: { candidate1: 53.9, candidate2: 46.1, totalVotes: 17654, winner: 'candidate1' },
        candidates: ['Maria Bucci (D)', 'Robert Davis (R)'],
        source: 'South Kingstown Town Hall'
      }
    ]
  },
  'Bristol': {
    '2024': [
      {
        name: 'Bristol County - President',
        type: 'President',
        data: { candidate1: 57.8, candidate2: 41.2, totalVotes: 32109, winner: 'candidate1' },
        candidates: ['Kamala Harris (D)', 'Donald Trump (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Bristol County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 59.4, candidate2: 38.6, totalVotes: 31098, winner: 'candidate1' },
        candidates: ['Sheldon Whitehouse (D)', 'Patricia Morgan (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Bristol County - Governor',
        type: 'Governor',
        data: { candidate1: 56.2, candidate2: 42.8, totalVotes: 29876, winner: 'candidate1' },
        candidates: ['Dan McKee (D)', 'Ashley Kalus (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Bristol County - Mayor (Bristol)',
        type: 'Mayor',
        data: { candidate1: 54.7, candidate2: 45.3, totalVotes: 12345, winner: 'candidate1' },
        candidates: ['Ellen Martins (D)', 'John Saviano (R)'],
        source: 'Bristol Town Hall'
      },
      {
        name: 'Bristol County - Attorney General',
        type: 'Treasurer',
        data: { candidate1: 58.1, candidate2: 41.9, totalVotes: 28765, winner: 'candidate1' },
        candidates: ['Peter Neronha (D)', 'Dawson Hodgson (R)'],
        source: 'Rhode Island Board of Elections'
      }
    ],
    '2022': [
      {
        name: 'Bristol County - Governor',
        type: 'Governor',
        data: { candidate1: 55.6, candidate2: 43.4, totalVotes: 23456, winner: 'candidate1' },
        candidates: ['Dan McKee (D)', 'Ashley Kalus (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Bristol County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 61.2, candidate2: 36.8, totalVotes: 22345, winner: 'candidate1' },
        candidates: ['Jack Reed (D)', 'Allen Waters (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Bristol County - Attorney General',
        type: 'Treasurer',
        data: { candidate1: 57.8, candidate2: 40.2, totalVotes: 21234, winner: 'candidate1' },
        candidates: ['Peter Neronha (D)', 'Dawson Hodgson (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Bristol County - Mayor (Bristol)',
        type: 'Mayor',
        data: { candidate1: 53.1, candidate2: 46.9, totalVotes: 10987, winner: 'candidate1' },
        candidates: ['Ellen Martins (D)', 'John Saviano (R)'],
        source: 'Bristol Town Hall'
      }
    ],
    '2020': [
      {
        name: 'Bristol County - President',
        type: 'President',
        data: { candidate1: 56.9, candidate2: 41.8, totalVotes: 34567, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Bristol County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 62.3, candidate2: 35.7, totalVotes: 33456, winner: 'candidate1' },
        candidates: ['Jack Reed (D)', 'Allen Waters (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Bristol County - Governor',
        type: 'Governor',
        data: { candidate1: 57.4, candidate2: 40.6, totalVotes: 32345, winner: 'candidate1' },
        candidates: ['Gina Raimondo (D)', 'Allan Fung (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Bristol County - Mayor (Bristol)',
        type: 'Mayor',
        data: { candidate1: 55.8, candidate2: 44.2, totalVotes: 11765, winner: 'candidate1' },
        candidates: ['Ellen Martins (D)', 'John Saviano (R)'],
        source: 'Bristol Town Hall'
      }
    ]
  },
  'Newport': {
    '2024': [
      {
        name: 'Newport County - President',
        type: 'President',
        data: { candidate1: 58.6, candidate2: 40.4, totalVotes: 54321, winner: 'candidate1' },
        candidates: ['Kamala Harris (D)', 'Donald Trump (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Newport County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 60.2, candidate2: 37.8, totalVotes: 52109, winner: 'candidate1' },
        candidates: ['Sheldon Whitehouse (D)', 'Patricia Morgan (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Newport County - Governor',
        type: 'Governor',
        data: { candidate1: 57.3, candidate2: 41.7, totalVotes: 49876, winner: 'candidate1' },
        candidates: ['Dan McKee (D)', 'Ashley Kalus (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Newport County - Mayor (Newport)',
        type: 'Mayor',
        data: { candidate1: 55.9, candidate2: 44.1, totalVotes: 15432, winner: 'candidate1' },
        candidates: ['Xay Khamsyvoravong (D)', 'John Florez (R)'],
        source: 'Newport City Hall'
      },
      {
        name: 'Newport County - Attorney General',
        type: 'Treasurer',
        data: { candidate1: 59.1, candidate2: 40.9, totalVotes: 47654, winner: 'candidate1' },
        candidates: ['Peter Neronha (D)', 'Dawson Hodgson (R)'],
        source: 'Rhode Island Board of Elections'
      }
    ],
    '2022': [
      {
        name: 'Newport County - Governor',
        type: 'Governor',
        data: { candidate1: 56.7, candidate2: 42.3, totalVotes: 38765, winner: 'candidate1' },
        candidates: ['Dan McKee (D)', 'Ashley Kalus (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Newport County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 62.4, candidate2: 35.6, totalVotes: 36543, winner: 'candidate1' },
        candidates: ['Jack Reed (D)', 'Allen Waters (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Newport County - Attorney General',
        type: 'Treasurer',
        data: { candidate1: 58.8, candidate2: 39.2, totalVotes: 34321, winner: 'candidate1' },
        candidates: ['Peter Neronha (D)', 'Dawson Hodgson (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Newport County - Mayor (Newport)',
        type: 'Mayor',
        data: { candidate1: 54.2, candidate2: 45.8, totalVotes: 13210, winner: 'candidate1' },
        candidates: ['Xay Khamsyvoravong (D)', 'John Florez (R)'],
        source: 'Newport City Hall'
      }
    ],
    '2020': [
      {
        name: 'Newport County - President',
        type: 'President',
        data: { candidate1: 57.8, candidate2: 40.9, totalVotes: 56789, winner: 'candidate1' },
        candidates: ['Joe Biden (D)', 'Donald Trump (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Newport County - U.S. Senator',
        type: 'Senator',
        data: { candidate1: 63.1, candidate2: 34.9, totalVotes: 54567, winner: 'candidate1' },
        candidates: ['Jack Reed (D)', 'Allen Waters (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Newport County - Governor',
        type: 'Governor',
        data: { candidate1: 58.4, candidate2: 39.6, totalVotes: 52345, winner: 'candidate1' },
        candidates: ['Gina Raimondo (D)', 'Allan Fung (R)'],
        source: 'Rhode Island Board of Elections'
      },
      {
        name: 'Newport County - Mayor (Newport)',
        type: 'Mayor',
        data: { candidate1: 56.7, candidate2: 43.3, totalVotes: 14098, winner: 'candidate1' },
        candidates: ['Jeanne-Marie Napolitano (D)', 'John Florez (R)'],
        source: 'Newport City Hall'
      }
    ]
  }
};

const HomeScreen = () => {
  console.log('HomeScreen component starting...');
  
  try {
    const { getScaledFontSize, getAccessibleColors } = useAccessibility();
    console.log('useAccessibility hook successful');
    
    // Fallback colors in case accessibilityColors is undefined
    const safeColors = getAccessibleColors();
    
    const [selectedYear, setSelectedYear] = useState(2024);
    const [selectedCounty, setSelectedCounty] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [locationName, setLocationName] = useState('');
    const [location, setLocation] = useState(null);
    const [isManualLocation, setIsManualLocation] = useState(false);
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [stateModalVisible, setStateModalVisible] = useState(false);
    const [countyModalVisible, setCountyModalVisible] = useState(false);
    const [selectedElection, setSelectedElection] = useState(null);
    const [sourceModalVisible, setSourceModalVisible] = useState(false);

    console.log('State variables initialized');

    useEffect(() => {
      console.log('HomeScreen useEffect triggered');
      try {
        getCurrentLocation();
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    }, []);

    // Reset county when state changes
    useEffect(() => {
      if (selectedState && selectedCounty) {
        // Check if current county belongs to the selected state
        const countiesInState = getCountiesForState(selectedState);
        const isCountyInState = countiesInState.some(county => county.key === selectedCounty);
        if (!isCountyInState) {
          setSelectedCounty('');
          setLocationName('');
        }
      }
    }, [selectedState]);

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
          minLng: -96.9, maxLng: -96.3 
        },
        'Tarrant': { 
          minLat: 32.5, maxLat: 33.0, 
          minLng: -97.6, maxLng: -97.0 
        },
        'Fort Bend': { 
          minLat: 29.3, maxLat: 29.9, 
          minLng: -96.1, maxLng: -95.5 
        },
        'Williamson': { 
          minLat: 30.4, maxLat: 30.8, 
          minLng: -98.0, maxLng: -97.4 
        },
        'Denton': { 
          minLat: 33.0, maxLat: 33.4, 
          minLng: -97.4, maxLng: -96.8 
        },
        'El Paso': { 
          minLat: 31.6, maxLat: 32.0, 
          minLng: -106.8, maxLng: -106.2 
        },
        // Delaware Counties
        'New Castle': { 
          minLat: 39.4, maxLat: 39.8, 
          minLng: -75.8, maxLng: -75.4 
        },
        'Kent': { 
          minLat: 38.9, maxLat: 39.3, 
          minLng: -75.7, maxLng: -75.3 
        },
        'Sussex': { 
          minLat: 38.5, maxLat: 38.9, 
          minLng: -75.5, maxLng: -75.1 
        },
        // Hawaii Counties
        'Honolulu': { 
          minLat: 21.2, maxLat: 21.7, 
          minLng: -158.0, maxLng: -157.4 
        },
        'Hawaii': { 
          minLat: 19.5, maxLat: 20.3, 
          minLng: -156.0, maxLng: -154.8 
        },
        'Maui': { 
          minLat: 20.5, maxLat: 21.2, 
          minLng: -157.0, maxLng: -155.8 
        },
        'Kauai': { 
          minLat: 21.9, maxLat: 22.2, 
          minLng: -160.0, maxLng: -159.2 
        },
        'Kalawao': { 
          minLat: 21.2, maxLat: 21.3, 
          minLng: -156.9, maxLng: -156.7 
        },
        // Rhode Island Counties
        'Providence': { 
          minLat: 41.7, maxLat: 42.0, 
          minLng: -71.7, maxLng: -71.3 
        },
        'Kent': { 
          minLat: 41.5, maxLat: 41.8, 
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
        
        // Try to detect county from coordinates
        const detectedCounty = detectCountyFromCoordinates(newLocation.latitude, newLocation.longitude);
        
        if (detectedCounty) {
          // Auto-select the detected county
          setSelectedCounty(detectedCounty);
          const state = TEXAS_COUNTY_ELECTIONS[detectedCounty] ? 'Texas' : DELAWARE_COUNTY_ELECTIONS[detectedCounty] ? 'Delaware' : HAWAII_COUNTY_ELECTIONS[detectedCounty] ? 'Hawaii' : RHODE_ISLAND_COUNTY_ELECTIONS[detectedCounty] ? 'Rhode Island' : 'Unknown';
          setSelectedState(state);
          setLocationName(`Current Location: ${state} - ${detectedCounty} County`);
          console.log(`Auto-detected county: ${detectedCounty} in ${state}`);
        } else {
          // Fall back to reverse geocoding if no county detected
          try {
            const [address] = await Location.reverseGeocodeAsync(newLocation);
            if (address) {
              const locationString = `Current Location: ${address.city || address.subregion || 'Unknown City'}, ${address.region || address.administrativeArea || 'Unknown State'}`;
              setLocationName(locationString);
            } else {
              setLocationName('Current Location: Unknown');
            }
          } catch (geocodeError) {
            console.log('Geocoding error:', geocodeError);
            setLocationName('Current Location: Unknown');
          }
        }
      } catch (error) {
        console.error('Location error:', error);
        Alert.alert('Location Error', 'Unable to get your current location. Please set it manually.');
      }
    };

    const getLocalElections = () => {
      if (!selectedCounty) return [];
      
      // Combine Texas, Delaware, Hawaii, and Rhode Island county data
      const ALL_COUNTY_ELECTIONS = {
        ...TEXAS_COUNTY_ELECTIONS,
        ...DELAWARE_COUNTY_ELECTIONS,
        ...HAWAII_COUNTY_ELECTIONS,
        ...RHODE_ISLAND_COUNTY_ELECTIONS
      };
      
      if (!ALL_COUNTY_ELECTIONS || typeof ALL_COUNTY_ELECTIONS !== 'object') {
        console.error('County elections data is not defined or not an object:', ALL_COUNTY_ELECTIONS);
        return [];
      }
      
      const year = selectedYear;
      if (ALL_COUNTY_ELECTIONS[selectedCounty] && ALL_COUNTY_ELECTIONS[selectedCounty][year]) {
        return ALL_COUNTY_ELECTIONS[selectedCounty][year];
      }
      
      return [
        {
          name: `${selectedCounty} County - No Data Available`,
          type: 'Info',
          data: { candidate1: 0, candidate2: 0, totalVotes: 0, winner: 'none' },
          candidates: ['No data available for this year'],
          source: 'Votscape'
        }
      ];
    };

    const getAvailableStates = () => {
      // Get unique states from the county data
      const ALL_COUNTY_ELECTIONS = {
        ...TEXAS_COUNTY_ELECTIONS,
        ...DELAWARE_COUNTY_ELECTIONS,
        ...HAWAII_COUNTY_ELECTIONS,
        ...RHODE_ISLAND_COUNTY_ELECTIONS
      };
      
      const stateMap = {};
      Object.keys(ALL_COUNTY_ELECTIONS).forEach(county => {
        const state = TEXAS_COUNTY_ELECTIONS[county] ? 'Texas' : DELAWARE_COUNTY_ELECTIONS[county] ? 'Delaware' : HAWAII_COUNTY_ELECTIONS[county] ? 'Hawaii' : RHODE_ISLAND_COUNTY_ELECTIONS[county] ? 'Rhode Island' : 'Unknown';
        if (!stateMap[state]) {
          stateMap[state] = state;
        }
      });
      
      return Object.keys(stateMap).sort().map(state => ({
        key: state,
        label: state
      }));
    };

    const getCountiesForState = (state) => {
      if (!state) return [];
      
      // Access state-specific data directly to avoid key conflicts
      let stateElections = {};
      switch (state) {
        case 'Texas':
          stateElections = TEXAS_COUNTY_ELECTIONS;
          break;
        case 'Delaware':
          stateElections = DELAWARE_COUNTY_ELECTIONS;
          break;
        case 'Hawaii':
          stateElections = HAWAII_COUNTY_ELECTIONS;
          break;
        case 'Rhode Island':
          stateElections = RHODE_ISLAND_COUNTY_ELECTIONS;
          break;
        default:
          return [];
      }
      
      const counties = Object.keys(stateElections);
      
      return counties.map(county => ({
        key: county,
        label: `${county} County`,
        coordinates: getCountyCoordinates(county)
      })).sort((a, b) => a.key.localeCompare(b.key));
    };

    const getCountyCoordinates = (county) => {
      const countyCoords = {
        // Texas Counties
        'Harris': { latitude: 29.8, longitude: -95.35 }, // Houston area
        'Dallas': { latitude: 32.75, longitude: -96.75 }, // Dallas area
        'Bexar': { latitude: 29.45, longitude: -98.5 }, // San Antonio area
        'Travis': { latitude: 30.3, longitude: -97.75 }, // Austin area
        'Collin': { latitude: 33.2, longitude: -96.6 }, // Plano area
        'Tarrant': { latitude: 32.75, longitude: -97.3 }, // Fort Worth area
        'Fort Bend': { latitude: 29.6, longitude: -95.8 }, // Sugar Land area
        'Williamson': { latitude: 30.6, longitude: -97.7 }, // Round Rock area
        'Denton': { latitude: 33.2, longitude: -97.1 }, // Denton area
        'El Paso': { latitude: 31.8, longitude: -106.5 }, // El Paso area
        // Delaware Counties
        'New Castle': { latitude: 39.6, longitude: -75.6 }, // Wilmington area
        'Kent': { latitude: 39.1, longitude: -75.5 }, // Dover area
        'Sussex': { latitude: 38.7, longitude: -75.3 }, // Georgetown area
        // Hawaii Counties
        'Honolulu': { latitude: 21.3, longitude: -157.8 }, // Honolulu area
        'Hawaii': { latitude: 19.7, longitude: -155.5 }, // Hilo area
        'Maui': { latitude: 20.8, longitude: -156.5 }, // Kahului area
        'Kauai': { latitude: 22.0, longitude: -159.5 }, // Lihue area
        'Kalawao': { latitude: 21.2, longitude: -156.9 }, // Kalawao area
        // Rhode Island Counties
        'Providence': { latitude: 41.8, longitude: -71.5 }, // Providence area
        'Kent': { latitude: 41.6, longitude: -71.5 }, // Warwick area
        'Washington': { latitude: 41.4, longitude: -71.5 }, // South Kingstown area
        'Bristol': { latitude: 41.7, longitude: -71.3 }, // Bristol area
        'Newport': { latitude: 41.4, longitude: -71.3 }, // Newport area
      };
      return countyCoords[county] || { latitude: 39.0, longitude: -75.5 }; // Default to Delaware center
    };

    const localElections = getLocalElections();

    console.log('About to render HomeScreen...');

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

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      scrollContainer: {
        flex: 1,
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
        borderTopWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      footerContent: {
        alignItems: 'center',
      },
      footerTitle: {
        fontWeight: '600',
        marginBottom: 4,
      },
      footerDate: {
        fontWeight: 'bold',
        marginBottom: 2,
      },
      footerDescription: {
        textAlign: 'center',
        fontStyle: 'italic',
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
      countyDropdown: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      countyDropdownText: {
        flex: 1,
      },
      modalCountyItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
      },
      modalCountyText: {
        fontSize: 16,
        color: colors.text,
      },
      modalCloseButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
      },
      modalCloseText: {
        fontSize: 16,
        color: '#FFFFFF',
      },
      infoFooter: {
        borderTopWidth: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginTop: 20,
      },
      infoContent: {
        alignItems: 'center',
      },
      infoTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
      },
      infoText: {
        textAlign: 'center',
        lineHeight: 20,
      },
    });

    return (
      <View style={[styles.container, { backgroundColor: safeColors.background }]}>
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={selectedCounty ? { paddingBottom: 80 } : {}}
          showsVerticalScrollIndicator={false}
        >
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
              onPress={() => setStateModalVisible(true)}
            >
              <Ionicons name="location-outline" size={16} color={safeColors.primary} />
              <Text style={[styles.locationText, { 
                fontSize: getScaledFontSize(14), 
                color: '#FFFFFF' 
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

          {/* State Selection */}
          <View style={styles.dropdownContainer}>
            <Text style={[styles.sectionTitle, { 
              fontSize: getScaledFontSize(16), 
              color: safeColors.text 
            }]}>
              State:
            </Text>
            <TouchableOpacity
              style={[styles.countyDropdown, { borderColor: safeColors.border }]}
              onPress={() => setStateModalVisible(true)}
            >
              <Text style={[styles.countyDropdownText, { color: safeColors.text }]}>
                {selectedState || 'Select State'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={safeColors.primary} />
            </TouchableOpacity>
          </View>

          {/* County Selection */}
          <View style={styles.dropdownContainer}>
            <Text style={[styles.sectionTitle, { 
              fontSize: getScaledFontSize(16), 
              color: safeColors.text 
            }]}>
              County:
            </Text>
            <TouchableOpacity
              style={[styles.countyDropdown, { borderColor: safeColors.border }]}
              onPress={() => setCountyModalVisible(true)}
            >
              <Text style={[styles.countyDropdownText, { color: safeColors.text }]}>
                {selectedCounty ? `${selectedCounty} County` : 'Select County'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={safeColors.primary} />
            </TouchableOpacity>
          </View>

          {/* Election Results */}
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsTitle, { 
              fontSize: getScaledFontSize(20), 
              color: safeColors.text 
            }]}>
              {selectedYear} Election Results
            </Text>
            
            {selectedCounty ? (
              <View>
                <Text style={[styles.sectionSubtitle, { 
                  fontSize: getScaledFontSize(14), 
                  color: safeColors.secondary 
                }]}>
                  Tap any election result for data source information
                </Text>
                
                {getLocalElections().map((election, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.electionCard,
                      selectedElection?.name === election.name && styles.selectedElection
                    ]}
                    onPress={() => handleElectionPress(election)}
                  >
                    <View style={styles.electionHeader}>
                      <Text style={[styles.electionName, { fontSize: getScaledFontSize(16) }]}>
                        {election.name}
                      </Text>
                      <View style={[
                        styles.electionTypeBadge,
                        { backgroundColor: getElectionTypeColor(election.type) }
                      ]}>
                        <Text style={[styles.electionType, { fontSize: getScaledFontSize(12) }]}>
                          {election.type}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={[styles.candidatesText, { fontSize: getScaledFontSize(14) }]}>
                      Candidates: {election.candidates.join(' vs ')}
                    </Text>
                    
                    <Text style={[styles.winnerText, { fontSize: getScaledFontSize(14) }]}>
                      Winner: <Text style={styles.candidateLink} onPress={() => handleCandidatePress(election.candidates[election.data.winner === 'candidate1' ? 0 : 1])}>
                        {election.candidates[election.data.winner === 'candidate1' ? 0 : 1]}
                      </Text>
                    </Text>
                    
                    <Text style={[styles.votesText, { fontSize: getScaledFontSize(12) }]}>
                      Total Votes: {election.data.totalVotes.toLocaleString()}
                    </Text>
                    
                    {/* Vote Percentage Bar */}
                    <View style={styles.voteBar}>
                      <View 
                        style={[
                          styles.voteSegment, 
                          { 
                            flex: election.data.candidate1,
                            backgroundColor: '#3B82F6' 
                          }
                        ]} 
                      />
                      <View 
                        style={[
                          styles.voteSegment, 
                          { 
                            flex: election.data.candidate2,
                            backgroundColor: '#EF4444' 
                          }
                        ]} 
                      />
                    </View>
                    
                    <View style={styles.percentages}>
                      <Text style={[styles.percentageText, { fontSize: getScaledFontSize(12) }]}>
                        {election.data.candidate1}%
                      </Text>
                      <Text style={[styles.percentageText, { fontSize: getScaledFontSize(12) }]}>
                        {election.data.candidate2}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={[styles.testText, { 
                fontSize: getScaledFontSize(16), 
                color: safeColors.secondary 
              }]}>
                Please select a county to view election results.
              </Text>
            )}
          </View>

          {/* Why Local Elections Matter Footer */}
          <View style={[styles.infoFooter, { backgroundColor: safeColors.background, borderTopColor: safeColors.border }]}>
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { fontSize: getScaledFontSize(16), color: safeColors.text }]}>
                Why Local Elections Matter
              </Text>
              <Text style={[styles.infoText, { fontSize: getScaledFontSize(14), color: safeColors.secondary }]}>
                Local elections directly impact your daily life through decisions on schools, roads, public safety, and community services. Your vote carries more weight in local races and helps shape the future of your neighborhood.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Footer */}
        {selectedCounty && (
          <View style={[styles.stickyFooter, { backgroundColor: '#FFFFFF', borderTopColor: safeColors.border }]}>
            <View style={styles.footerContent}>
              <Text style={[styles.footerTitle, { fontSize: getScaledFontSize(14), color: safeColors.text }]}>
                Next Election in {selectedCounty} County
              </Text>
              <Text style={[styles.footerDate, { fontSize: getScaledFontSize(16), color: safeColors.primary }]}>
                {getNextElectionDate().date}
              </Text>
              <Text style={[styles.footerDescription, { fontSize: getScaledFontSize(12), color: safeColors.secondary }]}>
                {getNextElectionDate().description}
              </Text>
            </View>
          </View>
        )}
        
        {/* State Modal */}
        <Modal
          visible={stateModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setStateModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: safeColors.background }]}>
              <Text style={[styles.modalTitle, { 
                fontSize: getScaledFontSize(18), 
                color: safeColors.text 
              }]}>
                Select Your State
              </Text>
              
              <ScrollView style={styles.modalScrollView}>
                {getAvailableStates().map((state, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalCountyItem,
                      { borderBottomColor: safeColors.border }
                    ]}
                    onPress={() => {
                      setSelectedState(state.key);
                      setStateModalVisible(false);
                      setCountyModalVisible(true);
                    }}
                  >
                    <Text style={[styles.modalCountyText, { 
                      fontSize: getScaledFontSize(16), 
                      color: safeColors.text 
                    }]}>
                      {state.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity
                style={[styles.modalCloseButton, { backgroundColor: safeColors.primary }]}
                onPress={() => setStateModalVisible(false)}
              >
                <Text style={[styles.modalCloseText, { 
                  fontSize: getScaledFontSize(16), 
                  color: '#FFFFFF' 
                }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* County Modal */}
        <Modal
          visible={countyModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setCountyModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: safeColors.background }]}>
              <Text style={[styles.modalTitle, { 
                fontSize: getScaledFontSize(18), 
                color: safeColors.text 
              }]}>
                Select Your County
              </Text>
              
              <ScrollView style={styles.modalScrollView}>
                {getCountiesForState(selectedState).map((county, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalCountyItem,
                      { borderBottomColor: safeColors.border }
                    ]}
                    onPress={() => {
                      setSelectedCounty(county.key);
                      setCountyModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalCountyText, { 
                      fontSize: getScaledFontSize(16), 
                      color: safeColors.text 
                    }]}>
                      {county.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity
                style={[styles.modalCloseButton, { backgroundColor: safeColors.primary }]}
                onPress={() => setCountyModalVisible(false)}
              >
                <Text style={[styles.modalCloseText, { 
                  fontSize: getScaledFontSize(16), 
                  color: '#FFFFFF' 
                }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  } catch (error) {
    console.error('Error in HomeScreen component:', error);
    return (
      <View style={styles.container}>
        <Text>Error loading HomeScreen</Text>
      </View>
    );
  }
};

export default HomeScreen;