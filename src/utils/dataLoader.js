import electionData2020 from '../data/2020_presidential.json';

/**
 * Data loader utility for managing election data
 * Handles loading JSON files and providing data access methods
 */

// Available election datasets
const AVAILABLE_ELECTIONS = {
  '2020': electionData2020,
  // Future elections can be added here
  // '2016': electionData2016,
  // '2018': electionData2018,
};

/**
 * Load election data for a specific year
 * @param {string} year - Election year (e.g., '2020')
 * @returns {Object|null} Election data object or null if not found
 */
export const loadElectionData = (year) => {
  return AVAILABLE_ELECTIONS[year] || null;
};

/**
 * Get all available election years
 * @returns {Array} Array of available election years
 */
export const getAvailableElectionYears = () => {
  return Object.keys(AVAILABLE_ELECTIONS).map(year => ({
    label: `${year} Presidential`,
    value: year,
  }));
};

/**
 * Find a county by ID in the election data
 * @param {Object} electionData - Election data object
 * @param {string} countyId - County ID to search for
 * @returns {Object|null} County data or null if not found
 */
export const findCountyById = (electionData, countyId) => {
  if (!electionData || !electionData.counties) return null;
  return electionData.counties.find(county => county.id === countyId) || null;
};

/**
 * Find a county by name and state
 * @param {Object} electionData - Election data object
 * @param {string} countyName - County name
 * @param {string} state - State name
 * @returns {Object|null} County data or null if not found
 */
export const findCountyByName = (electionData, countyName, state) => {
  if (!electionData || !electionData.counties) return null;
  return electionData.counties.find(
    county => county.name === countyName && county.state === state
  ) || null;
};

/**
 * Get all counties from election data
 * @param {Object} electionData - Election data object
 * @returns {Array} Array of county objects
 */
export const getAllCounties = (electionData) => {
  if (!electionData || !electionData.counties) return [];
  return electionData.counties;
};

/**
 * Get counties within a geographic bounding box
 * @param {Object} electionData - Election data object
 * @param {Object} bounds - Bounding box with north, south, east, west
 * @returns {Array} Array of counties within bounds
 */
export const getCountiesInBounds = (electionData, bounds) => {
  if (!electionData || !electionData.counties) return [];
  
  const { north, south, east, west } = bounds;
  
  return electionData.counties.filter(county => {
    const { latitude, longitude } = county.coordinates;
    return (
      latitude <= north &&
      latitude >= south &&
      longitude <= east &&
      longitude >= west
    );
  });
};

/**
 * Calculate distance between two coordinates (in miles)
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in miles
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Find nearest counties to a given location
 * @param {Object} electionData - Election data object
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} maxDistance - Maximum distance in miles (default: 50)
 * @returns {Array} Array of nearby counties sorted by distance
 */
export const getNearbyCounties = (electionData, latitude, longitude, maxDistance = 50) => {
  if (!electionData || !electionData.counties) return [];
  
  return electionData.counties
    .map(county => ({
      ...county,
      distance: calculateDistance(
        latitude, 
        longitude, 
        county.coordinates.latitude, 
        county.coordinates.longitude
      )
    }))
    .filter(county => county.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Get summary statistics for an election
 * @param {Object} electionData - Election data object
 * @returns {Object} Summary statistics
 */
export const getElectionSummary = (electionData) => {
  if (!electionData || !electionData.counties) return null;
  
  const counties = electionData.counties;
  const totalCounties = counties.length;
  
  let totalVotes = 0;
  let democratWins = 0;
  let republicanWins = 0;
  let otherWins = 0;
  
  counties.forEach(county => {
    totalVotes += county.results.totalVotes;
    
    switch (county.results.winningParty) {
      case 'democrat':
        democratWins++;
        break;
      case 'republican':
        republicanWins++;
        break;
      default:
        otherWins++;
    }
  });
  
  return {
    totalCounties,
    totalVotes,
    democratWins,
    republicanWins,
    otherWins,
    election: electionData.election
  };
};
