import { MD3Theme } from "react-native-paper";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemePreferences {
  mode: ThemeMode;
  primaryColor: string;
  useSystemFont: boolean;
}

export interface ThemeContextType {
  theme: MD3Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: string) => void;
  toggleUseSystemFont: () => void;
}
