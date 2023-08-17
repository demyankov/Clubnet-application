import { FC, useEffect } from 'react';

import {
  Badge,
  Box,
  Button,
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
import { useParams } from 'react-router-dom';

import { RenderContentContainer, TournamentsInfoItem } from 'components';
import { isDarkTheme, dateFormatting } from 'helpers';
import { useTournaments } from 'store/store';

const TournamentInfo: FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { currentTournament, getTournamentById, isFetching } = useTournaments(
    (state) => state,
  );
  const theme = useMantineTheme();

  useEffect(() => {
    if (id) {
      getTournamentById(id);
    }
  }, [getTournamentById, id]);

  return (
    <div>
      <RenderContentContainer
        isFetching={isFetching}
        isEmpty={!currentTournament}
        emptyTitle={t('notFound.info')}
      >
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
                <Badge
                  w={16}
                  h={16}
                  sx={{ pointerEvents: 'none' }}
                  variant="filled"
                  size="xs"
                  p={0}
                >
                  0
                </Badge>
              }
              value="participants"
            >
              {t('tournaments.members')}
            </Tabs.Tab>
            <Tabs.Tab value="rules">{t('tournaments.rules')}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="match" pt="xs">
            <Text fw={700} fz="xl" mt="10px">
              {t('tournaments.details')}
            </Text>

            <Grid mt="10px" gutter="xl">
              <TournamentsInfoItem
                title={t('modals.games')}
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
            Здесь скоро будут участники
          </Tabs.Panel>

          <Tabs.Panel value="rules" pt="xs">
            Здесь скоро будут правила
          </Tabs.Panel>
        </Tabs>
      </RenderContentContainer>
    </div>
  );
};

export default TournamentInfo;
