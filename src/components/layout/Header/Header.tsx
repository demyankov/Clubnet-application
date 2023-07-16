import React, { FC } from 'react';

import {
  ActionIcon,
  Burger,
  Button,
  createStyles,
  Divider,
  Drawer,
  Group,
  Header,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as AppLogo } from 'assets/logo.svg';
import { HeaderLanguageSwitcher, HeaderThemeToggler, HeaderUserMenu } from 'components';
import { HeaderSearch } from 'components/layout/Header/HeaderSearch/Search';
import { Paths } from 'constants/paths';
import { isDarkTheme } from 'helpers';
import { useRole } from 'hooks';
import { useAuth } from 'store/store';

const useStyles = createStyles((theme) => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: 'none',
    color: isDarkTheme(theme.colorScheme) ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan('md')]: {
      height: rem(42),
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    ...theme.fn.hover({
      backgroundColor: isDarkTheme(theme.colorScheme)
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    }),
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px',
  },

  hiddenMobile: {
    [theme.fn.smallerThan(700)]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan(700)]: {
      display: 'none',
    },
  },

  logo: {
    width: '110px',
    height: '38px',
  },
}));

export const HeaderMegaMenu: FC = () => {
  const navigate = useNavigate();

  const [drawerOpened, { toggle: toggleDrawer, close: handleCloseDrawer }] =
    useDisclosure(false);
  const { classes, theme } = useStyles();

  const {
    isAuth,
    signOut: { signOut },
  } = useAuth((state) => state);
  const { isAdmin } = useRole();
  const { t } = useTranslation();

  const handleSignOut = (): void => {
    signOut();
  };

  const handleLogoClick = (): void => {
    navigate(Paths.home);
  };

  return (
    <Header height={60} zIndex={399}>
      <Group sx={{ height: '100%' }} className={classes.inner}>
        <ActionIcon onClick={handleLogoClick} className={classes.logo}>
          <AppLogo />
        </ActionIcon>

        <Group position="apart" className={classes.hiddenMobile}>
          {isAuth && <HeaderSearch />}

          <HeaderLanguageSwitcher />

          <HeaderThemeToggler />

          {isAuth && <HeaderUserMenu />}
        </Group>

        <Group className={classes.hiddenDesktop}>
          <HeaderLanguageSwitcher />

          <HeaderThemeToggler />

          <Burger opened={drawerOpened} onClick={toggleDrawer} />
        </Group>
      </Group>

      <Drawer
        opened={drawerOpened}
        onClose={handleCloseDrawer}
        size="100%"
        padding="25px 0"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        {isAuth && (
          <>
            <Link
              onClick={handleCloseDrawer}
              to={Paths.tournaments}
              className={classes.link}
            >
              {t('navbar.tournaments')}
            </Link>

            <Link
              onClick={handleCloseDrawer}
              to={Paths.bookings}
              className={classes.link}
            >
              {t('navbar.bookings')}
            </Link>

            <Link onClick={handleCloseDrawer} to={Paths.profile} className={classes.link}>
              {t('navbar.profile')}
            </Link>
            {isAdmin && (
              <Link
                onClick={handleCloseDrawer}
                to={Paths.clients}
                className={classes.link}
              >
                {t('navbar.clients')}
              </Link>
            )}
          </>
        )}

        <Divider my="sm" color={isDarkTheme(theme.colorScheme) ? 'dark.5' : 'gray.1'} />

        <Group position="center" grow pb="xl" px="md">
          {!isAuth && (
            <Button onClick={handleCloseDrawer} component={Link} to={Paths.signin}>
              {t('navbar.signin')}
            </Button>
          )}
          {isAuth && <Button onClick={handleSignOut}>{t('navbar.signout')}</Button>}
        </Group>
      </Drawer>
    </Header>
  );
};
