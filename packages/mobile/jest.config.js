module.exports = {
  displayName: 'SnapScope Mobile',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@unimodules|react-native-vector-icons|react-native-gesture-handler|react-native-reanimated|react-native-screens|react-native-safe-area-context)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
  },
  testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx,js,jsx}',
  ],
  preset: undefined, // Don't use jest-expo preset to avoid React Native setup conflicts
};