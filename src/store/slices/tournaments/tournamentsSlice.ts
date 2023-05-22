import { QueryDocumentSnapshot } from 'firebase/firestore';
import { t } from 'i18next';
import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { errorNotification, successNotification } from 'helpers';
import {
  deleteFirestoreData,
  getTournamentsData,
  getFirestoreDataById,
  setFirestoreData,
  uploadImageAndGetURL,
} from 'integrations/firebase';
import { TournamentsStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

interface IAddTournamentData {
  id: string;
  name: string;
  game: string;
  format: string;
  expectedDate: string;
  registrationDate: string;
  gameMode: string;
  image: File | null;
}

export interface ITournamentData extends Omit<IAddTournamentData, 'image'> {
  image: string;
}

export interface ITournaments {
  tournaments: ITournamentData[];
  latestDoc: Nullable<QueryDocumentSnapshot>;
  isEmpty: boolean;
  isFetching: boolean;
  currentTournament: Nullable<ITournamentData>;
  addTournament: (data: IAddTournamentData) => void;
  getTournaments: () => Promise<void>;
  clearTournaments: () => void;
  deleteTournament: (id: string) => Promise<void>;
  getTournamentById: (id: string) => Promise<void>;
}

export const tournamentsSlice: GenericStateCreator<TournamentsStore> = (set, get) => ({
  ...get(),
  isFetching: false,
  isEmpty: false,
  latestDoc: null,
  currentTournament: null,
  tournaments: [],

  addTournament: async (data: IAddTournamentData) => {
    set(
      produce((state: TournamentsStore) => {
        state.isFetching = true;
      }),
    );

    try {
      const image = await uploadImageAndGetURL(data.image!, data.id);

      setFirestoreData<ITournamentData>(
        DatabasePaths.Tournaments,
        { ...data, image },
        data.id,
      );

      successNotification(t, 'tournamentSuccess');
    } catch (error) {
      errorNotification(t, 'errorCommon');
    } finally {
      set(
        produce((state: TournamentsStore) => {
          state.isFetching = false;
        }),
      );
    }
  },

  getTournaments: async () => {
    set(
      produce((state: TournamentsStore) => {
        state.isFetching = true;
      }),
    );

    try {
      const querySnapshot = await getTournamentsData(get().latestDoc);

      if (querySnapshot.docs) {
        const data: any[] = [];

        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });

        if (querySnapshot.empty) {
          successNotification(t, 'emptyTournaments');
          set(
            produce((state: TournamentsStore) => {
              state.isEmpty = true;
            }),
          );
        }

        set(
          produce((state: TournamentsStore) => {
            state.tournaments = [...state.tournaments, ...data];
            state.latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
          }),
        );
      }
    } catch (error) {
      errorNotification(t, 'errorCommon');
    } finally {
      set(
        produce((state: TournamentsStore) => {
          state.isFetching = false;
        }),
      );
    }
  },

  clearTournaments: () => {
    set(
      produce((state: TournamentsStore) => {
        state.tournaments = [];
        state.latestDoc = null;
        state.isEmpty = false;
      }),
    );
  },

  deleteTournament: async (id: string) => {
    set(
      produce((state: TournamentsStore) => {
        state.isFetching = true;
      }),
    );
    try {
      deleteFirestoreData(DatabasePaths.Tournaments, id);

      successNotification(t, 'successDelete');
    } catch (error) {
      errorNotification(t, 'errorCommon');
    } finally {
      set(
        produce((state: TournamentsStore) => {
          state.isFetching = false;
        }),
      );
    }
  },

  getTournamentById: async (id: string) => {
    set(
      produce((state: TournamentsStore) => {
        state.isFetching = true;
      }),
    );
    try {
      const data = await getFirestoreDataById(DatabasePaths.Tournaments, id);

      set(
        produce((state: TournamentsStore) => {
          state.currentTournament = data;
        }),
      );
    } catch (error) {
      errorNotification(t, 'errorCommon');
    } finally {
      set(
        produce((state: TournamentsStore) => {
          state.isFetching = false;
        }),
      );
    }
  },
});
