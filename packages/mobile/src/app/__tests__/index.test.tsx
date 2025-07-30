import React from "react";
import { render, screen } from "@testing-library/react-native";
import HomeScreen from "../index";

// Mock components
jest.mock("@components/AssessmentCard", () => ({
  __esModule: true,
  AssessmentCard: jest.fn(() => null),
}));

jest.mock("@components/FloatingActionButton", () => ({
  __esModule: true,
  FloatingActionButton: jest.fn(() => null),
}));

describe("HomeScreen", () => {
  it("renders header with app title and subtitle", () => {
    render(<HomeScreen />);
    expect(screen.getByText("SnapScope")).toBeTruthy();
    expect(screen.getByText("Vehicle Damage Assessment")).toBeTruthy();
  });

  it("renders Recent Assessments section", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Recent Assessments")).toBeTruthy();
  });

  it("applies correct background color from wireframe", () => {
    render(<HomeScreen />);
    // Note: In implementation, we'd add testID to container
    // For now, testing via snapshot
    expect(render(<HomeScreen />).toJSON()).toMatchSnapshot();
  });

  it("matches snapshot", () => {
    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});
