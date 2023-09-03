import { arrayRemove, arrayUnion, doc } from 'firebase/firestore';
import { produce } from 'immer';
import { NavigateFunction } from 'react-router-dom';

import { DatabasePaths } from 'constants/databasePaths';
import { Paths } from 'constants/paths';
import { Roles } from 'constants/userRoles';
import {
  errorHandler,
  successNotification,
  errorNotification,
  isValueIncludedInObjectsArray,
} from 'helpers';
import { updateFirestoreData } from 'integrations/firebase';
import { db } from 'integrations/firebase/firebase';
import { ITeam } from 'store/slices/teams/teamsSlice';
import { ITournamentData } from 'store/slices/tournaments/tournamentsSlice';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

interface IGamer {
  id: string;
  role: Roles;
}

export interface IRegistrationForTournament {
  isFetching: boolean;
  addToTournament: (team: ITeam) => void;
  setSelectedTeamId: (id: string) => void;
  toggleGamerForRegistration: (id: string, role: Roles) => void;
  addGamerForRegistration: (id: string, role: Roles) => void;
  clearTeamComposition: () => void;
  clearSelectedTeamId: () => void;
  registerTeam: (
    currentTeam: ITeam,
    tournamentId: string,
    close: Function,
    navigate: NavigateFunction,
  ) => Promise<void>;
  deleteTeamFromTournament: (
    teamId: string,
    tournament: Nullable<ITournamentData>,
  ) => Promise<void>;
  getTeamsInTournament: (tournamentId: string) => Promise<void>;
  selectedTeamId: string;
  teamCompositionForRegistration: IGamer[];
  registeredTeams: ITeam[];
  registrationTeamText: string;
  registrationTeamErrorText: string;
}

export const registrationForTournamentSlice: GenericStateCreator<BoundStore> = (
  set,
  get,
) => ({
  ...get(),
  isFetching: false,
  selectedTeamId: '',
  teamCompositionForRegistration: [],
  registeredTeams: [],
  registrationTeamText: '',
  registrationTeamErrorText: '',

  setSelectedTeamId: (id: string) => {
    set(
      produce((state: BoundStore) => {
        state.selectedTeamId = id;
      }),
    );
  },

  toggleGamerForRegistration: (id, role) => {
    set(
      produce((state: BoundStore) => {
        const { teamCompositionForRegistration: prevState } = state;

        const isGamerIncluded: boolean = isValueIncludedInObjectsArray(
          prevState,
          'id',
          id,
        );

        if (isGamerIncluded) {
          state.teamCompositionForRegistration = prevState.filter(
            ({ id: gamerId }) => gamerId !== id,
          );

          return;
        }

        state.teamCompositionForRegistration = [...prevState, { id, role }];
      }),
    );
  },

  addGamerForRegistration: (id, role) => {
    set(
      produce((state: BoundStore) => {
        const { teamCompositionForRegistration: prevState } = state;

        state.teamCompositionForRegistration = [...prevState, { id, role }];
      }),
    );
  },

  clearSelectedTeamId: () => {
    set(
      produce((state: BoundStore) => {
        state.selectedTeamId = '';
      }),
    );
  },

  clearTeamComposition: () => {
    set(
      produce((state: BoundStore) => {
        state.teamCompositionForRegistration = [];
      }),
    );
  },

  registerTeam: async (currentTeam, tournamentId, close, navigate) => {
    try {
      const countOfSelectedGamers = get().teamCompositionForRegistration.length;
      const registeredTeams = get().currentTournament?.teams || [];
      const { countOfGamersByRules } = get();

      if (countOfGamersByRules !== countOfSelectedGamers) {
        errorNotification('wrongCountOfGamers');
        close();

        return;
      }

      const isAlreadyInTournament = isValueIncludedInObjectsArray(
        registeredTeams,
        'id',
        currentTeam.id,
      );

      if (isAlreadyInTournament) {
        errorNotification('alreadyInTournament');

        return;
      }

      const members = get().teamCompositionForRegistration.map((gamer) => {
        const { id, role } = gamer;
        const gamerRef = doc(db, DatabasePaths.Users, id);

        return { role, userLink: gamerRef };
      });

      const team = {
        ...currentTeam,
        members,
      };

      await updateFirestoreData(DatabasePaths.Tournaments, tournamentId, {
        teams: arrayUnion(team),
      });

      get().clearSelectedTeamId();

      set(
        produce((state: BoundStore) => {
          state.registrationTeamErrorText = '';
        }),
      );

      successNotification('successfullyRegistered');

      close();

      get().getTournamentById(tournamentId);

      if (get().teamCompositionForRegistration.length === get().countOfGamersByRules) {
        navigate(`${Paths.tournaments}/${tournamentId}`);
      }
    } catch (error) {
      errorHandler(error as Error);
    }
  },

  deleteTeamFromTournament: async (teamId, tournament) => {
    try {
      const team = tournament?.teams.filter(({ id }) => teamId === id)[0];

      const tournamentId = tournament?.id;

      if (!team || !tournamentId) return;

      await updateFirestoreData(DatabasePaths.Tournaments, tournament.id, {
        teams: arrayRemove(team),
      });

      successNotification('successDeletedFromTournament');

      await get().getTournamentById(tournamentId);
    } catch (error) {
      errorHandler(error as Error);
    }
  },
});
