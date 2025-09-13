import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useThemeContext } from "./src/contexts/ThemeContext";
import { SettingsProvider } from "./src/contexts/SettingsContext";
import * as Font from 'expo-font';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

const AppContent = () => {
  const { theme } = useThemeContext();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'System': require('expo-font/build/FontLoader').default,
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn('Error loading fonts:', e);
        // 폰트 로드 실패시에도 앱은 실행되도록 함
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <View />; // 로딩 중에는 빈 화면 표시
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}