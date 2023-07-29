import { Dispatch, FC, SetStateAction } from 'react';

import { Text, UnstyledButton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { useBookings } from 'store/store';

type Props = {
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
};

export const BookingEstablishmentLabel: FC<Props> = ({ setIsEditMode }) => {
  const { deleteEstablishment } = useBookings((state) => state.establishmentActions);
  const { t } = useTranslation();
  const handleDeleteEstablishment = (): void => {
    modals.openConfirmModal({
      title: t('establishments.deleteEstablishment'),
      centered: true,
      children: <Text size="sm">{t('establishments.agreeToDeleteEstablishment')}</Text>,
      labels: { confirm: t('modals.btnDelete'), cancel: t('modals.btnCancel') },
      confirmProps: { color: 'red' },
      onConfirm: deleteEstablishment,
    });
  };

  return (
    <>
      <UnstyledButton mr="md" onClick={() => setIsEditMode(true)}>
        <IconEdit stroke={1.5} />
      </UnstyledButton>
      <UnstyledButton>
        <IconTrash stroke={1.5} onClick={handleDeleteEstablishment} />
      </UnstyledButton>
    </>
  );
};
