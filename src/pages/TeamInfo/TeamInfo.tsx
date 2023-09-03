import { FC, useEffect } from 'react';

import { Box, Group, Image, Overlay, Tabs, Text, useMantineTheme } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import teamBgHeader from 'assets/images/shared/teamBgHeader.jpg';
import { TeamInfoPanel, TeamSettingsPanel, TeamStatsPanel } from 'components';
import { GAMES } from 'constants/games';
import { Roles } from 'constants/userRoles';
import { isDarkTheme } from 'helpers';
import { useAuth } from 'store/store';

const TeamInfo: FC = () => {
  const { id } = useParams();
  const { user, getTeamById, currentTeam, membersInTeam } = useAuth((store) => store);
  const { t } = useTranslation();
  const theme = useMantineTheme();

  useEffect(() => {
    if (id) {
      getTeamById(id);
    }
  }, [getTeamById, id]);

  const currentGame = GAMES.find((game) => game.label === currentTeam?.game);

  const isCaptain: boolean = membersInTeam.some(
    (member) => member.id === user?.id && member.role === Roles.CAPTAIN,
  );

  return (
    <>
      <Box pos="relative">
        <Image src={teamBgHeader} alt="image" width="100%" height="300px" />
        <Overlay
          zIndex={0}
          gradient={`linear-gradient(180deg, rgba(34, 34, 34, 0) 0%, ${
            isDarkTheme(theme.colorScheme) ? '#1A1B1E' : theme.white
          } 100%)`}
          opacity={0.65}
        />
      </Box>

      <Group mb="30px">
        <Image
          src={currentTeam?.image}
          radius="50%"
          withPlaceholder
          width={120}
          height={120}
        />
        <div>
          <Group>
            <Text fw={700} fz="30px">
              {currentTeam?.name}
            </Text>
            <Text fw={700} fz="30px">{`(${currentTeam?.tag})`}</Text>
          </Group>

          <Group>
            <Image src={currentGame?.image} width={30} height={30} />
            <Text fw={600} fz="18px" c="dimmed" ml="-10px">
              {currentGame?.label}
            </Text>
          </Group>
        </div>
      </Group>

      <Tabs defaultValue="info" h="100%">
        <Tabs.List mb={30}>
          <Tabs.Tab value="info">{t('teams.teamInfo')}</Tabs.Tab>
          <Tabs.Tab value="stats">{t('profile.profileStats')}</Tabs.Tab>
          {isCaptain && (
            <Tabs.Tab
              value="settings"
              rightSection={<IconSettings size="1.2rem" />}
              ml="auto"
            >
              {t('teams.settings')}
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="info" mih={350} mb={60}>
          <TeamInfoPanel />
        </Tabs.Panel>

        <Tabs.Panel value="stats" mih={350} mb={60}>
          <TeamStatsPanel />
        </Tabs.Panel>

        <Tabs.Panel value="settings" mih={350} mb={60}>
          <TeamSettingsPanel />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default TeamInfo;
