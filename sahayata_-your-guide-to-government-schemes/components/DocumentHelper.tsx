
import React, { useContext, useState } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { Card } from './common/Card';
import { GLOSSARY_TERMS } from '../constants';

export const DocumentHelper = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('DocumentHelper must be used within a SettingsProvider');
    const { settings, t } = context;

    const [notification, setNotification] = useState('');

    const handleAutofill = () => {
        setNotification(t('autofillSuccess'));
        setTimeout(() => setNotification(''), 3000);
    };

    const glossary = GLOSSARY_TERMS[settings.language];

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('docHelperTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title={t('commonDocs')}>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                        {(t('docList') as unknown as string[]).map((doc, i) => <li key={i}>{doc}</li>)}
                    </ul>
                </Card>

                <Card title={t('glossaryTitle')}>
                    <div className="space-y-4">
                        {glossary.map((item, i) => (
                            <div key={i}>
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.term}</h4>
                                <p className="text-gray-600 dark:text-gray-300">{item.definition}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <Card>
                <div className="text-center">
                    <button
                        onClick={handleAutofill}
                        className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        {t('autofill')}
                    </button>
                    {notification && <p className="mt-4 text-green-600 dark:text-green-400">{notification}</p>}
                </div>
            </Card>
        </div>
    );
};
