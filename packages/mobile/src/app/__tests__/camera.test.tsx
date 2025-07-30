import React from "react";
import { render, screen } from "@testing-library/react-native";
import CameraScreen from "../camera";

describe("CameraScreen", () => {
  it("renders placeholder camera screen", () => {
    render(<CameraScreen />);
    expect(screen.getByText("Camera Screen")).toBeTruthy();
    expect(screen.getByText("Coming Soon")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = render(<CameraScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});
