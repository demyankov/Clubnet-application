import { QueryDocumentSnapshot } from 'firebase/firestore';
import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { StorageFolders } from 'constants/storageFolders';
import { errorNotification, successNotification } from 'helpers';
import {
  deleteFirestoreData,
  getFirestoreDataByValue,
  getFirestoreDataLength,
  getTournamentsData,
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
  countOfMembers: string;
  image: File | null;
}

export interface ITournamentData extends Omit<IAddTournamentData, 'image'> {
  image: string;
}

export interface ITournaments {
  tournaments: ITournamentData[];
  latestDoc: Nullable<QueryDocumentSnapshot>;
  isFetching: boolean;
  totalTournamentsCount: number;
  isGetMoreFetching: boolean;
  currentTournament: Nullable<ITournamentData>;
  addTournament: (data: IAddTournamentData) => void;
  getTournaments: () => Promise<void>;
  getMoreTournaments: () => Promise<void>;
  deleteTournament: (id: string) => Promise<void>;
  getTournamentById: (id: string) => Promise<void>;
}

export const tournamentsSlice: GenericStateCreator<TournamentsStore> = (set, get) => ({
  ...get(),
  isFetching: true,
  totalTournamentsCount: 0,
  isGetMoreFetching: false,
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
      const image = await uploadImageAndGetURL(
        data.image!,
        StorageFolders.Images.TournamentImage,
        data.id,
      );

      setFirestoreData<ITournamentData>(DatabasePaths.Tournaments, data.id, {
        ...data,
        image,
      });

      successNotification('tournamentSuccess');
    } catch (error) {
      errorNotification('errorCommon');
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
        state.tournaments = [];
        state.latestDoc = null;
      }),
    );

    try {
      const querySnapshot = await getTournamentsData(null);
      const snapshotLength = await getFirestoreDataLength(DatabasePaths.Tournaments);

      if (querySnapshot.docs) {
        const data: any[] = [];

        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });

        set(
          produce((state: TournamentsStore) => {
            state.tournaments = [...state.tournaments, ...data];
            state.latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            state.totalTournamentsCount = snapshotLength.data().count;
          }),
        );
      }
    } catch (error) {
      errorNotification('errorCommon');
    } finally {
      set(
        produce((state: TournamentsStore) => {
          state.isFetching = false;
        }),
      );
    }
  },

  getMoreTournaments: async () => {
    set(
      produce((state: TournamentsStore) => {
        state.isGetMoreFetching = true;
      }),
    );

    try {
      const querySnapshot = await getTournamentsData(get().latestDoc);

      if (querySnapshot.docs) {
        const data: any[] = [];

        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });

        set(
          produce((state: TournamentsStore) => {
            state.tournaments = [...state.tournaments, ...data];
            state.latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
          }),
        );
      }
    } catch (error) {
      errorNotification('errorCommon');
    } finally {
      set(
        produce((state: TournamentsStore) => {
          state.isGetMoreFetching = false;
        }),
      );
    }
  },

  deleteTournament: async (id: string) => {
    set(
      produce((state: TournamentsStore) => {
        state.isFetching = true;
      }),
    );
    try {
      await deleteFirestoreData(DatabasePaths.Tournaments, id);

      successNotification('successDelete');
    } catch (error) {
      errorNotification('errorCommon');
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
      const data = await getFirestoreDataByValue(DatabasePaths.Tournaments, id);

      set(
        produce((state: TournamentsStore) => {
          state.currentTournament = data;
        }),
      );
    } catch (error) {
      errorNotification('errorCommon');
    } finally {
      set(
        produce((state: TournamentsStore) => {
          state.isFetching = false;
        }),
      );
    }
  },
});
