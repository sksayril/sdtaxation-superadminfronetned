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
      black: 'bg-gray-900',
      pink: 'bg-pink-600',
      teal: 'bg-teal-600',
      cyan: 'bg-cyan-600',
      white: 'bg-white border-2 border-gray-300',
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
      black: 'border-gray-200',
      pink: 'border-pink-100',
      teal: 'border-teal-100',
      cyan: 'border-cyan-100',
      white: 'border-gray-300',
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
      black: 'bg-gray-50',
      pink: 'bg-pink-50',
      teal: 'bg-teal-50',
      cyan: 'bg-cyan-50',
      white: 'bg-white',
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
      black: 'text-gray-900',
      pink: 'text-pink-600',
      teal: 'text-teal-600',
      cyan: 'text-cyan-600',
      white: 'text-gray-900',
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
      black: 'border-gray-900',
      pink: 'border-pink-600',
      teal: 'border-teal-600',
      cyan: 'border-cyan-600',
      white: 'border-gray-300',
    };
    return borderMap[themeName] || 'border-blue-600';
  };

  return (
    <Layout title="Settings">
      <div className="space-y-6">
        {/* Theme Selection */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border dark:border-gray-700 ${getThemeBorderClass(themeName)}`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-lg ${getThemeLightClass(themeName)} dark:bg-gray-700`}>
              <Palette className={getThemeTextClass(themeName)} size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Theme Settings</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred color theme</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {availableThemes.map((availableTheme) => {
              const isSelected = themeName === availableTheme.name;
              const isWhiteTheme = availableTheme.name === 'white';
              return (
                <button
                  key={availableTheme.name}
                  onClick={() => setTheme(availableTheme.name)}
                  className={`
                    w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95
                    ${getThemeColorClass(availableTheme.name)} 
                    ${isWhiteTheme ? 'text-gray-900' : 'text-white'}
                    ${isSelected ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''}
                  `}
                >
                  <Palette size={18} />
                  <span className="font-semibold">{availableTheme.displayName}</span>
                  {isSelected && (
                    <div className={`${isWhiteTheme ? 'bg-gray-200' : 'bg-white/20'} rounded-full p-0.5 ml-1`}>
                      <Check size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong className="dark:text-white">Current Theme:</strong> {theme.displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              The theme will be applied to the sidebar, cards, and page elements throughout the application.
            </p>
          </div>
        </div>

        {/* Additional Settings Placeholder */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border dark:border-gray-700 ${getThemeBorderClass(themeName)}`}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Other Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">More settings coming soon...</p>
        </div>
      </div>
    </Layout>
  );
}
