import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { HomeScreenAssessment } from '../types/Assessment';
import { Colors } from '../constants/Colors';

interface AssessmentCardProps {
  assessment: HomeScreenAssessment;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getStatusColor = (status: HomeScreenAssessment['status']) => {
    switch (status) {
      case 'done':
        return Colors.success;
      case 'in-progress':
        return Colors.warning;
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: HomeScreenAssessment['status']) => {
    switch (status) {
      case 'done':
        return 'Done';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Draft';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
    return 'Yesterday';
  };

  const backgroundColor = isDark ? Colors.dark.surface : Colors.white;
  const titleColor = isDark ? Colors.dark.text.primary : Colors.light.text.primary;
  const subtitleColor = isDark ? Colors.dark.text.secondary : Colors.light.text.secondary;
  const iconBgColor = assessment.status === 'done' ? Colors.primary.purple : Colors.warning;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconBgColor,
          },
        ]}
      >
        <Text style={styles.vehicleEmoji}>{assessment.vehicleEmoji}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.vehicleTitle, { color: titleColor }]}>
          {assessment.vehicleMake} {assessment.vehicleModel}
        </Text>
        <Text style={[styles.vin, { color: subtitleColor }]}>
          VIN: {assessment.vin.substring(0, 11)}...
        </Text>
        <Text style={[styles.timestamp, { color: subtitleColor }]}>
          {formatTimestamp(assessment.timestamp)}
        </Text>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(assessment.status) }]}>
        <Text style={styles.statusText}>{getStatusText(assessment.status)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    opacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  vehicleEmoji: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  vin: {
    fontSize: 14,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
});
