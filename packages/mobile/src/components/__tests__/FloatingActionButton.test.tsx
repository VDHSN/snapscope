import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FloatingActionButton } from "../FloatingActionButton";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("FloatingActionButton", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders plus icon", () => {
    const { getByText } = render(<FloatingActionButton />);
    expect(getByText("+")).toBeTruthy();
  });

  it("navigates to camera screen when pressed", () => {
    const { getByText } = render(<FloatingActionButton />);
    fireEvent.press(getByText("+"));
    expect(mockPush).toHaveBeenCalledWith("./camera");
  });

  it("matches wireframe styling with correct positioning", () => {
    const { toJSON } = render(<FloatingActionButton />);
    expect(toJSON()).toMatchSnapshot();
  });
});
