import { FC } from 'react';

import { Button, Group, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconPhoneCall, IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { ProfileUpdateUserModal } from 'components/profile';
import { IUser } from 'store/slices/auth/types';
import { useAuth } from 'store/store';

export const ProfilePersonalDataForm: FC = () => {
  const { user } = useAuth((state) => state);
  const { t } = useTranslation();
  const currentUser = user as IUser;

  const handleOpenModal = (): void => {
    modals.open({
      modalId: 'ProfileUpdateUserModal',
      title: t('profile.update'),
      children: <ProfileUpdateUserModal />,
      centered: true,
    });
  };

  return (
    <Group>
      <div>
        <Text size="20px" fw={700} c="dimmed">
          {currentUser.name}
        </Text>

        <Text size="40px" fw={500} tt="uppercase" mt="-5px">
          {currentUser.nickName}
        </Text>

        <Group noWrap spacing={10} mt={5}>
          <IconPhoneCall stroke={1.5} size="15px" />
          <Text c="dimmed" size="15px">
            {currentUser.phone}
          </Text>
        </Group>
      </div>

      <Button onClick={handleOpenModal} variant="light">
        <IconSettings />
      </Button>
    </Group>
  );
};
