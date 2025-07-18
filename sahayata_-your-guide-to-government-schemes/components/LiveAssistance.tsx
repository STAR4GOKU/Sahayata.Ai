
import React, { useState, useContext, useRef, useEffect } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { Message } from '../types';
import { getChatResponse } from '../services/geminiService';
import { Card } from './common/Card';
import { Icon } from './common/Icon';

export const LiveAssistance = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('LiveAssistance must be used within a SettingsProvider');
    const { t } = context;

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'Hello! How can I assist you today regarding government schemes?', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponseText = await getChatResponse(input);
            const botMessage: Message = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = { id: Date.now() + 1, text: 'Sorry, I am having trouble connecting. Please try again.', sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestHuman = () => {
        setNotification(t('humanHelpNotice'));
        setTimeout(() => setNotification(''), 4000);
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('liveAssistance')}</h2>
            <Card className="flex flex-col h-[70vh]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('typeMessage')}
                            aria-label={t('typeMessage')}
                            className="flex-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        <button type="submit" disabled={isLoading} className="p-2 rounded-full text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 dark:disabled:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            <Icon icon="send" className="w-5 h-5"/>
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <button onClick={handleRequestHuman} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                            {t('humanHelp')}
                        </button>
                        {notification && <p className="mt-2 text-sm text-green-600 dark:text-green-400">{notification}</p>}
                    </div>
                </div>
            </Card>
        </div>
    );
};
