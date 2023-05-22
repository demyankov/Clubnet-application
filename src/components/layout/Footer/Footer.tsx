import { FC } from 'react';

import { createStyles, Container, Group, ActionIcon, rem, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { DiReact } from 'react-icons/di';
import { VscGithub } from 'react-icons/vsc';

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    flex: '0 0 auto',
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export const FooterSocial: FC = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <DiReact size={40} />
        <Text>{t('footer.crafted')}</Text>
        <Group spacing={0} className={classes.links} position="right" noWrap>
          <ActionIcon
            size="lg"
            component="a"
            href="https://github.com/thelastandrew"
            target="_blank"
          >
            <VscGithub size={35} />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
};
