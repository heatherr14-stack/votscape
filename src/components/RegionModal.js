import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../utils/colors';
import { 
  getWinningParty, 
  formatVotePercentage, 
  formatVoteCount 
} from '../utils/votingData';

export default function RegionModal({ visible, region, onClose }) {
  if (!region) return null;

  const { name, data } = region;
  const winningParty = getWinningParty(data);

  const getPartyColor = (party) => {
    switch (party) {
      case 'democrat':
        return colors.democrat;
      case 'republican':
        return colors.republican;
      case 'independent':
        return colors.independent;
      default:
        return colors.other;
    }
  };

  const renderVoteBreakdown = () => {
    const parties = [
      { key: 'democrat', label: 'Democratic', value: data.democrat },
      { key: 'republican', label: 'Republican', value: data.republican },
      { key: 'other', label: 'Other/Independent', value: data.other || 0 },
    ];

    return parties.map((party) => (
      <View key={party.key} style={styles.voteRow}>
        <View style={styles.voteInfo}>
          <View 
            style={[
              styles.partyIndicator, 
              { backgroundColor: getPartyColor(party.key) }
            ]} 
          />
          <Text style={styles.partyLabel}>{party.label}</Text>
        </View>
        <View style={styles.voteNumbers}>
          <Text style={styles.percentage}>
            {formatVotePercentage(party.value)}
          </Text>
          <Text style={styles.voteCount}>
            {formatVoteCount(Math.round((party.value / 100) * data.totalVotes))} votes
          </Text>
        </View>
      </View>
    ));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Election Results</Text>
              <View style={styles.winnerInfo}>
                <View 
                  style={[
                    styles.winnerIndicator, 
                    { backgroundColor: getPartyColor(winningParty) }
                  ]} 
                />
                <Text style={styles.winnerText}>
                  {winningParty.charAt(0).toUpperCase() + winningParty.slice(1)} Won
                </Text>
                <Text style={styles.winnerPercentage}>
                  {formatVotePercentage(data[winningParty])}
                </Text>
              </View>
            </View>

            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Vote Breakdown</Text>
              {renderVoteBreakdown()}
              
              <View style={styles.totalVotes}>
                <Text style={styles.totalLabel}>Total Votes Cast:</Text>
                <Text style={styles.totalNumber}>
                  {formatVoteCount(data.totalVotes)}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>About This Data</Text>
              <Text style={styles.infoText}>
                This data represents official election results for {name}. 
                Results are sourced from certified election authorities and 
                are provided for educational purposes.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  winnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  winnerIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  winnerText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  winnerPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  breakdownCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 16,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  voteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  voteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  partyLabel: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  voteNumbers: {
    alignItems: 'flex-end',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  voteCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  totalVotes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: colors.lightGray,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
