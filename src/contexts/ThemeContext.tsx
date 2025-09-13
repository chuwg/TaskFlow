import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import type { ThemeContextType, ThemeMode } from "@/types/theme";

const defaultTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6200ee",
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  themeMode: "system",
  setThemeMode: () => {},
  setPrimaryColor: () => {},
  toggleUseSystemFont: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [primaryColor, setPrimaryColor] = useState("#6200ee");
  const [useSystemFont, setUseSystemFont] = useState(true);

  const getTheme = () => {
    const baseTheme =
      themeMode === "system"
        ? colorScheme === "dark"
          ? MD3DarkTheme
          : MD3LightTheme
        : themeMode === "dark"
        ? MD3DarkTheme
        : MD3LightTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: primaryColor,
      },
    };
  };

  const toggleUseSystemFont = () => {
    setUseSystemFont((prev) => !prev);
  };

  const value = {
    theme: getTheme(),
    themeMode,
    setThemeMode,
    setPrimaryColor,
    toggleUseSystemFont,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
