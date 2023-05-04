import { FC } from 'react';

import {
  createStyles,
  Header,
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { DiReact } from 'react-icons/di';
import { Link } from 'react-router-dom';

import { HeaderLanguageSwitcher, HeaderThemeToggler, HeaderUserMenu } from 'components';
import { Paths } from 'constants/paths';
import { useAuth } from 'store/store';

const useStyles = createStyles((theme) => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan('sm')]: {
      height: rem(42),
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    }),
  },

  inner: {
    maxWidth: rem(960),
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));

export const HeaderMegaMenu: FC = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: handleCloseDrawer }] =
    useDisclosure(false);
  const { classes, theme } = useStyles();
  const {
    isAuth,
    signOut: { signOut },
  } = useAuth((state) => state);

  const { t } = useTranslation();

  const handleSignOut = (): void => {
    signOut(t);
  };

  return (
    <Box pb={60}>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: '100%' }} className={classes.inner}>
          <DiReact size={40} />

          <Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
            <Link to={Paths.home} className={classes.link}>
              {t('header.home')}
            </Link>
            {isAuth && (
              <Link to={Paths.tournaments} className={classes.link}>
                {t('header.tournaments')}
              </Link>
            )}
          </Group>

          <Group className={classes.hiddenMobile}>
            <HeaderLanguageSwitcher />

            <HeaderThemeToggler />

            {!isAuth && (
              <Button component={Link} to={Paths.signin}>
                {t('header.signin')}
              </Button>
            )}
            {isAuth && <HeaderUserMenu />}
          </Group>

          <Group className={classes.hiddenDesktop}>
            <HeaderLanguageSwitcher />

            <HeaderThemeToggler />

            <Burger opened={drawerOpened} onClick={toggleDrawer} />
          </Group>
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={handleCloseDrawer}
        size="100%"
        padding="md"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

          <Link onClick={handleCloseDrawer} to={Paths.home} className={classes.link}>
            {t('header.home')}
          </Link>
          {isAuth && (
            <Link
              onClick={handleCloseDrawer}
              to={Paths.tournaments}
              className={classes.link}
            >
              {t('header.tournaments')}
            </Link>
          )}
          {isAuth && (
            <Link onClick={handleCloseDrawer} to={Paths.profile} className={classes.link}>
              {t('header.settings')}
            </Link>
          )}

          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

          <Group position="center" grow pb="xl" px="md">
            {!isAuth && (
              <Button onClick={handleCloseDrawer} component={Link} to={Paths.signin}>
                {t('header.signin')}
              </Button>
            )}
            {isAuth && <Button onClick={handleSignOut}>{t('header.signout')}</Button>}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};