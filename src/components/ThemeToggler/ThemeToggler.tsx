import { FC } from 'react';

import { Switch, Group, useMantineTheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

import { Theme } from 'constants/theme';
import { useThemeContext } from 'context';

export const ThemeToggler: FC = () => {
  const { currentTheme, toggleTheme } = useThemeContext();
  const theme = useMantineTheme();

  return (
    <Group position="center">
      <Switch
        checked={currentTheme === Theme.Dark}
        onChange={() => toggleTheme()}
        size="lg"
        onLabel={<IconSun color={theme.white} size="1.25rem" stroke={1.5} />}
        offLabel={
          <IconMoonStars color={theme.colors.gray[6]} size="1.25rem" stroke={1.5} />
        }
      />
    </Group>
  );
};
