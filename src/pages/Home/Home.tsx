import { FC } from 'react';

import {
  createStyles,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useTranslation, Trans } from 'react-i18next';

import { ReactComponent as HomeImg } from 'assets/home.svg';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  },

  content: {
    maxWidth: rem(480),
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(44),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  highlight: {
    position: 'relative',
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
      .background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)}`,
  },
}));

const Home: FC = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <div>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              <Trans i18nKey="home.title">
                A <span className={classes.highlight}>modern</span> React <br />{' '}
                components library
              </Trans>
            </Title>
            <Text color="dimmed" mt="md">
              {t('home.info')}
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconCheck size={rem(12)} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <Trans i18nKey="home.typescript">
                  <b>TypeScript based</b> – build type safe applications, all components
                  and hooks export types
                </Trans>
              </List.Item>
              <List.Item>
                <Trans i18nKey="home.free">
                  <b>Free and open source</b> – all packages have MIT license, you can use
                  Mantine in any project
                </Trans>
              </List.Item>
              <List.Item>
                <Trans i18nKey="home.focus">
                  <b>No annoying focus ring</b> – focus ring will appear only when user
                  navigates with keyboard
                </Trans>
              </List.Item>
            </List>

            <Group mt={30}>
              <Button radius="xl" size="md" className={classes.control}>
                {t('home.start')}
              </Button>
              <Button variant="default" radius="xl" size="md" className={classes.control}>
                {t('home.source')}
              </Button>
            </Group>
          </div>
          <HomeImg className={classes.image} />
        </div>
      </Container>
    </div>
  );
};

export default Home;
