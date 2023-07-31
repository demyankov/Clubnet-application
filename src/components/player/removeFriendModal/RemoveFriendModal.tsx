import { FC } from 'react';

import { Button, Flex } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';

import { useFriends } from 'store/store';

type Props = {
  clientId: string;
  playerId: string;
};

export const RemoveFriendModal: FC<Props> = ({ playerId, clientId }) => {
  const { removeFriend } = useFriends();

  const { t } = useTranslation();

  const handleRemoveFriend = (): void => {
    removeFriend({ clientId, playerId });
  };
  const handleCloseModal = (): void => {
    modals.close('removeFriendModal');
  };

  return (
    <Flex justify="space-between">
      <Button onClick={handleRemoveFriend} color="red">
        {t('friends.removeFriend')}
      </Button>
      <Button onClick={handleCloseModal} color="gray">
        {t('friends.cancelRemove')}
      </Button>
    </Flex>
  );
};
