import { FC } from 'react';

import { Card, createStyles, Group, Image, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { ITeam } from 'store/slices';

const useStyles = createStyles({
  item: {
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.006)',
    },
  },
});

type Props = { teamData: ITeam };

export const TeamLink: FC<Props> = ({ teamData: { game, id, image, name, tag } }) => {
  const { classes } = useStyles();
  const navigate = useNavigate();

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

        <div style={{ paddingRight: '10px' }}>
          <IconChevronRight size="0.9rem" stroke={1.5} />
        </div>
      </Group>
    </Card>
  );
};
