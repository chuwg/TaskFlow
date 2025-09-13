import React, { createContext, useContext, useState } from "react";
import type { SettingsContextType, UserPreferences } from "@/types/settings";

const defaultPreferences: UserPreferences = {
  language: "ko",
  timezone: "Asia/Seoul",
  dateFormat: "YYYY-MM-DD",
  timeFormat: "24h",
  startOfWeek: 0,
  notifications: {
    enabled: true,
    reminders: true,
    updates: true,
  },
};

const SettingsContext = createContext<SettingsContextType>({
  preferences: defaultPreferences,
  updatePreference: () => {},
  updateNotificationSettings: () => {},
});

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNotificationSettings = (
    settings: UserPreferences["notifications"]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: settings,
    }));
  };

  const value = {
    preferences,
    updatePreference,
    updateNotificationSettings,
  };

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
};
