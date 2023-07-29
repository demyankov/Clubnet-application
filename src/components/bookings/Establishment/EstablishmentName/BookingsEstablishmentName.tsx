import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

import { Button, Flex, Loader, LoadingOverlay, TextInput, Title } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

import { useBookings } from 'store/store';

type Props = {
  isEditMode: boolean;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
};

export const BookingsEstablishmentName: FC<Props> = ({ isEditMode, setIsEditMode }) => {
  const [name, setName] = useState<string>('');
  const { isUpdating, currentEstablishment, updateEstablishment } = useBookings(
    (state) => state.establishmentActions,
  );

  useEffect(() => {
    if (currentEstablishment) {
      setName(currentEstablishment.name);
    }
  }, [currentEstablishment]);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.currentTarget.value);
  };

  const handleOnCancel = (): void => {
    setIsEditMode(false);
  };

  const handleUpdateEstablishment = (): void => {
    if (name) {
      updateEstablishment({ name });
      setIsEditMode(false);
    }
  };

  if (isEditMode) {
    return (
      <Flex justify="center" gap="xs" pos="relative">
        <LoadingOverlay
          visible={isUpdating}
          overlayBlur={0}
          overlayOpacity={0}
          loader={<Loader variant="dots" />}
        />
        <TextInput value={name} onChange={handleOnChange} disabled={isUpdating} />
        <Button disabled={isUpdating} onClick={handleUpdateEstablishment}>
          <IconCheck />
        </Button>
        <Button disabled={isUpdating} onClick={handleOnCancel}>
          <IconX />
        </Button>
      </Flex>
    );
  }

  return (
    <Title order={1} size={27.7} align="center">
      {currentEstablishment?.name}
    </Title>
  );
};
