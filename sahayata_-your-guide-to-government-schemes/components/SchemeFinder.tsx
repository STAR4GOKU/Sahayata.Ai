
import React, { useState, useContext, useEffect, useRef } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { findSchemes } from '../services/geminiService';
import { Scheme } from '../types';
import { DISABILITY_TYPES } from '../constants';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { Card } from './common/Card';
import { Icon } from './common/Icon';

const SchemeResult = ({ scheme, t }: { scheme: Scheme, t: (key:string) => string }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const speak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const textToSpeak = `
            Scheme: ${scheme.schemeName}.
            Description: ${scheme.description}.
            Eligibility: ${scheme.eligibility.join(', ')}.
            Benefits: ${scheme.benefits.join(', ')}.
            Documents Required: ${scheme.documentsRequired.join(', ')}.
            Application Process: ${scheme.applicationProcess}.
        `;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-IN';
        utterance.onend = () => setIsSpeaking(false);
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    return (
        <Card className="mb-6 animate-fade-in">
            <div className="flex justify-between items-start">
                 <h3 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mb-2">{scheme.schemeName}</h3>
                 <button onClick={speak} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200" aria-label={isSpeaking ? t('stopReading') : t('readAloud')}>
                    <Icon icon={isSpeaking ? 'stop' : 'speak'} className="w-5 h-5 mr-1" />
                    {isSpeaking ? t('stopReading') : t('readAloud')}
                </button>
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-300">{scheme.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">{t('eligibility')}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                        {scheme.eligibility.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">{t('benefits')}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                        {scheme.benefits.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">{t('documentsRequired')}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                        {scheme.documentsRequired.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">{t('applicationProcess')}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{scheme.applicationProcess}</p>
                </div>
            </div>
        </Card>
    );
};

export const SchemeFinder = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('SchemeFinder must be used within a SettingsProvider');
  const { settings, t } = context;
  
  const [disability, setDisability] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { isListening, transcript, startListening, hasRecognitionSupport } = useSpeechRecognition(settings.language);

  useEffect(() => {
    if (transcript) {
        setLocation(transcript);
    }
  }, [transcript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSchemes([]);
    try {
      const results = await findSchemes(disability, age, location);
      setSchemes(results);
      if (results.length === 0) {
        setError(t('noSchemesFound'));
      }
    } catch (err) {
      setError(t('errorFindingSchemes'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card title={t('schemeFinder')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="disability-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('disabilityType')}</label>
              <select
                id="disability-type"
                value={disability}
                onChange={(e) => setDisability(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">{t('selectDisability')}</option>
                {DISABILITY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('age')}</label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                placeholder={t('enterAge')}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('location')}</label>
            <div className="relative mt-1">
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    placeholder={t('enterLocation')}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-10"
                />
                {hasRecognitionSupport && (
                    <button
                        type="button"
                        onClick={startListening}
                        disabled={isListening}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-primary-600 disabled:text-red-500"
                        aria-label={isListening ? t('voiceInputActive') : t('useVoiceInput')}
                        title={isListening ? t('voiceInputActive') : t('useVoiceInput')}
                    >
                        <Icon icon="mic" className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : ''}`}/>
                    </button>
                )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 dark:disabled:bg-gray-600"
          >
            {isLoading ? t('findingSchemes') : t('findSchemes')}
          </button>
        </form>
      </Card>
      
      <div className="mt-8">
        {isLoading && <div className="text-center">{t('findingSchemes')}</div>}
        {error && <div className="text-center text-red-500 dark:text-red-400">{error}</div>}
        <div className="space-y-6">
            {schemes.map((scheme, index) => <SchemeResult key={index} scheme={scheme} t={t} />)}
        </div>
      </div>
    </div>
  );
};
