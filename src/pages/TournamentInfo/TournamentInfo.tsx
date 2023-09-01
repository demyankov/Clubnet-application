import { FC, useEffect } from 'react';

import {
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Image,
  Overlay,
  Stack,
  Tabs,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {
  IconClockHour2,
  IconDeviceGamepad2,
  IconLayoutGrid,
  IconUsersGroup,
  IconWriting,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { TournamentsInfoItem, TeamsListInTournament, BadgeTotalCount } from 'components';
import { Paths } from 'constants/paths';
import { isDarkTheme, dateFormatting } from 'helpers';
import { useTeams, useTournaments } from 'store/store';

const TournamentInfo: FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { getTeamById } = useTeams((store) => store);
  const navigate = useNavigate();

  const { currentTournament, selectedTeamId, getTournamentById } = useTournaments(
    (state) => state,
  );

  const theme = useMantineTheme();

  useEffect(() => {
    if (id) {
      getTournamentById(id);
    }
  }, [getTournamentById, id]);

  useEffect(() => {
    getTeamById(selectedTeamId);
  }, [getTeamById, selectedTeamId]);

  return (
    <div>
      <Box pos="relative">
        <Image src={currentTournament?.image} alt="image" width="100%" height="200px" />
        <Overlay
          zIndex={0}
          gradient={`linear-gradient(180deg, rgba(34, 34, 34, 0) 0%, ${
            isDarkTheme(theme.colorScheme) ? '#1A1B1E' : theme.white
          } 100%)`}
          opacity={0.65}
        />
      </Box>

      <Group position="apart" mb="30px">
        <div>
          <Text c="dimmed" fz="xl">
            {dateFormatting(new Date(currentTournament?.expectedDate || ''))}
          </Text>
          <Text fw={700} fz="30px">
            {currentTournament?.name}
          </Text>
          <Text c="dimmed" fz="xl">
            {currentTournament?.game} · {currentTournament?.format}
          </Text>
        </div>
        <Stack>
          <Button w={140} color="green" variant="outline">
            {t('tournaments.submit')}
          </Button>
          <Button w={140} mt={20} color="red" variant="outline">
            {t('tournaments.editTournament')}
          </Button>
        </Stack>
      </Group>
      <Tabs defaultValue="match">
        <Tabs.List>
          <Tabs.Tab value="match">{t('tournaments.match')}</Tabs.Tab>
          <Tabs.Tab
            rightSection={
              <BadgeTotalCount totalCount={currentTournament?.teams.length || 0} />
            }
            value="participants"
          >
            {t('tournaments.members')}
          </Tabs.Tab>
          <Tabs.Tab value="rules">{t('tournaments.rules')}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="match" pt="xs">
          <Flex justify="space-between">
            <Text fw={700} fz="xl" mt="10px">
              {t('tournaments.details')}
            </Text>
            <Button onClick={() => navigate(Paths.teamRegistration)}>
              {t('tournaments.registration')}
            </Button>
          </Flex>
          <Grid mt="10px" gutter="xl">
            <TournamentsInfoItem
              title={t('tournaments.game')}
              text={currentTournament?.game}
              Icon={IconDeviceGamepad2}
            />
            <TournamentsInfoItem
              title={t('tournaments.teamSize')}
              text={currentTournament?.gameMode}
              Icon={IconUsersGroup}
            />
            <TournamentsInfoItem
              title={t('modals.tournamentFormat')}
              text={currentTournament?.format}
              Icon={IconLayoutGrid}
            />
            <TournamentsInfoItem
              title={t('tournaments.tournamentRegistration')}
              text={dateFormatting(new Date(currentTournament?.registrationDate || ''))}
              Icon={IconWriting}
            />
            <TournamentsInfoItem
              title={t('modals.startTime')}
              text={dateFormatting(new Date(currentTournament?.expectedDate || ''))}
              Icon={IconClockHour2}
            />
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="participants" pt="xs">
          <TeamsListInTournament />
        </Tabs.Panel>

        <Tabs.Panel value="rules" pt="xs">
          Здесь скоро будут правила
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default TournamentInfo;
