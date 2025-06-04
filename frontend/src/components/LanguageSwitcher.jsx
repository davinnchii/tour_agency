import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        <option value="en">English</option>
        <option value="uk">Українська</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
