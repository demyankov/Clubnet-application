import { FC, useEffect, useMemo, useState, useCallback } from 'react';

import {
  Button,
  Center,
  Flex,
  Input,
  LoadingOverlay,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { DocumentReference, Timestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';

import { BookingsOrderSuccessModal } from 'components';
import { DatabasePaths } from 'constants/databasePaths';
import { DateFormats } from 'constants/dateFormats';
import {
  generateHours,
  getDayjsValue,
  getFinishValues,
  getStartValues,
  getWeekendDays,
  validatePhone,
} from 'helpers';
import { formatDate } from 'helpers/formatDate';
import { useRole } from 'hooks';
import { getDocumentReference } from 'integrations/firebase';
import { IUser } from 'store/slices/auth/types';
import { useAuth, useBookings } from 'store/store';

type Props = {
  close: () => void;
};

export const BookingsTable: FC<Props> = ({ close }) => {
  const [owner, setOwner] = useState<Nullable<DocumentReference<IUser>>>(null);
  const { t, i18n } = useTranslation();
  const {
    addressActions: { currentAddress },
    tableActions: { currentTable, deleteTable },
    orderActions: { orders, addOrder, isOrderFetching, getOrders },
  } = useBookings((state) => state);
  const { user } = useAuth((state) => state);
  const { isUser, isAdmin } = useRole();
  const { values, onSubmit, getInputProps, errors, reset, setValues } = useForm({
    initialValues: {
      day: new Date(),
      start: '',
      finish: '',
      name: '',
      phone: '',
    },

    transformValues: ({ day, start, finish }) => {
      const startDate = getDayjsValue(day, start);
      const finishDate = getDayjsValue(day, finish);

      return {
        start: Timestamp.fromDate(startDate.toDate()),
        finish: Timestamp.fromDate(finishDate.toDate()),
      };
    },

    validate: {
      name: (value) => (value ? null : t('modals.requiredField')),
      phone: (value) => validatePhone(value),
    },
  });

  const { workingHours } = currentAddress!;
  const { day, start, finish, name, phone } = values;
  const HOURS = generateHours();
  const setUserRefAsOwner = useCallback(async () => {
    const userRef = await getDocumentReference<IUser>(DatabasePaths.Users, user!.id);

    setOwner(userRef);
  }, [user]);

  const handleDeleteTable = (): void => {
    deleteTable(close);
  };

  const openModalAgreeToDelete = (): void => {
    modals.openConfirmModal({
      title: t('address.deleteAddress'),
      centered: true,
      children: <Text size="sm">{t('tables.agreeToDeleteTable')}</Text>,
      labels: { confirm: t('modals.btnDelete'), cancel: t('modals.btnCancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        handleDeleteTable();
      },
    });
  };

  const openModalSuccess = (): void => {
    modals.open({
      centered: true,
      children: (
        <BookingsOrderSuccessModal
          tableName={currentTable!.name}
          day={day}
          start={start}
          finish={finish}
          name={name}
          phone={phone}
        />
      ),
      withCloseButton: false,
    });
  };

  useEffect(() => {
    if (user && isUser) {
      setValues({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
    setUserRefAsOwner();
  }, [isUser, setUserRefAsOwner, setValues, user]);

  const date = useMemo(() => {
    return formatDate(day, DateFormats.DayMonthYear);
  }, [day]);

  useEffect(() => {
    setValues({
      start: '',
      finish: '',
    });
    if (currentTable?.ordersCount) {
      getOrders(currentTable!.id, date);
    }
  }, [date, currentTable, getOrders, setValues]);

  const weekendDays = getWeekendDays(workingHours);

  const startValues = useMemo(
    () => getStartValues(day, reset, workingHours, orders, HOURS),
    [day, reset, workingHours, orders, HOURS],
  );

  const finishValues = useMemo(
    () => getFinishValues(day, reset, workingHours, orders, startValues, start, HOURS),
    [day, reset, start, startValues, orders, workingHours, HOURS],
  );

  const handleClear = (): void => {
    reset();
  };

  const handleSubmit = (values: { start: Timestamp; finish: Timestamp }): void => {
    const date = formatDate(day, DateFormats.DayMonthYear);
    const orderToAdd = {
      ...values,
      tableId: currentTable!.id,
      addressId: currentAddress!.id,
      contact: { name, phone },
      owner,
      date,
    };

    addOrder(orderToAdd, reset, openModalSuccess);
  };

  return (
    <>
      {isAdmin && (
        <Button
          color="red"
          px="xs"
          onClick={openModalAgreeToDelete}
          mb="xs"
          display="block"
          w="100%"
        >
          <IconTrash size={20} />
        </Button>
      )}
      <form onSubmit={onSubmit(handleSubmit)}>
        <LoadingOverlay visible={isOrderFetching} zIndex={220} />
        <Center>
          <DatePicker
            weekendDays={weekendDays}
            allowDeselect
            hideOutsideDates
            locale={i18n.language}
            minDate={new Date()}
            mb="md"
            {...getInputProps('day')}
          />
        </Center>

        <Flex gap="sm" mb="md">
          <Select
            placeholder={t('tables.start').toString()}
            data={startValues}
            {...getInputProps('start')}
            disabled={!day || isOrderFetching}
          />{' '}
          -
          <Select
            placeholder={t('tables.end').toString()}
            data={finishValues}
            {...getInputProps('finish')}
            disabled={!day || !start || isOrderFetching}
          />
        </Flex>

        <TextInput
          label={t('common.fullName')}
          placeholder={t('common.fullName').toString()}
          withAsterisk
          mb="md"
          {...getInputProps('name')}
        />

        <Input.Wrapper
          id="phone-input"
          label={t('form.yourPhone')}
          withAsterisk
          mb="lg"
          inputMode="tel"
        >
          <Input
            component={IMaskInput}
            mask="+375 (00) 000-00-00"
            id="phone-input"
            placeholder={t('login.phonePlaceholder')}
            {...getInputProps('phone')}
          />
          <Input.Error>{errors.phone}</Input.Error>
        </Input.Wrapper>

        <Text ta="center">
          <Button mr="sm" disabled={!day} onClick={handleClear}>
            {t('tables.clear')}
          </Button>
          <Button color="teal" type="submit" disabled={isOrderFetching || !finish}>
            {t('address.save')}
          </Button>
        </Text>
      </form>
    </>
  );
};
