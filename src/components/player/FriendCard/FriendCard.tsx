import { FC } from 'react';

import { ActionIcon, Card, createStyles, Flex, Group, Image, Text } from '@mantine/core';
import { IoCheckmarkSharp, IoCloseSharp } from 'react-icons/io5';
import { generatePath, useNavigate } from 'react-router-dom';

import { FriendStatus } from 'constants/friendStatus';
import { Paths } from 'constants/paths';
import { useFriends } from 'store/store';

type Props = {
  nickname: Nullable<string>;
  image: Nullable<string>;
  name: Nullable<string>;
  status?: FriendStatus;
  clientId?: string;
  playerId?: string;
};

const useStyles = createStyles({
  item: {
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.003)',
    },
  },
  nameWrapper: {
    paddingLeft: '10px',
  },
});

export const FriendCard: FC<Props> = ({
  nickname,
  image,
  name = 'Player',
  status,
  clientId,
  playerId,
}) => {
  const navigate = useNavigate();

  const { classes } = useStyles();

  const { acceptRequest, declineRequest } = useFriends((state) => state);

  const isClientAndPlayer = clientId && playerId;
  const isSent = status === FriendStatus.sent;

  const handleAccept = (): void => {
    if (!isClientAndPlayer) {
      return;
    }

    acceptRequest({ clientId, playerId });
  };
  const handleDecline = (): void => {
    if (!isClientAndPlayer) {
      return;
    }

    declineRequest({ clientId, playerId });
  };

  const navigateToPlayerPage = (): void => {
    navigate(generatePath(`${Paths.player}/:nickname`, { nickname }));
  };

  return (
    <Card className={classes.item} withBorder radius="md" p={0} mb={15}>
      <Flex justify="space-between">
        <Group noWrap spacing={0} w="100%" onClick={navigateToPlayerPage}>
          <Image src={image} withPlaceholder height={60} width={60} />

          <div className={classes.nameWrapper}>
            <Text size="sm" weight={500}>
              {name}
            </Text>
            <Text color="dimmed" size="xs">
              {nickname}
            </Text>
          </div>
        </Group>
        {isSent && (
          <Flex align="center" gap={10} p={10}>
            <ActionIcon onClick={handleAccept} color="green">
              <IoCheckmarkSharp size="1rem" />
            </ActionIcon>

            <ActionIcon onClick={handleDecline} color="red">
              <IoCloseSharp size="1rem" />
            </ActionIcon>
          </Flex>
        )}
      </Flex>
    </Card>
  );
};
