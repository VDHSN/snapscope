import React from "react";
import { render, screen } from "@testing-library/react-native";
import { HomeScreenAssessment } from "@types/Assessment";
import { AssessmentCard } from "../AssessmentCard";

const mockAssessment: HomeScreenAssessment = {
  id: "1",
  vehicleMake: "Toyota",
  vehicleModel: "Camry",
  vin: "4T1B11HK5JU123456",
  timestamp: new Date("2023-01-01T10:00:00Z"),
  status: "done",
  vehicleEmoji: "🚗",
};

describe("AssessmentCard", () => {
  it("renders vehicle information correctly", () => {
    render(<AssessmentCard assessment={mockAssessment} />);
    expect(screen.getByText("Toyota Camry")).toBeTruthy();
    expect(screen.getByText("VIN: 4T1B11HK5JU...")).toBeTruthy();
    expect(screen.getByText("🚗")).toBeTruthy();
  });

  it("shows correct status badge for done status", () => {
    render(<AssessmentCard assessment={mockAssessment} />);
    expect(screen.getByText("Done")).toBeTruthy();
  });

  it("shows correct status badge for in-progress status", () => {
    const inProgressAssessment = {
      ...mockAssessment,
      status: "in-progress" as const,
    };
    render(<AssessmentCard assessment={inProgressAssessment} />);
    expect(screen.getByText("In Progress")).toBeTruthy();
  });

  it("formats timestamp correctly", () => {
    render(<AssessmentCard assessment={mockAssessment} />);
    // Will show relative time based on mock date
    expect(screen.getByText(/hours ago|Yesterday/)).toBeTruthy();
  });

  it("matches wireframe styling", () => {
    const { toJSON } = render(<AssessmentCard assessment={mockAssessment} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
