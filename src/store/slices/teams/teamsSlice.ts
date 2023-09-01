import { modals } from '@mantine/modals';
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore';
import { produce } from 'immer';

import { ITeamFormValues } from 'components';
import { DatabasePaths } from 'constants/databasePaths';
import { StorageFolders } from 'constants/storageFolders';
import { Roles } from 'constants/userRoles';
import { errorHandler, errorNotification, successNotification } from 'helpers';
import {
  addFirestoreTeam,
  checkFieldValueExists,
  deleteFirestoreData,
  Filter,
  getFilteredFirestoreData,
  getFirestoreArrayLengthByField,
  getFireStoreDataByFieldName,
  getFirestoreTeamMembers,
  updateFirestoreData,
  uploadImageAndGetURL,
  getFirestoreTeams,
} from 'integrations/firebase';
import { db } from 'integrations/firebase/firebase';
import { IUser } from 'store/slices/auth/types';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

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
  memberInvitedTeams: ITeam[];
  membersInTeam: IUser[];
  addTeam: (teamData: ITeam, resetForm: () => void) => Promise<void>;
  getTeams: (id: string) => Promise<void>;
  getTeamById: (id: string) => Promise<void>;
  getTeamsByRole: (id: string, role: Roles) => Promise<void>;
  getMemberInvitedTeams: (user: IUser) => Promise<void>;
  updateTeam: (data: ITeamFormValues) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  addMember: (teamId: string) => Promise<void>;
}

export const teamsSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isTeamFetching: false,
  isUpdateTeamFetching: false,
  teams: [],
  currentTeam: null,
  memberInvitedTeams: [],
  membersInTeam: [],

  addTeam: async (teamData: ITeam, resetForm: () => void) => {
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
      modals.close('ProfileCreateTeamModal');
      resetForm();
      successNotification('successAddedTeam');
      await get().getTeams(currentUser.id);
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

  getTeams: async (id) => {
    set(
      produce((state: BoundStore) => {
        state.isTeamFetching = true;
      }),
    );

    try {
      const data = await getFirestoreTeams(DatabasePaths.Users, id);

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

  getTeamsByRole: async (id, role) => {
    set(
      produce((state: BoundStore) => {
        state.isTeamFetching = true;
      }),
    );

    try {
      const data = await getFirestoreTeams(DatabasePaths.Users, id, role);

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
      const currentTeam = await getFireStoreDataByFieldName<ITeam>(
        DatabasePaths.Teams,
        id,
      );

      if (currentTeam && currentTeam.members?.length) {
        const membersInTeam = await getFirestoreTeamMembers(currentTeam.members);

        set(
          produce((state: BoundStore) => {
            state.currentTeam = currentTeam;
            state.membersInTeam = membersInTeam;
          }),
        );
      }
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

  deleteTeam: async (teamId) => {
    try {
      const currentUser = get().user as IUser;

      set(
        produce((state: BoundStore) => {
          state.isTeamFetching = false;
        }),
      );

      await deleteFirestoreData(DatabasePaths.Teams, teamId);
      successNotification('successDeletedTeam');

      const filter: Filter<IUser> = {
        field: 'invitation',
        value: teamId,
      };
      const { data } = await getFilteredFirestoreData<IUser>(
        DatabasePaths.Users,
        [filter],
        'and',
        null,
        'invitation',
        'array-contains',
        1000,
      );

      await Promise.all(
        data.map(async (userDoc) => {
          const userId = userDoc.id;

          await updateFirestoreData(DatabasePaths.Users, userId, {
            invitation: arrayRemove(teamId),
          });
        }),
      );

      await get().getTeams(currentUser.id);

      set(
        produce((state: BoundStore) => {
          state.isTeamFetching = false;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
      set(
        produce((state: BoundStore) => {
          state.isTeamFetching = false;
        }),
      );
    }
  },

  getMemberInvitedTeams: async (user) => {
    try {
      const teamsIdList = user.invitation;
      let teams = [] as ITeam[];

      if (teamsIdList) {
        teams = await teamsIdList.reduce(async (acc, teamId) => {
          const prevTeams = await acc;

          await get().getTeamById(teamId);
          const team = get().currentTeam;

          return [...prevTeams, team];
        }, Promise.resolve([]) as any);
      }
      set(
        produce((state: BoundStore) => {
          state.memberInvitedTeams = teams;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    }
  },

  addMember: async (teamId) => {
    const currentUser = get().user as IUser;
    const userId = currentUser.id;

    try {
      const userRef = doc(db, DatabasePaths.Users, userId);

      const memberData: ITeamMember = {
        userLink: userRef,
        role: Roles.USER,
      };

      await updateFirestoreData(DatabasePaths.Teams, teamId, {
        members: arrayUnion(memberData),
      });

      successNotification('successAcceptInvitation');

      await updateFirestoreData(DatabasePaths.Users, userId, {
        invitation: arrayRemove(teamId),
      });
    } catch (error) {
      errorHandler(error as Error);
    }
  },
});
