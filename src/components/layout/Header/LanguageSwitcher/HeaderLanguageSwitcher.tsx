import { FC } from 'react';

import { Select } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconWorld } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { Language, LANGUAGE_SWITCHER_CONFIG } from 'constants/languageSwitcherConfig';

export const HeaderLanguageSwitcher: FC = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useLocalStorage<Language>({
    key: 'language',
    defaultValue: Language.Ru,
    getInitialValueInEffect: true,
  });

  const handleSelectLang = async (language: Language): Promise<void> => {
    await setCurrentLanguage(language);
    await i18n.changeLanguage(language);
  };

  return (
    <Select
      maw={100}
      value={currentLanguage}
      onChange={handleSelectLang}
      defaultValue={currentLanguage}
      icon={<IconWorld />}
      data={LANGUAGE_SWITCHER_CONFIG}
    />
  );
};
