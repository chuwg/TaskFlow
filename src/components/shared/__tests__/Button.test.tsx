import React from "react";
import { render, fireEvent } from "@/utils/test-utils";
import { Button } from "../Button";

describe("Button Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <Button onPress={() => {}}>Test Button</Button>
    );
    expect(getByText("Test Button")).toBeTruthy();
  });

  it("handles press events", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button onPress={onPressMock}>Test Button</Button>
    );

    fireEvent.press(getByText("Test Button"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("renders in disabled state", () => {
    const { getByText } = render(
      <Button onPress={() => {}} disabled>
        Test Button
      </Button>
    );
    
    const button = getByText("Test Button").parent;
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it("renders with loading state", () => {
    const { getByTestId } = render(
      <Button onPress={() => {}} loading>
        Test Button
      </Button>
    );
    
    expect(getByTestId("button-loading-indicator")).toBeTruthy();
  });
});
