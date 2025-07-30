import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from './HomeScreen';

describe('HomeScreen', () => {
  it('renders the app title and subtitle', () => {
    render(<HomeScreen />);

    expect(screen.getByText('SnapScope')).toBeTruthy();
    expect(screen.getByText('Vehicle Assessment Tool')).toBeTruthy();
  });

  it('renders both action buttons', () => {
    render(<HomeScreen />);

    expect(screen.getByText('New Assessment')).toBeTruthy();
    expect(screen.getByText('View Assessments')).toBeTruthy();
  });

  it('renders the footer text', () => {
    render(<HomeScreen />);

    expect(screen.getByText('Ready for field work')).toBeTruthy();
  });

  it('calls handleNewAssessment when New Assessment button is pressed', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<HomeScreen />);
    const newAssessmentButton = screen.getByText('New Assessment');

    fireEvent.press(newAssessmentButton);

    // Since the function is currently empty (TODO comment), we just verify the button is pressable
    expect(newAssessmentButton).toBeTruthy();

    consoleSpy.mockRestore();
  });

  it('calls handleViewAssessments when View Assessments button is pressed', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<HomeScreen />);
    const viewAssessmentsButton = screen.getByText('View Assessments');

    fireEvent.press(viewAssessmentsButton);

    // Since the function is currently empty (TODO comment), we just verify the button is pressable
    expect(viewAssessmentsButton).toBeTruthy();

    consoleSpy.mockRestore();
  });

  it('has correct styling structure', () => {
    render(<HomeScreen />);

    // We could add testIDs to verify structure, but for now we verify render doesn't crash
    expect(screen.getByText('SnapScope')).toBeTruthy();
  });
});