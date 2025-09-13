export interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  startOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
  notifications: {
    enabled: boolean;
    reminders: boolean;
    updates: boolean;
  };
}

export interface SettingsContextType {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  updateNotificationSettings: (settings: UserPreferences["notifications"]) => void;
}
