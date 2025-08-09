// Mock voting data for demonstration
// In a real app, this would connect to actual election APIs

export const electionYears = [
  { label: '2020 Presidential', value: '2020' },
  { label: '2018 Midterm', value: '2018' },
  { label: '2016 Presidential', value: '2016' },
  { label: '2014 Midterm', value: '2014' },
];

// Sample county voting data
export const mockVotingData = {
  '2020': {
    'Los Angeles County, CA': {
      democrat: 71.0,
      republican: 26.9,
      other: 2.1,
      totalVotes: 5467308,
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437,
      },
    },
    'Orange County, CA': {
      democrat: 53.8,
      republican: 44.2,
      other: 2.0,
      totalVotes: 1789494,
      coordinates: {
        latitude: 33.7175,
        longitude: -117.8311,
      },
    },
    'Harris County, TX': {
      democrat: 56.0,
      republican: 42.7,
      other: 1.3,
      totalVotes: 1933122,
      coordinates: {
        latitude: 29.7604,
        longitude: -95.3698,
      },
    },
  },
  '2016': {
    'Los Angeles County, CA': {
      democrat: 71.4,
      republican: 22.5,
      other: 6.1,
      totalVotes: 4702775,
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437,
      },
    },
    'Orange County, CA': {
      democrat: 50.4,
      republican: 42.6,
      other: 7.0,
      totalVotes: 1589810,
      coordinates: {
        latitude: 33.7175,
        longitude: -117.8311,
      },
    },
  },
};

export const getVotingDataForYear = (year) => {
  return mockVotingData[year] || {};
};

export const getWinningParty = (countyData) => {
  if (!countyData) return 'other';
  
  const { democrat, republican, other } = countyData;
  const max = Math.max(democrat, republican, other || 0);
  
  if (max === democrat) return 'democrat';
  if (max === republican) return 'republican';
  return 'other';
};

export const formatVotePercentage = (percentage) => {
  return `${percentage.toFixed(1)}%`;
};

export const formatVoteCount = (count) => {
  return count.toLocaleString();
};
