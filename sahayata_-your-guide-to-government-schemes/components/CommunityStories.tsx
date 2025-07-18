
import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { Card } from './common/Card';

export const CommunityStories = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('CommunityStories must be used within a SettingsProvider');
    const { t } = context;

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('communityTitle')}</h2>
            
            <Card>
                <h3 className="text-xl font-bold text-primary-800 dark:text-primary-300 mb-2">{t('story1Title')}</h3>
                <p className="text-gray-600 dark:text-gray-300 italic">{t('story1Content')}</p>
            </Card>

            <Card>
                <h3 className="text-xl font-bold text-primary-800 dark:text-primary-300 mb-2">{t('story2Title')}</h3>
                <p className="text-gray-600 dark:text-gray-300 italic">{t('story2Content')}</p>
            </Card>
        </div>
    );
};
