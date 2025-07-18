
import React, { useState, useContext, useEffect } from 'react';
import { SettingsProvider, SettingsContext } from './contexts/SettingsContext';
import { View } from './types';
import { Header } from './components/Header';
import { SchemeFinder } from './components/SchemeFinder';
import { DocumentHelper } from './components/DocumentHelper';
import { LiveAssistance } from './components/LiveAssistance';
import { CommunityStories } from './components/CommunityStories';
import { Alerts } from './components/Alerts';

const AppContent = () => {
    const [activeView, setActiveView] = useState<View>('finder');
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error("AppContent must be used within a SettingsProvider");
    }

    const { settings } = context;

    useEffect(() => {
        const root = window.document.documentElement;
        if (settings.isHighContrast) {
            root.classList.add('dark');
            root.style.backgroundColor = '#000000';
        } else {
            root.classList.remove('dark');
            root.style.backgroundColor = '#f0f9ff';
        }
        if (settings.isLargeText) {
            root.classList.add('text-lg');
        } else {
            root.classList.remove('text-lg');
        }
    }, [settings.isHighContrast, settings.isLargeText]);
    
    const renderView = () => {
        switch (activeView) {
            case 'finder':
                return <SchemeFinder />;
            case 'docs':
                return <DocumentHelper />;
            case 'chat':
                return <LiveAssistance />;
            case 'community':
                return <CommunityStories />;
            default:
                return <SchemeFinder />;
        }
    }

    return (
        <div className="min-h-screen bg-primary-50 dark:bg-contrast-bg transition-colors duration-300">
            <Header activeView={activeView} setActiveView={setActiveView} />
            <main className="container mx-auto p-4 md:p-8">
                {activeView === 'finder' && <div className="mb-8"><Alerts /></div>}
                {renderView()}
            </main>
             <footer className="text-center py-4 mt-8 text-gray-500 dark:text-gray-400 text-sm">
                <p>&copy; 2024 Sahayata. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

const App = () => {
  return (
    <SettingsProvider>
        <AppContent />
    </SettingsProvider>
  );
};

export default App;
