import { DocumentData, DocumentReference } from 'firebase/firestore';
import { produce } from 'immer';

import { ITeamFormValues } from 'components/Team';
import { DatabasePaths } from 'constants/databasePaths';
import { StorageFolders } from 'constants/storageFolders';
import { Roles } from 'constants/userRoles';
import { errorHandler, errorNotification, successNotification } from 'helpers';
import {
  addFirestoreTeam,
  checkFieldValueExists,
  getFireStoreDataById,
  getFirestoreArrayLengthByField,
  getFirestoreTeamMembers,
  getFirestoreTeams,
  updateFirestoreData,
  uploadImageAndGetURL,
} from 'integrations/firebase';
import { BoundStore } from 'store/store';
import { GenericStateCreator, IUser } from 'store/types';

export interface ITeamMember {
  userLink: Nullable<DocumentReference<DocumentData>>;
  role: Roles;
}

export interface ITeam {
  name: string;
  tag: string;
  game: string;
  id: string;
  image?: string;
  members?: ITeamMember[];
  about?: string;
}

export interface ITeams {
  isTeamFetching: boolean;
  isUpdateTeamFetching: boolean;
  teams: ITeam[];
  currentTeam: Nullable<ITeam>;
  members: IUser[];
  addTeam: (teamData: ITeam) => void;
  getTeams: () => void;
  getTeamById: (id: string) => void;
  updateTeam: (data: ITeamFormValues) => any;
}

export const teamsSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isTeamFetching: false,
  isUpdateTeamFetching: false,
  teams: [],
  currentTeam: null,
  members: [],

  addTeam: async (teamData: ITeam) => {
    set(
      produce((state: BoundStore) => {
        state.isTeamFetching = true;
      }),
    );

    const currentUser = get().user as IUser;

    try {
      const teamsCount = await getFirestoreArrayLengthByField(
        DatabasePaths.Users,
        currentUser.id,
        'members',
        'userLink',
        Roles.CAPTAIN,
        DatabasePaths.Teams,
      );

      const sameTeam = await checkFieldValueExists(
        DatabasePaths.Teams,
        'tag',
        teamData.tag,
      );

      const isMaxTeamsCount: boolean = teamsCount >= 5;

      if (isMaxTeamsCount) {
        errorNotification('maxTeamsCount');

        return;
      }

      if (sameTeam) {
        errorNotification('sameTeam');

        return;
      }

      await addFirestoreTeam<ITeam>(
        DatabasePaths.Users,
        currentUser.id,
        DatabasePaths.Teams,
        teamData,
      );

      successNotification('successAddedTeam');
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isTeamFetching = false;
        }),
      );
    }
  },

  getTeams: async () => {
    set(
      produce((state: BoundStore) => {
        state.isTeamFetching = true;
      }),
    );

    const currentUser = get().user as IUser;

    try {
      const data = await getFirestoreTeams(DatabasePaths.Users, currentUser.id);

      set(
        produce((state: BoundStore) => {
          state.teams = data;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isTeamFetching = false;
        }),
      );
    }
  },

  getTeamById: async (id) => {
    set(
      produce((state: BoundStore) => {
        state.isTeamFetching = true;
      }),
    );

    try {
      const currentTeam = await getFireStoreDataById(DatabasePaths.Teams, id);
      const members = await getFirestoreTeamMembers(currentTeam.members);

      set(
        produce((state: BoundStore) => {
          state.currentTeam = currentTeam;
          state.members = members;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isTeamFetching = false;
        }),
      );
    }
  },

  updateTeam: async (data) => {
    set(
      produce((state: BoundStore) => {
        state.isUpdateTeamFetching = true;
      }),
    );

    try {
      const currentTeam = get().currentTeam as ITeam;
      let updatedData: any;
      const { image, name, game, about } = data;

      if (image instanceof File) {
        const uploadedImage = await uploadImageAndGetURL(
          image,
          StorageFolders.Images.TeamImage,
          currentTeam.id,
        );

        updatedData = { ...data, image: uploadedImage };
      } else {
        updatedData = { name, game, about };
      }

      await updateFirestoreData(DatabasePaths.Teams, currentTeam.id, updatedData);

      successNotification('successCommon');

      set(
        produce((state: BoundStore) => {
          state.currentTeam = { ...currentTeam, ...updatedData };
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isUpdateTeamFetching = false;
        }),
      );
    }
  },
});
