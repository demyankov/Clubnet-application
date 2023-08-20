import { arrayRemove, arrayUnion } from 'firebase/firestore';
import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import {
  errorHandler,
  successNotification,
  getMembersIdList,
  isIncluded,
  errorNotification,
} from 'helpers';
import {
  Filter,
  getFilteredFirestoreData,
  updateFirestoreData,
} from 'integrations/firebase';
import { IUser } from 'store/slices/auth/types';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface IInviteMember {
  isSearching: boolean;
  isInviteFetching: boolean;
  searchMember: (user: Nullable<IUser>, value?: string) => void;
  addToMembersList: (currentMember: IUser, membersInTeam: IUser[]) => void;
  deleteFromMembersList: (currentId: string) => void;
  clearMembersList: () => void;
  sendInvitation: (teamId: string) => void;
  removeInvitation: (teamId: string, user: Nullable<IUser>) => void;
  dropdownToggle: (isOpen: boolean) => void;
  isDropdownOpen: boolean;
  searchResults: IUser[];
  membersList: IUser[];
  searchResultText: string;
  inviteListText: string;
}

export const inviteMemberSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isSearching: false,
  isInviteFetching: false,
  searchResults: [],
  membersList: [],
  searchResultText: '',
  inviteListText: 'teams.inviteMembersText',
  isDropdownOpen: false,

  searchMember: async (user, value) => {
    try {
      set(
        produce((state: BoundStore) => {
          state.isSearching = true;
        }),
      );

      const filters: Filter<IUser>[] = [];

      if (value) {
        filters.push({
          field: 'nickName',
          value,
        });
      }

      const userId = user?.id || '';

      const { data } = await getFilteredFirestoreData<IUser>(
        DatabasePaths.Users,
        filters,
      );

      const membersIdForAdding = get().membersList.map(({ id }) => id);

      const noAddedMembers = data.filter(
        ({ id }) => !membersIdForAdding.includes(id) && id !== userId,
      );

      if (noAddedMembers.length === 0) {
        set(
          produce((state: BoundStore) => {
            state.searchResultText = 'search.empty';
          }),
        );
      }

      set(
        produce((state: BoundStore) => {
          state.searchResults = noAddedMembers;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isSearching = false;
        }),
      );
    }
  },

  dropdownToggle: (isOpen) => {
    set(
      produce((state: BoundStore) => {
        state.isDropdownOpen = isOpen;
        state.searchResultText = '';
        state.searchResults = [];
      }),
    );
  },

  addToMembersList: (currentMember, membersInTeam) => {
    const currentMemberId = currentMember.id;

    try {
      const membersInTeamIdList = getMembersIdList(membersInTeam);

      const isAlreadyInTeam = isIncluded(membersInTeamIdList, currentMemberId);

      if (isAlreadyInTeam) {
        errorNotification('isAlreadyInTeam');

        return;
      }

      set(
        produce((state: BoundStore) => {
          state.membersList = [...state.membersList, currentMember];

          if (!state.membersList.length) {
            state.inviteListText = 'teams.inviteMembersText';
          } else {
            state.inviteListText = '';
          }
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    }
  },

  deleteFromMembersList: (currentId) => {
    if (currentId) {
      try {
        set(
          produce((state: BoundStore) => {
            const filtredList = state.membersList.filter(
              (member) => member.id !== currentId,
            );

            state.membersList = filtredList;

            if (!state.membersList.length) {
              state.inviteListText = 'teams.inviteMembersText';
            } else {
              state.inviteListText = '';
            }
          }),
        );
      } catch (error) {
        errorHandler(error as Error);
      }
    }
  },

  clearMembersList: () => {
    set(
      produce((state: BoundStore) => {
        state.membersList = [];
      }),
    );
  },

  sendInvitation: async (teamId: string) => {
    try {
      const { membersList } = get();

      if (!membersList.length) {
        errorNotification('nobodyToAddInTheTeam');

        return;
      }

      membersList.map(async ({ id: userId }) => {
        await updateFirestoreData(DatabasePaths.Users, userId, {
          invitation: arrayUnion(teamId),
        });
      });

      successNotification('successfullySendInvitation');
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isInviteFetching = false;
        }),
      );
    }
  },

  removeInvitation: async (teamId, user) => {
    try {
      if (user) {
        const userId = user.id;

        await updateFirestoreData(DatabasePaths.Users, userId, {
          invitation: arrayRemove(teamId),
        });

        successNotification('successfullyRemoveInvitation');
      }
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isInviteFetching = false;
        }),
      );
    }
  },
});
