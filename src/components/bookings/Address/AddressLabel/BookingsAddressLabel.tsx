import { FC } from 'react';

import { Text, UnstyledButton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useBookings } from 'store/store';

type Props = {
  openSettings: () => void;
};

export const BookingsAddressLabel: FC<Props> = ({ openSettings }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteAddress } = useBookings((state) => state.addressActions);

  const handleDeleteEstablishment = (): void => {
    modals.openConfirmModal({
      title: t('address.deleteAddress'),
      centered: true,
      children: <Text size="sm">{t('address.agreeToDeleteAddress')}</Text>,
      labels: { confirm: t('modals.btnDelete'), cancel: t('modals.btnCancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteAddress(navigate);
      },
    });
  };

  return (
    <>
      <UnstyledButton mr="md" onClick={openSettings}>
        <IconEdit stroke={1.5} />
      </UnstyledButton>
      <UnstyledButton>
        <IconTrash stroke={1.5} onClick={handleDeleteEstablishment} />
      </UnstyledButton>
    </>
  );
};
