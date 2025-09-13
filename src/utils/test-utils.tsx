import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <NavigationContainer>{children}</NavigationContainer>
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react-native";

// override render method
export { customRender as render };
