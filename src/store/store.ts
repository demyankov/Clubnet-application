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
  ITournaments,
  IState,
  ISignIn,
  ISignOut,
  IUpdateUser,
  ITeams,
  teamsSlice,
  clientSlice,
  IClients,
  searchSlice,
  ISearch,
  IEstablishmentActions,
  IAdressActions,
} from 'store/slices';

export interface BoundStore
  extends IState,
    ISignIn,
    ISignOut,
    IUpdateUser,
    ITournaments,
    ITeams,
    IClients,
    ISearch {}

export interface BookingStore extends IEstablishmentActions, IAdressActions {}

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
    })),
  ),
);
