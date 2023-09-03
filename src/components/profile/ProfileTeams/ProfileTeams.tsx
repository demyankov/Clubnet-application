import { FC, MouseEvent, useCallback, useEffect, useMemo } from 'react';

import { Button, createStyles, Group, Tabs, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import {
  BadgeTotalCount,
  ProfileInvitationTeam,
  TeamLink,
  ProfileCreateTeamModal,
  RenderContentContainer,
} from 'components';
import { ProfileTeamsTabs } from 'constants/profileTeamsTabs';
import { TabsValues } from 'constants/tabs';
import { useAuth, useTeams } from 'store/store';

const useStyles = createStyles({
  wrapper: {
    position: 'relative',
  },
});

export const ProfileTeams: FC = () => {
  const { user, isTeamFetching, teams, getTeams, deleteTeam } = useAuth((store) => store);
  const { memberInvitedTeams, getMemberInvitedTeams } = useTeams((store) => store);
  const { classes } = useStyles();

  const { t } = useTranslation();

  const teamsIdList = user?.invitation || [];

  const isFetching = isTeamFetching && !teams.length;

  const handleOpenCreateTeamModal = (): void => {
    modals.open({
      modalId: 'ProfileCreateTeamModal',
      title: t('teams.modalTitle'),
      children: <ProfileCreateTeamModal />,
      centered: true,
    });
  };

  const handleDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>, id: string): void => {
      e.stopPropagation();
      modals.openConfirmModal({
        title: t('modals.deleteTeam'),
        centered: true,
        children: <Text size="sm">{t('modals.agreeToDeleteTeam')}</Text>,
        labels: { confirm: t('modals.btnDelete'), cancel: t('modals.btnCancel') },
        confirmProps: { color: 'red' },
        onConfirm: () => deleteTeam(id),
      });
    },
    [deleteTeam, t],
  );

  const handleGetInvitations = (): void => {
    if (user) {
      getMemberInvitedTeams(user);
    }
  };

  useEffect(() => {
    if (user) {
      getTeams(user.id);
      getMemberInvitedTeams(user);
    }
  }, [getMemberInvitedTeams, getTeams, teamsIdList.length, user]);

  const teamsItems: JSX.Element = useMemo(
    () => (
      <>
        {teams.map((team) => (
          <TeamLink key={team.id} teamData={team} handleDelete={handleDelete} />
        ))}
      </>
    ),
    [teams, handleDelete],
  );

  const invitationsList: JSX.Element = (
    <>
      {memberInvitedTeams.map((team) => (
        <ProfileInvitationTeam key={team.id} teamData={team} />
      ))}
    </>
  );

  return (
    <Tabs variant="outline" defaultValue={TabsValues.teams} h="100%" pl={20} pr={20}>
      <Tabs.List mb={30}>
        <Tabs.Tab value={ProfileTeamsTabs.teams}>{t('profile.profileTeams')}</Tabs.Tab>
        <Tabs.Tab
          onClick={handleGetInvitations}
          value={ProfileTeamsTabs.invitations}
          rightSection={<BadgeTotalCount totalCount={teamsIdList.length} />}
        >
          {t('profile.profileInvitations')}
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel
        value={ProfileTeamsTabs.teams}
        mih={350}
        mb={60}
        className={classes.wrapper}
      >
        <Group mb={30} align="center">
          <Text fz="xl" fw={700} inline align="center">
            {t('profile.profileTeams')}
          </Text>
          <Button
            onClick={handleOpenCreateTeamModal}
            variant="light"
            w={30}
            h={30}
            p={0}
            radius="100%"
          >
            <IconPlus size={15} />
          </Button>
        </Group>
        <RenderContentContainer isFetching={isFetching}>
          {teams.length ? (
            teamsItems
          ) : (
            <Text fz="xl" fw={700} mb={10}>
              {t('profile.createTeam')}
            </Text>
          )}
        </RenderContentContainer>
      </Tabs.Panel>
      <Tabs.Panel value={ProfileTeamsTabs.invitations} mih={350} mb={60}>
        {invitationsList}
      </Tabs.Panel>
    </Tabs>
  );
};
