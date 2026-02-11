import { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeName = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'indigo' | 'black' | 'pink' | 'teal' | 'white';

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
  black: {
    name: 'black',
    displayName: 'Black',
    colors: {
      primary: 'gray-900',
      primaryDark: 'black',
      primaryLight: 'gray-50',
      sidebarBg: 'from-gray-900 to-black',
      sidebarHeader: 'from-gray-900 to-black',
      cardBg: 'white',
      cardBorder: 'border-gray-200',
      pageBg: 'gray-50',
      textPrimary: 'gray-900',
      textSecondary: 'gray-600',
      activeBg: 'white',
      activeText: 'gray-900',
      hoverBg: 'gray-50',
    },
  },
  pink: {
    name: 'pink',
    displayName: 'Pink',
    colors: {
      primary: 'pink-600',
      primaryDark: 'pink-700',
      primaryLight: 'pink-50',
      sidebarBg: 'from-pink-600 to-pink-700',
      sidebarHeader: 'from-pink-600 to-pink-700',
      cardBg: 'white',
      cardBorder: 'border-pink-100',
      pageBg: 'pink-50',
      textPrimary: 'gray-900',
      textSecondary: 'gray-600',
      activeBg: 'white',
      activeText: 'pink-600',
      hoverBg: 'gray-50',
    },
  },
  teal: {
    name: 'teal',
    displayName: 'Teal',
    colors: {
      primary: 'teal-600',
      primaryDark: 'teal-700',
      primaryLight: 'teal-50',
      sidebarBg: 'from-teal-600 to-teal-700',
      sidebarHeader: 'from-teal-600 to-teal-700',
      cardBg: 'white',
      cardBorder: 'border-teal-100',
      pageBg: 'teal-50',
      textPrimary: 'gray-900',
      textSecondary: 'gray-600',
      activeBg: 'white',
      activeText: 'teal-600',
      hoverBg: 'gray-50',
    },
  },
  white: {
    name: 'white',
    displayName: 'White',
    colors: {
      primary: 'gray-900',
      primaryDark: 'black',
      primaryLight: 'gray-50',
      sidebarBg: 'bg-white border-r border-gray-300',
      sidebarHeader: 'bg-white border-b border-gray-300',
      cardBg: 'white',
      cardBorder: 'border-gray-200',
      pageBg: 'gray-50',
      textPrimary: 'gray-900',
      textSecondary: 'gray-600',
      activeBg: 'gray-100',
      activeText: 'gray-900',
      hoverBg: 'gray-50',
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: Theme[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    // Load theme from localStorage or default to blue
    const savedTheme = localStorage.getItem('app-theme') as ThemeName;
    return savedTheme && themes[savedTheme] ? savedTheme : 'blue';
  });

  // Commented out dark mode functionality
  // const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
  //   // Load dark mode preference from localStorage or default to false
  //   const savedDarkMode = localStorage.getItem('app-dark-mode');
  //   return savedDarkMode === 'true';
  // });

  // Apply dark mode class to document root
  // useEffect(() => {
  //   if (isDarkMode) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, [isDarkMode]);

  // Set isDarkMode to false (disabled)
  const isDarkMode = false;

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    localStorage.setItem('app-theme', newThemeName);
  };

  // Commented out dark mode toggle
  // const toggleDarkMode = () => {
  //   const newDarkMode = !isDarkMode;
  //   setIsDarkMode(newDarkMode);
  //   localStorage.setItem('app-dark-mode', String(newDarkMode));
  // };

  const toggleDarkMode = () => {
    // Dark mode is disabled
  };

  const theme = themes[themeName];
  const availableThemes = Object.values(themes);

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, availableThemes, isDarkMode, toggleDarkMode }}>
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
