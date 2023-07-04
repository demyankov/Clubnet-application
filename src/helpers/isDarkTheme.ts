import { ColorScheme } from '@mantine/core';

import { Theme } from 'constants/theme';

export const isDarkTheme = (colorScheme: ColorScheme): boolean => {
  return colorScheme === Theme.Dark;
};
