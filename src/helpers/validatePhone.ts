import { t } from 'i18next';

import { formatPhoneNumber } from 'helpers';

export const validatePhone = (value: string): string | null => {
  if (!value) {
    return t('modals.requiredField');
  }

  const processedPhone = formatPhoneNumber(value);
  const prefixRegex = /^\+375\s?(25|29|33|44)/;

  if (!prefixRegex.test(processedPhone)) {
    return t('form.phoneFormat');
  }

  return null;
};
