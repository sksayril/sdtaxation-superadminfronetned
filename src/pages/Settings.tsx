import React from 'react';
import Layout from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, Check } from 'lucide-react';

export default function Settings() {
  const { theme, themeName, setTheme, availableThemes } = useTheme();

  const getThemeColorClass = (themeName: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-600',
      purple: 'bg-purple-600',
      green: 'bg-green-600',
      orange: 'bg-orange-600',
      red: 'bg-red-600',
      indigo: 'bg-indigo-600',
    };
    return colorMap[themeName] || 'bg-blue-600';
  };

  const getThemeBorderClass = (themeName: string) => {
    const borderMap: Record<string, string> = {
      blue: 'border-blue-100',
      purple: 'border-purple-100',
      green: 'border-green-100',
      orange: 'border-orange-100',
      red: 'border-red-100',
      indigo: 'border-indigo-100',
    };
    return borderMap[themeName] || 'border-blue-100';
  };

  const getThemeLightClass = (themeName: string) => {
    const lightMap: Record<string, string> = {
      blue: 'bg-blue-50',
      purple: 'bg-purple-50',
      green: 'bg-green-50',
      orange: 'bg-orange-50',
      red: 'bg-red-50',
      indigo: 'bg-indigo-50',
    };
    return lightMap[themeName] || 'bg-blue-50';
  };

  const getThemeTextClass = (themeName: string) => {
    const textMap: Record<string, string> = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      indigo: 'text-indigo-600',
    };
    return textMap[themeName] || 'text-blue-600';
  };

  const getThemeBorderActiveClass = (themeName: string) => {
    const borderMap: Record<string, string> = {
      blue: 'border-blue-600',
      purple: 'border-purple-600',
      green: 'border-green-600',
      orange: 'border-orange-600',
      red: 'border-red-600',
      indigo: 'border-indigo-600',
    };
    return borderMap[themeName] || 'border-blue-600';
  };

  return (
    <Layout title="Settings">
      <div className="space-y-6">
        {/* Theme Selection */}
        <div className={`bg-white rounded-xl shadow-sm p-6 border ${getThemeBorderClass(themeName)}`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-lg ${getThemeLightClass(themeName)}`}>
              <Palette className={getThemeTextClass(themeName)} size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Theme Settings</h2>
              <p className="text-sm text-gray-600">Choose your preferred color theme</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableThemes.map((availableTheme) => {
              const isSelected = themeName === availableTheme.name;
              return (
                <button
                  key={availableTheme.name}
                  onClick={() => setTheme(availableTheme.name)}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all duration-200
                    ${isSelected 
                      ? `${getThemeBorderActiveClass(availableTheme.name)} ${getThemeLightClass(availableTheme.name)}` 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`w-12 h-12 rounded-full ${getThemeColorClass(availableTheme.name)}`} />
                    <span className={`font-semibold text-sm ${
                      isSelected 
                        ? getThemeTextClass(availableTheme.name)
                        : 'text-gray-700'
                    }`}>
                      {availableTheme.displayName}
                    </span>
                    {isSelected && (
                      <div className={`absolute top-2 right-2 p-1 rounded-full ${getThemeColorClass(availableTheme.name)}`}>
                        <Check className="text-white" size={16} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Current Theme:</strong> {theme.displayName}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              The theme will be applied to the sidebar, cards, and page elements throughout the application.
            </p>
          </div>
        </div>

        {/* Additional Settings Placeholder */}
        <div className={`bg-white rounded-xl shadow-sm p-6 border ${getThemeBorderClass(themeName)}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Other Settings</h2>
          <p className="text-gray-600">More settings coming soon...</p>
        </div>
      </div>
    </Layout>
  );
}
