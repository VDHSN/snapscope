import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AssessmentCard } from "@components/AssessmentCard";
import { FloatingActionButton } from "@components/FloatingActionButton";
import { mockAssessments } from "../types/Assessment";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B5CF6" />

      {/* Header with gradient background */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>SnapScope</Text>
        <Text style={styles.appSubtitle}>Vehicle Damage Assessment</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recent Assessments</Text>

        {mockAssessments.map((assessment) => (
          <AssessmentCard key={assessment.id} assessment={assessment} />
        ))}
      </ScrollView>

      <FloatingActionButton />

      {/* Bottom navigation hint */}
      <View style={styles.bottomHint} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6D3",
  },
  header: {
    height: 120,
    backgroundColor: "#8B5CF6", // Fallback for RN, gradient would be applied via libraries
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F1F1F",
    marginBottom: 30,
  },
  bottomHint: {
    width: 110,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#1F1F1F",
    opacity: 0.2,
    alignSelf: "center",
    marginBottom: 15,
  },
});
