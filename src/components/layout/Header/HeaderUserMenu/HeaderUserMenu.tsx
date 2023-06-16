import { FC } from 'react';

import { Menu, Avatar } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { IoIosLogOut } from 'react-icons/io';
import { Link } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { useAuth } from 'store/store';

export const HeaderUserMenu: FC = () => {
  const { t } = useTranslation();
  const {
    user,
    signOut: { signOut },
  } = useAuth((state) => state);

  const handleSignOut = (): void => {
    signOut();
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar src={user?.image} style={{ cursor: 'pointer' }} />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{user?.nickName}</Menu.Label>
        <Menu.Item icon={<IconSettings size={14} />} component={Link} to={Paths.profile}>
          {t('header.profile')}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item onClick={handleSignOut} icon={<IoIosLogOut size={14} />}>
          {t('header.signout')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
