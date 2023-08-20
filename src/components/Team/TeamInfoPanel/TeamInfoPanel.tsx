import { FC } from 'react';

import { Badge, Button, Group, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';

import { TeamUserItem } from 'components';
import { InviteMemberModal } from 'components/Team/Modal/InviteMemberModal';
import { Roles } from 'constants/userRoles';
import { useAuth, useInviteMembers } from 'store/store';

export const TeamInfoPanel: FC = () => {
  const { t } = useTranslation();
  const { membersInTeam, currentTeam, user } = useAuth((store) => store);
  const { sendInvitation, clearMembersList } = useInviteMembers((store) => store);

  const captain = membersInTeam.filter(({ role }) => role === Roles.CAPTAIN);
  const isInviteButtonVisible = captain[0]?.id === user?.id;

  const getMembersItems = membersInTeam.map((member) => (
    <TeamUserItem key={member.id} member={member} />
  ));

  const handleInviteMember = (): void => {
    modals.openConfirmModal({
      title: t('modals.inviteMembers'),
      centered: true,
      children: <InviteMemberModal />,
      labels: { confirm: t('modals.btnInvite'), cancel: t('modals.btnCancel') },
      confirmProps: { color: 'blue' },
      onConfirm: () => {
        if (currentTeam?.id) {
          sendInvitation(currentTeam.id);
        }
      },
      onClose: clearMembersList,
    });
  };

  return (
    <>
      <div>
        <Group mb={10} position="apart">
          <Group>
            <Text fz="xl" fw={700}>
              {t('tournaments.members')}
            </Text>
            <Badge w={22} h={22} variant="filled" size="xs" p={0}>
              {membersInTeam.length}
            </Badge>
          </Group>
          {isInviteButtonVisible && (
            <Button onClick={handleInviteMember}>
              {t('teams.inviteMembersButtonText')}
            </Button>
          )}
        </Group>
        {getMembersItems}
      </div>

      <div>
        <Text fz="xl" fw={700} mt={20} mb={20}>
          {t('teams.aboutTeam')}
        </Text>
        <Text>{currentTeam?.about}</Text>
      </div>
    </>
  );
};
