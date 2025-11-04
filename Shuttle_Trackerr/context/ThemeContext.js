import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as designColors } from '../design/colors';
import { shadows, shadowsDark } from '../design/shadows';

const ThemeContext = createContext({});

const darkTheme = {
  mode: 'dark',
  primary: designColors.primary,
  primaryDark: designColors.primaryDark,
  primaryLight: designColors.primaryLight,
  secondary: designColors.secondary,
  secondaryDark: designColors.secondaryDark,
  secondaryLight: designColors.secondaryLight,
  accent: designColors.accent,
  accentDark: designColors.accentDark,
  accentLight: designColors.accentLight,
  success: designColors.success,
  warning: designColors.warning,
  error: designColors.error,
  info: designColors.info,
  background: designColors.dark.background,
  surface: designColors.dark.surface,
  surfaceElevated: designColors.dark.surfaceElevated,
  cardBg: designColors.dark.card,
  text: designColors.dark.text,
  textSecondary: designColors.dark.textSecondary,
  textTertiary: designColors.dark.textTertiary,
  border: designColors.dark.border,
  borderLight: designColors.dark.borderLight,
  divider: designColors.dark.divider,
  shadow: designColors.dark.shadow,
  shadowStrong: designColors.dark.shadowStrong,
  overlay: designColors.dark.overlay,
  tabBarBg: designColors.dark.tabBarBg,
  tabBarActive: designColors.dark.tabBarActive,
  tabBarInactive: designColors.dark.tabBarInactive,
  shadows: shadowsDark,
};

// Light theme using design system
const lightTheme = {
  mode: 'light',
  primary: designColors.primary,
  primaryDark: designColors.primaryDark,
  primaryLight: designColors.primaryLight,
  secondary: designColors.secondary,
  secondaryDark: designColors.secondaryDark,
  secondaryLight: designColors.secondaryLight,
  accent: designColors.accent,
  accentDark: designColors.accentDark,
  accentLight: designColors.accentLight,
  success: designColors.success,
  warning: designColors.warning,
  error: designColors.error,
  info: designColors.info,
  background: designColors.light.background,
  surface: designColors.light.surface,
  surfaceElevated: designColors.light.surfaceElevated,
  cardBg: designColors.light.card,
  text: designColors.light.text,
  textSecondary: designColors.light.textSecondary,
  textTertiary: designColors.light.textTertiary,
  border: designColors.light.border,
  borderLight: designColors.light.borderLight,
  divider: designColors.light.divider,
  shadow: designColors.light.shadow,
  shadowStrong: designColors.light.shadowStrong,
  overlay: designColors.light.overlay,
  tabBarBg: designColors.light.tabBarBg,
  tabBarActive: designColors.light.tabBarActive,
  tabBarInactive: designColors.light.tabBarInactive,
  shadows: shadows,
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme,
        colors: { ...currentTheme, isDark },
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

