import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { Language } from 'constants/languageSwitcherConfig';
import { resources } from 'integrations/i18n/resources/resources';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: Language.Ru,
    resources,
    detection: {
      order: ['local_storage'],
      caches: ['local_storage'],
    },
  });
