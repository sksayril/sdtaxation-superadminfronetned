import { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeName = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'indigo';

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    sidebarBg: string;
    sidebarHeader: string;
    cardBg: string;
    cardBorder: string;
    pageBg: string;
    textPrimary: string;
    textSecondary: string;
    activeBg: string;
    activeText: string;
    hoverBg: string;
  };
}

const themes: Record<ThemeName, Theme> = {
  blue: {
    name: 'blue',
    displayName: 'Blue',
    colors: {
      primary: 'blue-600',
      primaryDark: 'blue-700',
      primaryLight: 'blue-50',
      sidebarBg: 'from-blue-600 to-blue-700',
      sidebarHeader: 'from-blue-600 to-blue-700',
      cardBg: 'white',
      cardBorder: 'border-blue-100',
      pageBg: 'blue-50',
      textPrimary: 'gray-900',
      textSecondary: 'gray-600',
      activeBg: 'white',
      activeText: 'blue-600',
      hoverBg: 'gray-50',
    },
  },
  purple: {
    name: 'purple',
    displayName: 'Purple',
    colors: {
      primary: 'purple-600',
      primaryDark: 'purple-700',
      primaryLight: 'purple-50',
      sidebarBg: 'from-purple-600 to-purple-700',
      sidebarHeader: 'from-purple-600 to-purple-700',
      cardBg: 'white',
      cardBorder: 'border-purple-100',
      pageBg: 'purple-50',
      textPrimary: 'gray-900',
      textSecondary: 'gray-600',
      activeBg: 'white',
      activeText: 'purple-600',
      hoverBg: 'gray-50',
    },
  },
  green: {
    name: 'green',
    displayName: 'Green',
    colors: {
      primary: 'green-600',
      primaryDark: 'green-700',
      primaryLight: 'green-50',
      sidebarBg: 'from-green-600 to-green-700',
      sidebarHeader: 'from-green-600 to-green-700',
      cardBg: 'white',
      cardBorder: 'border-green-100',
      pageBg: 'green-50',
      textPrimary: 'gray-900',
      textSecondary: 'gray-600',
      activeBg: 'white',
      activeText: 'green-600',
      hoverBg: 'gray-50',
    },
  },
  orange: {
    name: 'orange',
    displayName: 'Orange',
    colors: {
      primary: 'orange-600',
      primaryDark: 'orange-700',
      primaryLight: 'orange-50',
      sidebarBg: 'from-orange-600 to-orange-700',
      sidebarHeader: 'from-orange-600 to-orange-700',
      cardBg: 'white',
      cardBorder: 'border-orange-100',
      pageBg: 'orange-50',
      textPrimary: 'gray-900',
      textSecondary: 'gray-600',
      activeBg: 'white',
      activeText: 'orange-600',
      hoverBg: 'gray-50',
    },
  },
  red: {
    name: 'red',
    displayName: 'Red',
    colors: {
      primary: 'red-600',
      primaryDark: 'red-700',
      primaryLight: 'red-50',
      sidebarBg: 'from-red-600 to-red-700',
      sidebarHeader: 'from-red-600 to-red-700',
      cardBg: 'white',
      cardBorder: 'border-red-100',
      pageBg: 'red-50',
      textPrimary: 'gray-900',
      textSecondary: 'gray-600',
      activeBg: 'white',
      activeText: 'red-600',
      hoverBg: 'gray-50',
    },
  },
  indigo: {
    name: 'indigo',
    displayName: 'Indigo',
    colors: {
      primary: 'indigo-600',
      primaryDark: 'indigo-700',
      primaryLight: 'indigo-50',
      sidebarBg: 'from-indigo-600 to-indigo-700',
      sidebarHeader: 'from-indigo-600 to-indigo-700',
      cardBg: 'white',
      cardBorder: 'border-indigo-100',
      pageBg: 'indigo-50',
      textPrimary: 'gray-900',
      textSecondary: 'gray-600',
      activeBg: 'white',
      activeText: 'indigo-600',
      hoverBg: 'gray-50',
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    // Load theme from localStorage or default to blue
    const savedTheme = localStorage.getItem('app-theme') as ThemeName;
    return savedTheme && themes[savedTheme] ? savedTheme : 'blue';
  });

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    localStorage.setItem('app-theme', newThemeName);
  };

  const theme = themes[themeName];
  const availableThemes = Object.values(themes);

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
