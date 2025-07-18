
import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { Card } from './common/Card';

export const Alerts = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('Alerts must be used within a SettingsProvider');
    const { t } = context;

    return (
        <Card className="bg-yellow-100 border-yellow-400 dark:bg-yellow-900/50 dark:border-yellow-600">
            <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">{t('alertsTitle')}</h3>
            <p className="text-yellow-700 dark:text-yellow-300">{t('alertContent')}</p>
        </Card>
    );
};
