import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { resources } from 'integrations/i18n/resources/resources';

i18n.use(initReactI18next).use(LanguageDetector).init({
  fallbackLng: 'en',
  resources,
});
