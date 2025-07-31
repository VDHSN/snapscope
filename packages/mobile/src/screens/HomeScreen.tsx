import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AssessmentCard } from '../components/AssessmentCard';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { mockAssessments } from '../types/Assessment';
import { Colors } from '../constants/Colors';

interface HomeScreenProps {
  // Navigation props will be added when we implement navigation
}

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    background: isDark ? Colors.dark.background : Colors.light.background,
    text: {
      primary: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
      secondary: isDark ? Colors.dark.text.secondary : Colors.light.text.secondary,
    },
    gradient: isDark ? Colors.gradients.header.dark : Colors.gradients.header.light,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header with gradient */}
      <LinearGradient
        colors={theme.gradient}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>SnapScope</Text>
        <Text style={styles.headerSubtitle}>Vehicle Damage Assessment</Text>
      </LinearGradient>

      {/* Main content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Recent Assessments</Text>

        {/* Assessment Cards */}
        <View style={styles.cardsContainer}>
          {mockAssessments.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100, // Space for FAB
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  cardsContainer: {
    gap: 16,
  },
});

export default HomeScreen;
