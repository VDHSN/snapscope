import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CameraScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera Screen</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
