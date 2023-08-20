import { produce } from 'immer';

import { DatabaseId } from 'constants/databaseId';
import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler } from 'helpers';
import { uniqueIdGenerator } from 'helpers/uniqueIdGenerator';
import {
  getFilteredFirestoreData,
  setFirestoreData,
  updateFirestoreData,
  deleteFirestoreData,
  getDataArrayWithRefArray,
  getFirestoreData,
  Filter,
} from 'integrations/firebase';
import { IAddress, IEstablishment, IBooking } from 'store/slices/bookings/types';
import { BookingStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

type EstablishmentAndAddressData = Pick<IEstablishment, 'name'> &
  Omit<IAddress, 'id' | 'tables'>;

export interface IEstablishmentActions {
  establishmentActions: {
    isEstablishmentFetching: boolean;
    isUpdating: boolean;
    establishments: IEstablishment[];
    currentEstablishment: Nullable<IEstablishment>;

    getEstablishments: () => Promise<void>;
    addEstablishmentAndAddress: (data: EstablishmentAndAddressData) => Promise<void>;
    updateEstablishment: (data: Partial<IEstablishment>) => Promise<void>;
    deleteEstablishment: () => Promise<void>;
  };
}

export const establishmentSlice: GenericStateCreator<BookingStore> = (set, get) => ({
  ...get(),
  establishmentActions: {
    isEstablishmentFetching: false,
    isUpdating: false,
    establishments: [],
    currentEstablishment: null,

    getEstablishments: async () => {
      set(
        produce((state: BookingStore) => {
          state.establishmentActions.isEstablishmentFetching = true;
          state.addressActions.currentAddress = null;
        }),
      );

      try {
        const { data } = await getFirestoreData<IEstablishment>(
          DatabasePaths.Establishments,
        );

        if (!data.length) {
          set(
            produce((state: BookingStore) => {
              state.establishmentActions.establishments = [];
            }),
          );

          return;
        }

        const currentEstablishment = data[0]; // for now as we allow to have just one est

        set(
          produce((state: BookingStore) => {
            state.establishmentActions.establishments = data;
            state.establishmentActions.currentEstablishment = currentEstablishment;
          }),
        );

        if (currentEstablishment.addresses.length) {
          const addresses = await getDataArrayWithRefArray(
            currentEstablishment.addresses,
          );

          set(
            produce((state: BookingStore) => {
              state.addressActions.addresses = addresses;
              state.tableActions.tables = [];
            }),
          );
        }
      } catch (error) {
        errorHandler(error as Error);
      } finally {
        set(
          produce((state: BookingStore) => {
            state.establishmentActions.isEstablishmentFetching = false;
          }),
        );
      }
    },

    addEstablishmentAndAddress: async (data) => {
      set(
        produce((state: BookingStore) => {
          state.establishmentActions.isEstablishmentFetching = true;
        }),
      );

      const { name, ...addressData } = data;

      const estId = uniqueIdGenerator(DatabaseId.Establishment);
      const addressId = uniqueIdGenerator(DatabaseId.Address);

      const address: IAddress = { id: addressId, ...addressData, tables: [] };

      try {
        const addressRef = await setFirestoreData(
          DatabasePaths.Addresses,
          addressId,
          address,
        );
        const establishment = { id: estId, name, addresses: [addressRef] };

        await setFirestoreData(DatabasePaths.Establishments, estId, establishment);

        set(
          produce((state: BookingStore) => {
            state.establishmentActions.establishments = [
              ...state.establishmentActions.establishments,
              establishment,
            ];
            state.establishmentActions.currentEstablishment = establishment;
            state.addressActions.addresses = [...state.addressActions.addresses, address];
          }),
        );
      } catch (error) {
        errorHandler(error as Error);
      } finally {
        set(
          produce((state: BookingStore) => {
            state.establishmentActions.isEstablishmentFetching = false;
          }),
        );
      }
    },

    updateEstablishment: async (data) => {
      const {
        establishmentActions: { currentEstablishment },
      } = get();

      if (currentEstablishment) {
        set(
          produce((state: BookingStore) => {
            state.establishmentActions.isUpdating = true;
          }),
        );
        const { id } = currentEstablishment;

        try {
          await updateFirestoreData(DatabasePaths.Establishments, id, data);
          set(
            produce((state: BookingStore) => {
              state.establishmentActions.currentEstablishment = {
                ...currentEstablishment,
                ...data,
              };
            }),
          );
        } catch (error) {
          errorHandler(error as Error);
        } finally {
          set(
            produce((state: BookingStore) => {
              state.establishmentActions.isUpdating = false;
            }),
          );
        }
      }
    },

    deleteEstablishment: async () => {
      const {
        establishmentActions: { currentEstablishment },
      } = get();

      if (currentEstablishment) {
        set(
          produce((state: BookingStore) => {
            state.establishmentActions.isEstablishmentFetching = true;
          }),
        );

        try {
          await deleteFirestoreData(
            DatabasePaths.Establishments,
            currentEstablishment.id,
          );

          if (currentEstablishment.addresses.length) {
            const addresses = await getDataArrayWithRefArray(
              currentEstablishment.addresses,
            );

            addresses.forEach(async (address) => {
              await deleteFirestoreData(DatabasePaths.Addresses, address.id);

              if (address.tables.length) {
                const tables = await getDataArrayWithRefArray(address.tables);

                tables.forEach(async (table) => {
                  await deleteFirestoreData(DatabasePaths.Tables, table.id);

                  if (table.bookingsCount) {
                    const filter: Filter<IBooking> = {
                      field: 'tableId',
                      value: table.id,
                    };
                    const { data } = await getFilteredFirestoreData<IBooking>(
                      DatabasePaths.Bookings,
                      [filter],
                    );

                    data.forEach(async (booking) => {
                      await deleteFirestoreData(DatabasePaths.Bookings, booking.id);
                    });
                  }
                });
              }
            });

            set(
              produce((state: BookingStore) => {
                state.addressActions.addresses = [];
                state.addressActions.currentAddress = null;
              }),
            );
          }

          set(
            produce((state: BookingStore) => {
              state.establishmentActions.establishments =
                state.establishmentActions.establishments.filter((est) => {
                  return est.id !== currentEstablishment.id;
                });
              state.establishmentActions.currentEstablishment = null;
            }),
          );
        } catch (error) {
          errorHandler(error as Error);
        } finally {
          set(
            produce((state: BookingStore) => {
              state.establishmentActions.isEstablishmentFetching = false;
            }),
          );
        }
      }
    },
  },
});
