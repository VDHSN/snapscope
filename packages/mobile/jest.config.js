module.exports = {
  displayName: "SnapScope Mobile",
  testEnvironment: "node",

  // No problematic setup files
  setupFiles: [],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Transform all necessary modules
  transformIgnorePatterns: [
    "node_modules/(?!(expo|@expo|react-native|@react-native|expo-modules-core|expo-router)/)",
  ],

  // Transform configuration
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@screens/(.*)$": "<rootDir>/src/screens/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx,js,jsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/metro.config.js",
    "!**/jest.config.js",
    "!app/_layout.tsx", // Exclude routing boilerplate
  ],
};
