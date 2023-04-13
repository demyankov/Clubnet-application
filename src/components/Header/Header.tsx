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
  Text,
  Avatar,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { DiReact } from 'react-icons/di';
import { IoIosLogOut } from 'react-icons/io';
import { Link } from 'react-router-dom';

import { LanguageSwitcher, ThemeToggler } from 'components';
import { Paths } from 'constants/paths';
import { useAuth } from 'store';

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
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { classes, theme } = useStyles();
  const { user, removeUser } = useAuth((state) => ({
    user: state.user,
    removeUser: state.removeUser,
  }));

  const { isAuth, email } = user;

  const { t } = useTranslation();

  const handleLogOut = (): void => {
    if (drawerOpened) {
      toggleDrawer();
    }
    removeUser();
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
              <Link to={Paths.dashboard} className={classes.link}>
                {t('header.dashboard')}
              </Link>
            )}
          </Group>

          <Group className={classes.hiddenMobile}>
            <LanguageSwitcher />
            <ThemeToggler />
            {!isAuth && (
              <>
                <Button component={Link} to={Paths.login} variant="default">
                  {t('header.login')}
                </Button>
                <Button component={Link} to={Paths.register}>
                  {t('header.signup')}
                </Button>
              </>
            )}
            {isAuth && (
              <>
                <Avatar
                  component={Link}
                  to={Paths.profile}
                  src={null}
                  alt="no image here"
                />
                <Text fz="xl">{email}</Text>
                <Button onClick={handleLogOut}>
                  <IoIosLogOut />
                </Button>
              </>
            )}
          </Group>

          <Group className={classes.hiddenDesktop}>
            <LanguageSwitcher />
            <ThemeToggler />
            <Burger opened={drawerOpened} onClick={toggleDrawer} />
          </Group>
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={email}
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

          <Link onClick={closeDrawer} to={Paths.home} className={classes.link}>
            {t('header.home')}
          </Link>
          {isAuth && (
            <Link onClick={closeDrawer} to={Paths.profile} className={classes.link}>
              {t('header.profile')}
            </Link>
          )}
          {isAuth && (
            <Link onClick={closeDrawer} to={Paths.dashboard} className={classes.link}>
              {t('header.dashboard')}
            </Link>
          )}

          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

          <Group position="center" grow pb="xl" px="md">
            {!isAuth && (
              <>
                <Button
                  onClick={closeDrawer}
                  component={Link}
                  to={Paths.login}
                  variant="default"
                >
                  {t('header.login')}
                </Button>
                <Button onClick={closeDrawer} component={Link} to={Paths.register}>
                  {t('header.signup')}
                </Button>
              </>
            )}
            {isAuth && <Button onClick={handleLogOut}>{t('header.logout')}</Button>}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};
