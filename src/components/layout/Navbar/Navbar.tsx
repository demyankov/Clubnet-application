import React, { FC } from 'react';

import { Divider, Navbar, rem, Stack } from '@mantine/core';
import {
  IconCalendarStats,
  IconHome2,
  IconLogin,
  IconLogout,
  IconPepper,
  IconSettings,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { GiConsoleController } from 'react-icons/gi';

import { NavbarLink, useStyles } from 'components/layout/Navbar/NavbarLink/NavbarLink';
import { Paths } from 'constants/paths';
import { isDarkTheme } from 'helpers';
import { useRole } from 'hooks';
import { useAuth } from 'store/store';

export const NavbarMegaMenu: FC = () => {
  const { classes, theme } = useStyles();

  const { t } = useTranslation();

  const {
    isAuth,
    signOut: { signOut },
  } = useAuth((state) => state);

  const { isAdmin } = useRole();

  const handleSignOut = (): void => {
    signOut();
  };

  return (
    <Navbar
      h={`calc(100vh - ${rem(60)})`}
      width={{ base: 80 }}
      p="md"
      className={classes.hiddenMobile}
    >
      {isAuth && (
        <Navbar.Section grow>
          <Stack justify="center" spacing={10}>
            <NavbarLink to={Paths.home} icon={IconHome2} label={t('navbar.home')} />
            <NavbarLink
              to={Paths.tournaments}
              icon={GiConsoleController}
              label={t('navbar.tournaments')}
            />
            <NavbarLink
              to={Paths.bookings}
              icon={IconCalendarStats}
              label={t('navbar.bookings')}
            />

            {isAdmin && (
              <NavbarLink
                to={Paths.clients}
                icon={IconPepper}
                label={t('navbar.clients')}
              />
            )}
          </Stack>
        </Navbar.Section>
      )}
      <Navbar.Section>
        <Stack justify="center" spacing={10}>
          {isAuth ? (
            <>
              <Divider
                my="sm"
                color={isDarkTheme(theme.colorScheme) ? 'dark.5' : 'gray.1'}
              />
              <NavbarLink
                to={Paths.profile}
                icon={IconSettings}
                label={t('navbar.profile')}
              />
              <NavbarLink
                onClick={handleSignOut}
                icon={IconLogout}
                label={t('navbar.signout')}
              />
            </>
          ) : (
            <NavbarLink to={Paths.signin} icon={IconLogin} label={t('navbar.signin')} />
          )}
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};
