'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { siteConfig } from '../../site.config';
import { translations, TranslationKey } from '../i18n/translations';
import { buildFeatureOverrides } from '@/lib/i18n';

interface LanguageContextType {
  language: typeof siteConfig.i18n.defaultLocale;
  t: (key: TranslationKey) => string;
  tWith: (key: TranslationKey, params: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const language = siteConfig.i18n.defaultLocale;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const featureOverrides = useMemo(() => buildFeatureOverrides(language), []);
  const dictionary = translations[language];

  /**
   * Translates a key using the fixed site locale.
   */
  const t = (key: TranslationKey) => {
    if (key in featureOverrides) return featureOverrides[key]!;
    return dictionary[key] || key;
  };

  /**
   * Translates a key with parameters.
   */
  const tWith = (key: TranslationKey, params: Record<string, string | number>) => {
    let result = t(key);
    for (const [name, value] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${name}\\}`, 'g'), String(value));
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, t, tWith }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
