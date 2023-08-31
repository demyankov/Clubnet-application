import { FC } from 'react';

import { Box, Button, Group, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconPhoneCall, IconSettings } from '@tabler/icons-react';
import { getAuth } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { FaSteam } from 'react-icons/fa';

import { ProfileUpdateUserModal } from 'components';
import { DateFormats } from 'constants/dateFormats';
import { STEAM_AUTH_URL } from 'constants/stemAuthURL';
import { dateFormatting } from 'helpers';
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

  const creationDate = dateFormatting(
    getAuth().currentUser?.metadata.creationTime ?? '',
    DateFormats.DayMonthYearWithoutDot,
  );

  return (
    <Group>
      <div>
        <Text size="20px" fw={700} c="dimmed">
          {currentUser.name}
        </Text>
        <Text size="40px" fw={500} tt="uppercase" mt="-5px">
          {currentUser.nickName}
        </Text>
        {t('profile.registrationDate')} {creationDate}
        <Group noWrap spacing={10} mt={5}>
          <IconPhoneCall stroke={1.5} size="15px" />
          <Text c="dimmed" size="15px">
            {currentUser.phone}
          </Text>
        </Group>
        {currentUser.steamId ? (
          <Box mt={10}>
            <FaSteam size={20} />
          </Box>
        ) : (
          <Button
            compact
            component="a"
            href={STEAM_AUTH_URL}
            variant="subtle"
            color="dark"
            m={5}
            ml={0}
            pl={0}
          >
            <FaSteam size={20} style={{ marginRight: '5px' }} />
            {t('profile.addedSteamAccount')}
          </Button>
        )}
      </div>

      <Button onClick={handleOpenModal} variant="light">
        <IconSettings />
      </Button>
    </Group>
  );
};
