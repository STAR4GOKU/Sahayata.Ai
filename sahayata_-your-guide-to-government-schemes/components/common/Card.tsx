
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export const Card = ({ children, className = '', title }: CardProps) => {
  return (
    <div className={`bg-white dark:bg-gray-800 dark:text-contrast-text dark:border-gray-700 rounded-lg shadow-md p-4 md:p-6 border border-gray-200 ${className}`}>
      {title && <h3 className="text-xl font-bold mb-4 text-primary-800 dark:text-primary-300">{title}</h3>}
      {children}
    </div>
  );
};
