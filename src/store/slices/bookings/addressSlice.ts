import { produce } from 'immer';

import { DatabaseId } from 'constants/databaseId';
import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler, uniqueIdGenerator } from 'helpers';
import {
  deleteFirestoreData,
  getDataArrayWithRefArray,
  getFireStoreDataByFieldName,
  setFirestoreData,
  updateFirestoreData,
} from 'integrations/firebase';
import { AddressData, IAddress, IEstablishment } from 'store/slices/bookings/types';
import { BookingStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface IAdressActions {
  addressActions: {
    isAddressFetching: boolean;
    addresses: IAddress[];
    currentAddress: Nullable<IAddress>;

    setCurrentAddress: (id: string) => Promise<void>;
    addAddress: (data: AddressData) => Promise<void>;
    updateAddress: (data: AddressData) => Promise<void>;
    deleteAddress: () => Promise<void>;
  };
}

export const addressSlice: GenericStateCreator<BookingStore> = (set, get) => ({
  ...get(),
  addressActions: {
    isAddressFetching: false,
    addresses: [],
    currentAddress: null,

    setCurrentAddress: async (id) => {
      set(
        produce((state: BookingStore) => {
          state.addressActions.isAddressFetching = true;
        }),
      );

      try {
        const address = await getFireStoreDataByFieldName<IAddress>(
          DatabasePaths.Addresses,
          id,
        );

        if (address) {
          set(
            produce((state: BookingStore) => {
              state.addressActions.currentAddress = address;
            }),
          );
        }
      } catch (error) {
        errorHandler(error as Error);
      } finally {
        set(
          produce((state: BookingStore) => {
            state.addressActions.isAddressFetching = false;
          }),
        );
      }
    },

    addAddress: async (data) => {
      set(
        produce((state: BookingStore) => {
          state.addressActions.isAddressFetching = true;
        }),
      );

      const {
        establishmentActions: { currentEstablishment },
      } = get();
      const id = uniqueIdGenerator(DatabaseId.Address);

      if (currentEstablishment) {
        const address: IAddress = { id, ...data, tables: [] };

        try {
          const addressRef = await setFirestoreData(
            DatabasePaths.Addresses,
            address.id,
            address,
          );
          const updatedRefArray = [...currentEstablishment.addresses, addressRef];

          await updateFirestoreData(
            DatabasePaths.Establishments,
            currentEstablishment.id,
            { addresses: updatedRefArray },
          );

          set(
            produce((state: BookingStore) => {
              state.establishmentActions.currentEstablishment!.addresses =
                updatedRefArray;
              state.addressActions.addresses = [
                ...state.addressActions.addresses,
                address,
              ];
            }),
          );
        } catch (error) {
          errorHandler(error as Error);
        } finally {
          set(
            produce((state: BookingStore) => {
              state.addressActions.isAddressFetching = false;
            }),
          );
        }
      }
    },

    updateAddress: async (data) => {
      const {
        addressActions: { currentAddress },
      } = get();

      if (currentAddress) {
        const { id, tables } = currentAddress;

        set(
          produce((state: BookingStore) => {
            state.addressActions.isAddressFetching = true;
          }),
        );

        try {
          await updateFirestoreData(DatabasePaths.Addresses, id, data);

          set(
            produce((state: BookingStore) => {
              state.addressActions.addresses = state.addressActions.addresses.map(
                (address) => {
                  if (address.id === id) {
                    return { id, tables, ...data };
                  }

                  return address;
                },
              );
              state.addressActions.currentAddress = { id, tables, ...data };
            }),
          );
        } catch (error) {
          errorHandler(error as Error);
        } finally {
          set(
            produce((state: BookingStore) => {
              state.addressActions.isAddressFetching = false;
            }),
          );
        }
      }
    },

    deleteAddress: async () => {
      const {
        establishmentActions: { currentEstablishment },
        addressActions: { currentAddress },
      } = get();

      if (currentEstablishment && currentAddress) {
        set(
          produce((state: BookingStore) => {
            state.addressActions.isAddressFetching = true;
            state.establishmentActions.isEstablishmentFetching = true;
          }),
        );

        try {
          await deleteFirestoreData(DatabasePaths.Addresses, currentAddress.id);
          const arrayToUpdate = currentEstablishment.addresses.filter(
            (addressRef) => addressRef.id !== currentAddress.id,
          );

          await updateFirestoreData(
            DatabasePaths.Establishments,
            currentEstablishment.id,
            { addresses: arrayToUpdate },
          );
          const updatedEstablishment = await getFireStoreDataByFieldName<IEstablishment>(
            DatabasePaths.Establishments,
            currentEstablishment.id,
          );

          if (updatedEstablishment) {
            set(
              produce((state: BookingStore) => {
                state.establishmentActions.currentEstablishment = updatedEstablishment;
                state.addressActions.addresses = state.addressActions.addresses.filter(
                  (address) => address.id !== currentAddress.id,
                );
              }),
            );
          }

          if (currentAddress.tables.length) {
            const tables = await getDataArrayWithRefArray(currentAddress.tables);

            tables.forEach(async (table) => {
              await deleteFirestoreData(DatabasePaths.Tables, table.id);

              if (table.orders.length) {
                const orders = await getDataArrayWithRefArray(table.orders);

                orders.forEach(async (order) => {
                  await deleteFirestoreData(DatabasePaths.Orders, order.id);
                });
              }
            });
          }

          set(
            produce((state: BookingStore) => {
              state.addressActions.currentAddress = null;
            }),
          );
        } catch (error) {
          errorHandler(error as Error);
        } finally {
          set(
            produce((state: BookingStore) => {
              state.addressActions.isAddressFetching = false;
            }),
          );
        }
      }
    },
  },
});
