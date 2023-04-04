import { FC } from 'react';

import { createStyles, Container, Group, ActionIcon, rem } from '@mantine/core';
import { DiReact } from 'react-icons/di';
import { VscGithub } from 'react-icons/vsc';

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: rem(60),
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
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

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <DiReact size={40} />
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
