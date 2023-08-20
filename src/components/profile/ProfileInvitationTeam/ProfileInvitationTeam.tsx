import { FC, MouseEvent } from 'react';

import { Button, Card, createStyles, Group, Image, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconChevronRight } from '@tabler/icons-react';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { ITeam } from 'store/slices';
import { useAuth, useInviteMembers } from 'store/store';

const useStyles = createStyles({
  item: {
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.006)',
    },
  },

  gameWrapper: {
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'space-around',
    gap: '0px',
    flex: 1,
    paddingLeft: '10px',
  },
});

type Props = {
  teamData: ITeam;
};

export const ProfileInvitationTeam: FC<Props> = ({
  teamData: { game, id, image, name, tag },
}) => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { removeInvitation } = useInviteMembers((store) => store);
  const { user, addMember, getMemberInvitedTeams } = useAuth((store) => store);

  const handleRemovePlayer = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    modals.openConfirmModal({
      title: t('modals.removeInvitationTitle'),
      centered: true,
      children: <Text size="sm">{t('modals.agreeToRemoveInvitation')}</Text>,
      labels: { confirm: t('modals.btnDelete'), cancel: t('modals.btnCancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (user) {
          removeInvitation(id, user);
          getMemberInvitedTeams(user);
        }
      },
    });
  };

  const handleAcceptPlayer = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    modals.openConfirmModal({
      title: t('modals.acceptInvitationTitle'),
      centered: true,
      children: <Text size="sm">{t('modals.acceptInvitation')}</Text>,
      labels: { confirm: t('modals.btnAccept'), cancel: t('modals.btnCancel') },
      confirmProps: { color: 'blue' },
      onConfirm: () => {
        addMember(id);
      },
    });
  };

  const handleNavigate = (): void => navigate(`${Paths.teams}/${id}`);

  return (
    <Card
      className={classes.item}
      withBorder
      radius="md"
      p={0}
      onClick={handleNavigate}
      mb={15}
    >
      <Group noWrap spacing={0}>
        <Image src={image} withPlaceholder height={60} width={60} />

        <Group className={classes.gameWrapper}>
          <Text size="sm" weight={500}>
            {`${name} (${tag})`}
          </Text>

          <Text color="dimmed" size="xs">
            {game}
          </Text>
        </Group>
        <Group pr="16px">
          <Button
            variant="light"
            color="red"
            size="xs"
            mr="16px"
            uppercase
            onClick={handleRemovePlayer}
          >
            {t('modals.btnRefuse')}
          </Button>
          <Button
            variant="light"
            color="blue"
            size="xs"
            mr="16px"
            uppercase
            onClick={handleAcceptPlayer}
          >
            {t('modals.btnAccept')}
          </Button>
          <IconChevronRight size="0.9rem" stroke={1.5} />
        </Group>
      </Group>
    </Card>
  );
};
