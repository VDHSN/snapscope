// Define globals for React Native environment
// eslint-disable-next-line no-underscore-dangle
global.__DEV__ = true;

// Mock React Native core modules
jest.mock("react-native", () => {
  const React = require("react");

  const mockComponent = (name) =>
    jest.fn(({ children, ...props }) =>
      React.createElement(name, props, children),
    );

  return {
    // Core components
    View: mockComponent("View"),
    Text: mockComponent("Text"),
    TouchableOpacity: mockComponent("TouchableOpacity"),
    ScrollView: mockComponent("ScrollView"),
    Image: mockComponent("Image"),
    TextInput: mockComponent("TextInput"),
    SafeAreaView: mockComponent("SafeAreaView"),
    FlatList: mockComponent("FlatList"),

    // StyleSheet mock
    StyleSheet: {
      create: jest.fn((styles) => styles),
      hairlineWidth: 1,
      absoluteFill: {},
    },

    // Dimensions mock
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },

    // Platform mock
    Platform: {
      OS: "ios",
      Version: "16.0",
      select: jest.fn((options) => options.ios || options.default),
      isPad: false,
      isTVOS: false,
    },

    // Alert mock
    Alert: {
      alert: jest.fn(),
      prompt: jest.fn(),
    },
  };
});

// Mock expo-modules-core to avoid ES module issues
jest.mock("expo-modules-core", () => ({
  EventEmitter: jest.fn(),
  NativeModule: jest.fn(),
  SharedObject: jest.fn(),
  SharedRef: jest.fn(),
}));

// Mock expo-router for React Native environment
jest.mock("expo-router", () => {
  const React = require("react");
  return {
    Stack: {
      Screen: jest.fn(({ children }) =>
        React.createElement("View", null, children),
      ),
    },
    useRouter: () => ({
      push: jest.fn(),
      back: jest.fn(),
      replace: jest.fn(),
      navigate: jest.fn(),
    }),
    useLocalSearchParams: () => ({}),
    useSegments: () => [],
    usePathname: () => "/",
    router: {
      push: jest.fn(),
      back: jest.fn(),
      replace: jest.fn(),
    },
  };
});

// Mock expo-status-bar
jest.mock("expo-status-bar", () => {
  const React = require("react");
  return {
    StatusBar: jest.fn(() => React.createElement("View")),
  };
});

// Silence specific warnings during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0] &&
    typeof args[0] === "string" &&
    args[0].includes("React does not recognize")
  ) {
    return;
  }
  originalWarn(...args);
};
