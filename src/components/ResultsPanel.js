import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../utils/colors';

export default function ResultsPanel({ selectedCounty, electionData }) {
  // If no county is selected, show default message
  if (!selectedCounty || !electionData) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons 
            name="information-circle-outline" 
            size={48} 
            color={colors.textLight} 
          />
          <Text style={styles.emptyTitle}>No Region Selected</Text>
          <Text style={styles.emptyDescription}>
            Tap on a county or region on the map to view detailed voting results
          </Text>
        </View>
      </View>
    );
  }

  const { results } = selectedCounty;
  const { election } = electionData;

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Format percentage
  const formatPercentage = (percentage) => {
    return `${percentage.toFixed(1)}%`;
  };

  // Get party color for indicators
  const getPartyColor = (party) => {
    switch (party) {
      case 'democrat':
        return colors.democrat;
      case 'republican':
        return colors.republican;
      default:
        return colors.other;
    }
  };

  // Get winner styling
  const getWinnerStyle = (party) => {
    return results.winningParty === party ? styles.winnerText : styles.regularText;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.countyName}>
            {selectedCounty.name}, {selectedCounty.state}
          </Text>
          <Text style={styles.electionInfo}>
            {election.year} {election.type} Election
          </Text>
        </View>

        {/* Winner Banner */}
        <View style={[styles.winnerBanner, { backgroundColor: getPartyColor(results.winningParty) + '20' }]}>
          <View style={[styles.winnerIndicator, { backgroundColor: getPartyColor(results.winningParty) }]} />
          <View style={styles.winnerContent}>
            <Text style={styles.winnerLabel}>Winner</Text>
            <Text style={styles.winnerCandidate}>
              {results[results.winningParty].candidate}
            </Text>
            <Text style={styles.winnerPercentage}>
              {formatPercentage(results[results.winningParty].percentage)}
            </Text>
          </View>
        </View>

        {/* Detailed Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Detailed Results</Text>
          
          {/* Democratic Results */}
          <View style={styles.resultRow}>
            <View style={styles.resultHeader}>
              <View style={[styles.partyIndicator, { backgroundColor: colors.democrat }]} />
              <Text style={[styles.partyName, getWinnerStyle('democrat')]}>
                Democratic Party
              </Text>
              {results.winningParty === 'democrat' && (
                <Ionicons name="trophy" size={16} color={colors.democrat} />
              )}
            </View>
            <Text style={[styles.candidateName, getWinnerStyle('democrat')]}>
              {results.democrat.candidate}
            </Text>
            <View style={styles.voteDetails}>
              <Text style={[styles.voteCount, getWinnerStyle('democrat')]}>
                {formatNumber(results.democrat.votes)} votes
              </Text>
              <Text style={[styles.percentage, getWinnerStyle('democrat')]}>
                {formatPercentage(results.democrat.percentage)}
              </Text>
            </View>
          </View>

          {/* Republican Results */}
          <View style={styles.resultRow}>
            <View style={styles.resultHeader}>
              <View style={[styles.partyIndicator, { backgroundColor: colors.republican }]} />
              <Text style={[styles.partyName, getWinnerStyle('republican')]}>
                Republican Party
              </Text>
              {results.winningParty === 'republican' && (
                <Ionicons name="trophy" size={16} color={colors.republican} />
              )}
            </View>
            <Text style={[styles.candidateName, getWinnerStyle('republican')]}>
              {results.republican.candidate}
            </Text>
            <View style={styles.voteDetails}>
              <Text style={[styles.voteCount, getWinnerStyle('republican')]}>
                {formatNumber(results.republican.votes)} votes
              </Text>
              <Text style={[styles.percentage, getWinnerStyle('republican')]}>
                {formatPercentage(results.republican.percentage)}
              </Text>
            </View>
          </View>

          {/* Other Results */}
          {results.other && results.other.votes > 0 && (
            <View style={styles.resultRow}>
              <View style={styles.resultHeader}>
                <View style={[styles.partyIndicator, { backgroundColor: colors.other }]} />
                <Text style={[styles.partyName, getWinnerStyle('other')]}>
                  Other/Independent
                </Text>
                {results.winningParty === 'other' && (
                  <Ionicons name="trophy" size={16} color={colors.other} />
                )}
              </View>
              <Text style={[styles.candidateName, getWinnerStyle('other')]}>
                Various Candidates
              </Text>
              <View style={styles.voteDetails}>
                <Text style={[styles.voteCount, getWinnerStyle('other')]}>
                  {formatNumber(results.other.votes)} votes
                </Text>
                <Text style={[styles.percentage, getWinnerStyle('other')]}>
                  {formatPercentage(results.other.percentage)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Summary Statistics */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Election Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Votes Cast:</Text>
            <Text style={styles.summaryValue}>
              {formatNumber(results.totalVotes)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Margin of Victory:</Text>
            <Text style={styles.summaryValue}>
              {(() => {
                const winner = results[results.winningParty];
                const runnerUp = results.winningParty === 'democrat' ? results.republican : results.democrat;
                const margin = winner.percentage - runnerUp.percentage;
                return `${formatPercentage(margin)}`;
              })()}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Election Date:</Text>
            <Text style={styles.summaryValue}>
              {new Date(election.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    marginBottom: 20,
  },
  countyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  electionInfo: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  winnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  winnerIndicator: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginRight: 16,
  },
  winnerContent: {
    flex: 1,
  },
  winnerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  winnerCandidate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  winnerPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  resultsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  resultRow: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  partyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  partyName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 24,
  },
  voteDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 24,
  },
  voteCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  percentage: {
    fontSize: 16,
    fontWeight: '600',
  },
  winnerText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  regularText: {
    color: colors.textSecondary,
  },
  summarySection: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
