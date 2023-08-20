import React, { FC } from 'react';

import {
  ActionIcon,
  Box,
  Burger,
  createStyles,
  Flex,
  Group,
  Header,
  Indicator,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as AppLogo } from 'assets/logo.svg';
import {
  HeaderBasket,
  HeaderLanguageSwitcher,
  HeaderNotify,
  HeaderSearch,
  HeaderThemeToggler,
  HeaderUserMenu,
  HeaderDrawer,
} from 'components';
import { Paths } from 'constants/paths';
import { useAuth, useFriends, useShop } from 'store/store';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px',
  },

  hiddenMobile: {
    [theme.fn.smallerThan(736)]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    justifyContent: 'flex-end',
    [theme.fn.largerThan(736)]: {
      display: 'none',
    },
  },

  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.fn.smallerThan(400)]: {
      width: '100px',
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

  const { classes } = useStyles();

  const { isAuth } = useAuth((state) => state);
  const { basketTotalCounter } = useShop();
  const { totalCountNotify } = useFriends();
  const { usersConfirmTotalCount } = useShop();

  const handleLogoClick = (): void => {
    navigate(Paths.home);
  };

  const isIndicatorVisible =
    basketTotalCounter || totalCountNotify || usersConfirmTotalCount;

  return (
    <Header height={60} zIndex={100}>
      <Group sx={{ height: '100%' }} className={classes.inner}>
        <ActionIcon onClick={handleLogoClick} className={classes.logo}>
          <AppLogo />
        </ActionIcon>

        <Flex align="center" gap={10}>
          <Box className={classes.searchContainer}>{isAuth && <HeaderSearch />}</Box>

          <Group className={classes.hiddenDesktop}>
            <Indicator size={15} withBorder disabled={!isIndicatorVisible} offset={5}>
              <Burger opened={drawerOpened} onClick={toggleDrawer} />
            </Indicator>
          </Group>

          <Group position="apart" className={classes.hiddenMobile}>
            <HeaderLanguageSwitcher />

            <HeaderThemeToggler />

            {isAuth && (
              <>
                <HeaderBasket />

                <HeaderNotify />

                <HeaderUserMenu />
              </>
            )}
          </Group>
        </Flex>
      </Group>
      <HeaderDrawer drawerOpened={drawerOpened} handleCloseDrawer={handleCloseDrawer} />
    </Header>
  );
};
