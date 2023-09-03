import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
  initSlice,
  signInSlice,
  signOutSlice,
  updateUserSlice,
  tournamentsSlice,
  establishmentSlice,
  addressSlice,
  teamsSlice,
  clientSlice,
  searchSlice,
  tableSlice,
  bookingSlice,
  balanceHistorySlice,
  friendSlice,
  basketSlice,
  shopSlice,
  paymentConfirmSlice,
  ITournaments,
  IState,
  ISignIn,
  ISignOut,
  IUpdateUser,
  ITeams,
  IClients,
  ISearch,
  IEstablishmentActions,
  IBalanceHistory,
  IFriends,
  IAddressActions,
  ITableActions,
  IBookingActions,
  IInviteMember,
  inviteMemberSlice,
  IBasket,
  IPaymentConfirm,
  IShop,
  registrationForTournamentSlice,
  IRegistrationForTournament,
} from 'store/slices';
import {
  friendsRequestsSlice,
  IFriendsRequests,
} from 'store/slices/friends/friendsRequestsSlice';

export interface BoundStore
  extends IState,
    ISignIn,
    ISignOut,
    IUpdateUser,
    ITournaments,
    ITeams,
    IClients,
    IBalanceHistory,
    IFriends,
    IFriendsRequests,
    IRegistrationForTournament,
    IShop,
    IBasket,
    IPaymentConfirm,
    IInviteMember,
    ISearch {}

export interface BookingStore
  extends IEstablishmentActions,
    IAddressActions,
    ITableActions,
    IBookingActions {}

export const useAuth = create(
  devtools(
    immer<BoundStore>((...a) => ({
      ...initSlice(...a),
      ...signInSlice(...a),
      ...signOutSlice(...a),
      ...updateUserSlice(...a),
      ...teamsSlice(...a),
    })),
  ),
);

export const useTournaments = create(
  devtools(
    immer<BoundStore>((...a) => ({
      ...tournamentsSlice(...a),
      ...registrationForTournamentSlice(...a),
    })),
  ),
);

export const useTeams = create(
  devtools(
    immer<BoundStore>((...a) => ({
      ...teamsSlice(...a),
    })),
  ),
);

export const useInviteMembers = create(
  devtools(
    immer<BoundStore>((...a) => ({
      ...inviteMemberSlice(...a),
    })),
  ),
);

export const useClients = create(
  devtools(
    immer<BoundStore>((...a) => ({
      ...clientSlice(...a),
    })),
  ),
);

export const useSearch = create(
  devtools(
    immer<BoundStore>((...a) => ({
      ...searchSlice(...a),
    })),
  ),
);

export const useBookings = create(
  devtools(
    immer<BookingStore>((...a) => ({
      ...establishmentSlice(...a),
      ...addressSlice(...a),
      ...tableSlice(...a),
      ...bookingSlice(...a),
    })),
  ),
);

export const useBalanceHistory = create(
  devtools(
    immer<BoundStore>((...a) => ({
      ...balanceHistorySlice(...a),
    })),
  ),
);

export const useFriends = create(
  devtools(
    immer<BoundStore>((...a) => ({
      ...friendSlice(...a),
      ...friendsRequestsSlice(...a),
    })),
  ),
);

export const useShop = create(
  devtools(
    immer<BoundStore>((...a) => ({
      ...shopSlice(...a),
      ...basketSlice(...a),
      ...paymentConfirmSlice(...a),
    })),
  ),
);
