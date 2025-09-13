import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { RootNavigator } from "./src/navigation/RootNavigator.js";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useThemeContext } from "./src/contexts/ThemeContext.js";
import { SettingsProvider } from "./src/contexts/SettingsContext.js";
import { CalendarProvider } from "./src/contexts/CalendarContext.js";
import { TodoProvider } from "./src/contexts/TodoContext.js";
import { FinanceProvider } from "./src/contexts/FinanceContext.js";
import { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import * as Font from 'expo-font';

// TurboModule 에러 방지를 위한 폴리필
declare global {
  var HermesInternal: any;
}

if (typeof global.HermesInternal === 'undefined') {
  (global as any).HermesInternal = null;
}

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
        // 기본 시스템 폰트만 로드하거나 폰트 로딩을 생략
        setFontsLoaded(true);
      } catch (e) {
        console.warn('Error loading fonts:', e);
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <CalendarProvider>
            <TodoProvider>
              <FinanceProvider>
                <AppContent />
              </FinanceProvider>
            </TodoProvider>
          </CalendarProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}