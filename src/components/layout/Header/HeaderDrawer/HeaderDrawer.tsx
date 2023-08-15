import { FC } from 'react';

import {
  Box,
  Button,
  createStyles,
  Divider,
  Drawer,
  Flex,
  Group,
  Indicator,
  rem,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  HeaderBasket,
  HeaderLanguageSwitcher,
  HeaderNotify,
  HeaderThemeToggler,
  HeaderUserMenu,
} from 'components';
import { Paths } from 'constants/paths';
import { isDarkTheme } from 'helpers';
import { useRole } from 'hooks';
import { useAuth, useShop } from 'store/store';

const useStyles = createStyles((theme) => ({
  link: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
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

  hiddenDesktop: {
    justifyContent: 'flex-end',
    width: '62%',
    gap: '3%',
    [theme.fn.largerThan(736)]: {
      display: 'none',
    },
  },
}));

type Props = {
  drawerOpened: boolean;
  handleCloseDrawer: () => void;
};

export const HeaderDrawer: FC<Props> = ({ handleCloseDrawer, drawerOpened }) => {
  const { classes, theme } = useStyles();
  const { t } = useTranslation();

  const {
    isAuth,
    signOut: { signOut },
  } = useAuth((state) => state);
  const { usersConfirmTotalCount } = useShop();

  const { isAdmin } = useRole();

  const handleSignOut = (): void => {
    signOut();
  };

  const dividerForMobile = (
    <Divider my="sm" color={isDarkTheme(theme.colorScheme) ? 'dark.5' : 'gray.1'} />
  );

  return (
    <Drawer
      opened={drawerOpened}
      onClose={handleCloseDrawer}
      size="100%"
      padding="25px 0"
      className={classes.hiddenDesktop}
      zIndex={-1}
    >
      {isAuth && (
        <>
          <Flex align="center" pl={15} pr={15} justify="space-between">
            <Box onClick={handleCloseDrawer}>
              <HeaderUserMenu />
            </Box>

            <Group spacing={20} pr={10}>
              <Box onClick={handleCloseDrawer}>
                <HeaderBasket />
              </Box>

              <HeaderNotify />
            </Group>
          </Flex>

          {dividerForMobile}
          <Flex align="center" gap={20} pl={15} pr={20} justify="flex-end">
            <HeaderLanguageSwitcher />

            <HeaderThemeToggler />
          </Flex>

          {dividerForMobile}
          <Link
            onClick={handleCloseDrawer}
            to={Paths.tournaments}
            className={classes.link}
          >
            {t('navbar.tournaments')}
          </Link>

          <Link onClick={handleCloseDrawer} to={Paths.bookings} className={classes.link}>
            {t('navbar.bookings')}
          </Link>
          <Link onClick={handleCloseDrawer} to={Paths.shop} className={classes.link}>
            {t('shop.shop')}
          </Link>
          {isAdmin && (
            <>
              <Link
                onClick={handleCloseDrawer}
                to={Paths.clients}
                className={classes.link}
              >
                {t('navbar.clients')}
              </Link>
              <Indicator
                disabled={!usersConfirmTotalCount}
                position="top-start"
                size={16}
                offset={12}
                withBorder
              >
                <Link
                  onClick={handleCloseDrawer}
                  to={Paths.adminPanel}
                  className={classes.link}
                >
                  {t('navbar.adminPanel')}
                </Link>
              </Indicator>
            </>
          )}
        </>
      )}
      {dividerForMobile}
      <Group position="center" grow pb="xl" px="md">
        {!isAuth && (
          <Button onClick={handleCloseDrawer} component={Link} to={Paths.signin}>
            {t('navbar.signin')}
          </Button>
        )}
        {isAuth && <Button onClick={handleSignOut}>{t('navbar.signout')}</Button>}
      </Group>
    </Drawer>
  );
};
