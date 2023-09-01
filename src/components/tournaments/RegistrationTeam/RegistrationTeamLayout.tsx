import { FC, ReactNode } from 'react';

import { createStyles, Flex } from '@mantine/core';

import { isDarkTheme } from 'helpers';

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: isDarkTheme(theme.colorScheme) ? theme.colors.dark[6] : 'none',
    padding: theme.spacing.sm,
    margin: '1 auto',
    marginTop: theme.spacing.sm,
    flexDirection: 'column',
    gap: 'sm',
    border: '1px solid',
    borderColor: isDarkTheme(theme.colorScheme)
      ? theme.colors.dark[4]
      : theme.colors.gray[4],
    borderRadius: '4px',
    height: '20rem',
    overflow: 'auto',
  },
}));

type Props = {
  children: ReactNode;
};

export const RegistrationTeamLayout: FC<Props> = ({ children }: Props) => {
  const { classes } = useStyles();

  return <Flex className={classes.wrapper}>{children}</Flex>;
};
