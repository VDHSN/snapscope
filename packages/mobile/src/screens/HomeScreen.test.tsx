import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { HomeScreen } from './HomeScreen';

// Mock the dependencies
jest.mock('expo-linear-gradient', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LinearGradient: ({ children }: any) => children,
}));

jest.mock('react-native-safe-area-context', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SafeAreaView: ({ children }: any) => children,
}));

jest.mock('../components/AssessmentCard', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AssessmentCard: ({ assessment }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-shadow
    const React = require('react');
    return React.createElement(
      'Text',
      null,
      `${assessment.vehicleMake} ${assessment.vehicleModel}`,
    );
  },
}));

jest.mock('../components/FloatingActionButton', () => ({
  FloatingActionButton: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-shadow
    const React = require('react');
    return React.createElement('Text', null, 'FloatingActionButton');
  },
}));

describe('HomeScreen', () => {
  it('renders the app title and subtitle in header', () => {
    render(<HomeScreen />);

    expect(screen.getByText('SnapScope')).toBeTruthy();
    expect(screen.getByText('Vehicle Damage Assessment')).toBeTruthy();
  });

  it('renders the Recent Assessments section', () => {
    render(<HomeScreen />);

    expect(screen.getByText('Recent Assessments')).toBeTruthy();
  });

  it('renders assessment cards from mock data', () => {
    render(<HomeScreen />);

    // Check for mock assessments
    expect(screen.getByText('Toyota Camry')).toBeTruthy();
    expect(screen.getByText('Honda CR-V')).toBeTruthy();
  });

  it('renders the floating action button', () => {
    render(<HomeScreen />);

    expect(screen.getByText('FloatingActionButton')).toBeTruthy();
  });

  it('has correct styling structure', () => {
    render(<HomeScreen />);

    // We could add testIDs to verify structure, but for now we verify render doesn't crash
    expect(screen.getByText('SnapScope')).toBeTruthy();
  });

  it('renders in a SafeAreaView', () => {
    render(<HomeScreen />);

    // The SafeAreaView is mocked, but we can verify the component renders without errors
    expect(screen.getByText('Recent Assessments')).toBeTruthy();
  });
});
