import dayjs from 'dayjs';
import { DocumentReference } from 'firebase/firestore';
import { produce } from 'immer';

import { DatabaseId } from 'constants/databaseId';
import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler } from 'helpers';
import { uniqueIdGenerator } from 'helpers/uniqueIdGenerator';
import {
  Filter,
  getFilteredFirestoreData,
  setFirestoreData,
  updateFirestoreData,
} from 'integrations/firebase';
import { IBooking } from 'store/slices/bookings/types';
import { BookingStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface IBookingActions {
  bookingActions: {
    isBookingFetching: boolean;
    bookings: IBooking[];

    getBookings: (id: string, date: string) => Promise<void>;
    addBooking: (
      data: Omit<IBooking, 'id'>,
      reset: () => void,
      openModalSuccess: () => void,
    ) => Promise<void>;
    resetBookings: () => void;
  };
}

export const bookingSlice: GenericStateCreator<BookingStore> = (set, get) => ({
  ...get(),
  bookingActions: {
    isBookingFetching: false,
    bookings: [],

    getBookings: async (id, date) => {
      try {
        set(
          produce((state: BookingStore) => {
            state.bookingActions.isBookingFetching = true;
          }),
        );

        const dateFilter: Filter<IBooking> = {
          field: 'date',
          value: date,
        };

        const field = id.split('-')[0] as 'address' | 'table';
        const idFilter: Filter<IBooking> = {
          field: `${field}Id`,
          value: id,
        };

        const { data } = await getFilteredFirestoreData<IBooking>(
          DatabasePaths.Bookings,
          [dateFilter, idFilter],
          'and',
          null,
          'start',
        );

        set(
          produce((state: BookingStore) => {
            state.bookingActions.bookings = data;
          }),
        );
      } catch (error) {
        errorHandler(error as Error);
      } finally {
        set(
          produce((state: BookingStore) => {
            state.bookingActions.isBookingFetching = false;
          }),
        );
      }
    },

    addBooking: async (data, reset, openModalSuccess) => {
      try {
        set(
          produce((state: BookingStore) => {
            state.bookingActions.isBookingFetching = true;
          }),
        );

        const {
          tableActions: { currentTable },
          bookingActions: { bookings },
        } = get();

        const id = uniqueIdGenerator(DatabaseId.Bookings);
        const booking = { ...data, id };
        const bookingRef = await setFirestoreData<IBooking>(
          DatabasePaths.Bookings,
          id,
          booking,
        );
        const newBookingValue = dayjs(booking.start.toDate());
        let updatedBookings: IBooking[];
        let updatedBookingRefs: DocumentReference<IBooking>[];

        if (bookings.length) {
          let indexToInsert = 0;

          bookings.forEach((booking, index) => {
            const bookingValue = dayjs(booking.start.toDate());

            if (newBookingValue.isAfter(bookingValue)) {
              indexToInsert = index + 1;
            }
          });

          updatedBookings = [...bookings];
          updatedBookings.splice(indexToInsert, 0, booking);
        } else {
          updatedBookings = [booking];
          updatedBookingRefs = [bookingRef];
        }

        const updatedBookingsCount = currentTable!.bookingsCount + 1;

        await updateFirestoreData(DatabasePaths.Tables, currentTable!.id, {
          bookingsCount: updatedBookingsCount,
        });

        set(
          produce((state: BookingStore) => {
            state.tableActions.currentTable = {
              ...currentTable!,
              bookingsCount: updatedBookingsCount,
            };
            state.bookingActions.bookings = updatedBookings;
            state.tableActions.tables = state.tableActions.tables.map((table) => {
              if (table.id === currentTable!.id) {
                return {
                  ...table,
                  bookings: updatedBookingRefs,
                  bookingsCount: updatedBookingsCount,
                };
              }

              return table;
            });
          }),
        );
        reset();
        openModalSuccess();
      } catch (error) {
        errorHandler(error as Error);
      } finally {
        set(
          produce((state: BookingStore) => {
            state.bookingActions.isBookingFetching = false;
          }),
        );
      }
    },

    resetBookings: () => {
      set(
        produce((state: BookingStore) => {
          state.bookingActions.bookings = [];
        }),
      );
    },
  },
});
