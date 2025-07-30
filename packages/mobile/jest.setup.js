// Jest setup for React Native testing without Expo preset

// Mock React Native core
jest.mock('react-native', () => {
  const React = require('react');

  const mockComponent = (name) => jest.fn(({ children, ...props }) =>
    React.createElement(name, props, children)
  );

  return {
    View: mockComponent('View'),
    Text: mockComponent('Text'),
    TouchableOpacity: jest.fn(({ children, onPress, ...props }) => {
      const element = React.createElement('TouchableOpacity', {
        ...props,
        onClick: onPress // Map onPress to onClick for testing
      }, children);
      return element;
    }),
    ScrollView: mockComponent('ScrollView'),
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((styles) => styles),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn((options) => options.ios || options.default),
    },
  };
});

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: jest.fn(() => null),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({}));