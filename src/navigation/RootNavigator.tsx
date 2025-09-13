import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTabNavigator } from "./MainTabNavigator";
import { useTheme } from "react-native-paper";

// 임시 스크린 컴포넌트들
import { View, Text } from "react-native";
const TempScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>{name} Screen</Text>
  </View>
);

const SettingsScreen = () => <TempScreen name="Settings" />;
const ProfileScreen = () => <TempScreen name="Profile" />;

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
