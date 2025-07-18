
import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { Language, View } from '../types';
import { Icon } from './common/Icon';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export const Header = ({ activeView, setActiveView }: HeaderProps) => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('Header must be used within a SettingsProvider');
  const { settings, setSettings, t } = context;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(s => ({ ...s, language: e.target.value as Language }));
  };

  const toggleContrast = () => {
    setSettings(s => ({ ...s, isHighContrast: !s.isHighContrast }));
  };

  const toggleTextSize = () => {
    setSettings(s => ({ ...s, isLargeText: !s.isLargeText }));
  };
  
  const navItems: { key: View; label: string }[] = [
      { key: 'finder', label: t('schemeFinder') },
      { key: 'docs', label: t('documentHelper') },
      { key: 'chat', label: t('liveAssistance') },
      { key: 'community', label: t('community') },
  ];

  return (
    <header className="bg-primary-800 dark:bg-contrast-bg text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-2 sm:mb-0">
            <h1 className="text-2xl font-bold text-white">{t('appName')}</h1>
            <p className="text-sm text-primary-200">{t('tagline')}</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
             <div className="flex items-center space-x-2 bg-primary-700 dark:bg-gray-800 p-1 rounded-md">
                <button
                  onClick={toggleContrast}
                  className={`p-1.5 rounded-md transition-colors ${settings.isHighContrast ? 'bg-primary-500' : ''}`}
                  aria-pressed={settings.isHighContrast}
                  aria-label={t('highContrast')}
                  title={t('highContrast')}
                >
                  <Icon icon={settings.isHighContrast ? 'sun' : 'moon'} className="w-5 h-5"/>
                </button>
                 <button
                  onClick={toggleTextSize}
                  className={`p-1.5 rounded-md transition-colors ${settings.isLargeText ? 'bg-primary-500' : ''}`}
                  aria-pressed={settings.isLargeText}
                  aria-label={t('largeText')}
                  title={t('largeText')}
                >
                  <Icon icon="text" className="w-5 h-5"/>
                </button>
            </div>
            
            <div className="relative">
              <select
                value={settings.language}
                onChange={handleLanguageChange}
                aria-label={t('language')}
                className="bg-primary-700 dark:bg-gray-800 text-white rounded-md py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="en">{t('english')}</option>
                <option value="hi">{t('hindi')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
       <nav className="bg-primary-700 dark:bg-gray-900" aria-label="Main navigation">
          <div className="container mx-auto px-4">
              <div className="flex justify-center sm:justify-start -mb-px">
                  {navItems.map(item => (
                      <button 
                          key={item.key} 
                          onClick={() => setActiveView(item.key)}
                          role="tab"
                          aria-selected={activeView === item.key}
                          className={`py-3 px-3 sm:px-4 text-sm font-medium text-center border-b-4 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400 ${activeView === item.key ? 'border-primary-400 text-white' : 'border-transparent text-primary-200 hover:text-white hover:border-primary-500'}`}
                      >
                          {item.label}
                      </button>
                  ))}
              </div>
          </div>
      </nav>
    </header>
  );
};
