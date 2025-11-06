import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="fixed bottom-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 shadow-lg z-50 hover:shadow-xl transition-all duration-200">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="border-none bg-transparent cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
      >
        <option value="en">🇬🇧 English</option>
        <option value="ua">🇺🇦 Українська</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
