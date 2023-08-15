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
  orderSlice,
  balanceHistorySlice,
  friendSlice,
  basketSlice,
  shopSlice,
  friendsRequestsSlice,
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
  IOrderActions,
  IBasket,
  IPaymentConfirm,
  IShop,
  IFriendsRequests,
} from 'store/slices';

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
    IShop,
    IBasket,
    IPaymentConfirm,
    ISearch {}

export interface BookingStore
  extends IEstablishmentActions,
    IAddressActions,
    ITableActions,
    IOrderActions {}

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
      ...orderSlice(...a),
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
