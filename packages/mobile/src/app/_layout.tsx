import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "SnapScope",
          headerShown: false, // Hide header for custom design
        }}
      />
      <Stack.Screen
        name="camera"
        options={{
          title: "Camera",
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default RootLayout;
