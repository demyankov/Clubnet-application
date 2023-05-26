export enum Language {
  En = 'en',
  Ru = 'ru',
}

interface ILanguage {
  label: string;
  value: Language;
}

export const LANGUAGE_SWITCHER_CONFIG: ILanguage[] = [
  { label: 'EN', value: Language.En },
  { label: 'РУ', value: Language.Ru },
];
