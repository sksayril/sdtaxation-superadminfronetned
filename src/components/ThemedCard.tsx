import React, { ReactNode } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemedCardProps {
  children: ReactNode;
  className?: string;
}

export default function ThemedCard({ children, className = '' }: ThemedCardProps) {
  const { theme } = useTheme();

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

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${getThemeBorderClass(theme.name)} ${className}`}>
      {children}
    </div>
  );
}
