import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HomeScreenAssessment } from "../types/Assessment";

interface AssessmentCardProps {
  assessment: HomeScreenAssessment;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
}) => {
  const getStatusColor = (status: HomeScreenAssessment["status"]) => {
    switch (status) {
      case "done":
        return "#10B981";
      case "in-progress":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: HomeScreenAssessment["status"]) => {
    switch (status) {
      case "done":
        return "Done";
      case "in-progress":
        return "In Progress";
      default:
        return "Draft";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60),
    );

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
    return "Yesterday";
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              assessment.status === "done" ? "#8B5CF6" : "#F59E0B",
          },
        ]}
      >
        <Text style={styles.vehicleEmoji}>{assessment.vehicleEmoji}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.vehicleTitle}>
          {assessment.vehicleMake} {assessment.vehicleModel}
        </Text>
        <Text style={styles.vin}>
          VIN: {assessment.vin.substring(0, 11)}...
        </Text>
        <Text style={styles.timestamp}>
          {formatTimestamp(assessment.timestamp)}
        </Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(assessment.status) },
        ]}
      >
        <Text style={styles.statusText}>
          {getStatusText(assessment.status)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    opacity: 0.1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  vehicleEmoji: {
    fontSize: 18,
    opacity: 1,
  },
  content: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F1F1F",
    marginBottom: 4,
  },
  vin: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
});
