import { FC, MouseEvent } from 'react';

import { Button, Card, createStyles, Group, Image, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { ITeam } from 'store/slices';
import { useAuth } from 'store/store';

const useStyles = createStyles({
  item: {
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.006)',
    },
  },
});

type Props = {
  teamData: ITeam;
  handleDelete?: (e: MouseEvent<HTMLButtonElement>, id: string) => void;
};

export const TeamLink: FC<Props> = ({
  teamData: { game, id, image, name, tag, members },
  handleDelete,
}) => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { user } = useAuth((store) => store);

  const isCurrentUserCreator = user?.id === members?.[0]?.userLink?.id;

  return (
    <Card
      className={classes.item}
      withBorder
      radius="md"
      p={0}
      onClick={() => navigate(`${Paths.teams}/${id}`)}
      mb={15}
    >
      <Group noWrap spacing={0}>
        <Image src={image} withPlaceholder height={60} width={60} />

        <div style={{ flex: 1, paddingLeft: '10px' }}>
          <Text size="sm" weight={500}>
            {`${name} (${tag})`}
          </Text>

          <Text color="dimmed" size="xs">
            {game}
          </Text>
        </div>
        <Group pr="16px">
          {isCurrentUserCreator && handleDelete && (
            <Button
              variant="light"
              color="red"
              size="xs"
              mr="16px"
              uppercase
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                handleDelete(e, id);
              }}
            >
              {t('modals.btnDelete')}
            </Button>
          )}

          <IconChevronRight size="0.9rem" stroke={1.5} />
        </Group>
      </Group>
    </Card>
  );
};
