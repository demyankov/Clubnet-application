import React, { FC } from 'react';

import { createStyles, rem, Tooltip } from '@mantine/core';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

import { isDarkTheme } from 'helpers';

export const useStyles = createStyles((theme) => ({
  link: {
    width: rem(50),
    height: rem(50),
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isDarkTheme(theme.colorScheme) ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: isDarkTheme(theme.colorScheme)
        ? theme.colors.dark[5]
        : theme.colors.gray[0],
    },
  },
  hiddenMobile: {
    [theme.fn.smallerThan(700)]: {
      display: 'none',
    },
  },
}));

interface NavbarLinkProps {
  icon: IconType;
  label: string;
  to?: string;
  onClick?: () => void;
}

export const NavbarLink: FC<NavbarLinkProps> = ({ icon: Icon, label, onClick, to }) => {
  const { classes } = useStyles();

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <Link to={to || ''} onClick={onClick} className={classes.link}>
        <Icon size="1.7rem" stroke="2" />
      </Link>
    </Tooltip>
  );
};
