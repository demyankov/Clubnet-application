import { QueryDocumentSnapshot } from 'firebase/firestore';
import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { StorageFolders } from 'constants/storageFolders';
import { errorHandler, successNotification } from 'helpers';
import {
  deleteFirestoreData,
  deleteImageFromStorage,
  getFirestoreData,
  getFireStoreDataByFieldName,
  setFirestoreData,
  uploadImageAndGetURL,
} from 'integrations/firebase';
import { BoundStore } from 'store/store';
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
  image: Nullable<File>;
}

export interface ITournamentData extends Omit<IAddTournamentData, 'image'> {
  image: string;
}

export interface ITournaments {
  tournaments: ITournamentData[];
  latestDoc: Nullable<QueryDocumentSnapshot>;
  isFetching: boolean;
  isGetMoreFetching: boolean;
  currentTournament: Nullable<ITournamentData>;
  addTournament: (data: IAddTournamentData) => Promise<void>;
  getTournaments: () => Promise<void>;
  getMoreTournaments: () => Promise<void>;
  deleteTournament: (id: string, image: string) => Promise<void>;
  getTournamentById: (id: string) => Promise<void>;
  totalCount: number;
  querySnapshot: any;
}

export const tournamentsSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isFetching: true,
  isGetMoreFetching: false,
  latestDoc: null,
  currentTournament: null,
  tournaments: [],
  totalCount: 0,
  querySnapshot: null,

  addTournament: async (data: IAddTournamentData) => {
    set(
      produce((state: BoundStore) => {
        state.isFetching = true;
      }),
    );

    try {
      const image = await uploadImageAndGetURL(
        data.image!,
        StorageFolders.Images.TournamentImage,
        data.id,
      );

      await setFirestoreData<ITournamentData>(DatabasePaths.Tournaments, data.id, {
        ...data,
        image,
      });

      successNotification('tournamentSuccess');
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isFetching = false;
        }),
      );
    }
  },

  getTournaments: async () => {
    try {
      set(
        produce((state: BoundStore) => {
          state.isFetching = true;
        }),
      );

      const { data, totalCount, querySnapshot } = await getFirestoreData<
        ITournamentData,
        string
      >(DatabasePaths.Tournaments);

      set(
        produce((state: BoundStore) => {
          state.tournaments = data;
          state.totalCount = totalCount;
          state.querySnapshot = querySnapshot;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isFetching = false;
        }),
      );
    }
  },

  getMoreTournaments: async () => {
    try {
      set(
        produce((state: BoundStore) => {
          state.isGetMoreFetching = true;
        }),
      );

      const lastVisible = get().querySnapshot?.docs[get().querySnapshot.docs.length - 1];

      const { data, totalCount, querySnapshot } = await getFirestoreData<
        ITournamentData,
        string
      >(DatabasePaths.Tournaments, [], lastVisible as any);

      set(
        produce((state: BoundStore) => {
          state.tournaments = [...state.tournaments, ...data];
          state.totalCount = totalCount;
          state.querySnapshot = querySnapshot;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isGetMoreFetching = false;
        }),
      );
    }
  },

  deleteTournament: async (id, image) => {
    set(
      produce((state: BoundStore) => {
        state.isFetching = true;
      }),
    );
    try {
      await deleteFirestoreData(DatabasePaths.Tournaments, id);
      await deleteImageFromStorage(image);

      successNotification('successDelete');
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isFetching = false;
        }),
      );
    }
  },

  getTournamentById: async (id: string) => {
    set(
      produce((state: BoundStore) => {
        state.isFetching = true;
      }),
    );
    try {
      const data = await getFireStoreDataByFieldName(DatabasePaths.Tournaments, id);

      set(
        produce((state: BoundStore) => {
          state.currentTournament = data;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isFetching = false;
        }),
      );
    }
  },
});
