import { Theme } from '../contexts/ThemeContext';

export function getThemeClasses(theme: Theme) {
  const colorMap: Record<string, Record<string, string>> = {
    blue: {
      primary: 'blue-600',
      primaryDark: 'blue-700',
      primaryLight: 'blue-50',
      activeBg: 'blue-50',
      activeText: 'blue-700',
      activeBorder: 'blue-700',
      sidebarHeader: 'from-blue-600 to-blue-700',
      cardBorder: 'border-blue-100',
    },
    purple: {
      primary: 'purple-600',
      primaryDark: 'purple-700',
      primaryLight: 'purple-50',
      activeBg: 'purple-50',
      activeText: 'purple-700',
      activeBorder: 'purple-700',
      sidebarHeader: 'from-purple-600 to-purple-700',
      cardBorder: 'border-purple-100',
    },
    green: {
      primary: 'green-600',
      primaryDark: 'green-700',
      primaryLight: 'green-50',
      activeBg: 'green-50',
      activeText: 'green-700',
      activeBorder: 'green-700',
      sidebarHeader: 'from-green-600 to-green-700',
      cardBorder: 'border-green-100',
    },
    orange: {
      primary: 'orange-600',
      primaryDark: 'orange-700',
      primaryLight: 'orange-50',
      activeBg: 'orange-50',
      activeText: 'orange-700',
      activeBorder: 'orange-700',
      sidebarHeader: 'from-orange-600 to-orange-700',
      cardBorder: 'border-orange-100',
    },
    red: {
      primary: 'red-600',
      primaryDark: 'red-700',
      primaryLight: 'red-50',
      activeBg: 'red-50',
      activeText: 'red-700',
      activeBorder: 'red-700',
      sidebarHeader: 'from-red-600 to-red-700',
      cardBorder: 'border-red-100',
    },
    indigo: {
      primary: 'indigo-600',
      primaryDark: 'indigo-700',
      primaryLight: 'indigo-50',
      activeBg: 'indigo-50',
      activeText: 'indigo-700',
      activeBorder: 'indigo-700',
      sidebarHeader: 'from-indigo-600 to-indigo-700',
      cardBorder: 'border-indigo-100',
    },
  };

  return colorMap[theme.name] || colorMap.blue;
}
