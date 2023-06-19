import { FC } from 'react';

import {
  Checkbox,
  Container,
  Flex,
  Select,
  Text,
  UnstyledButton,
  createStyles,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { hours } from 'constants/hours';
import { weekdays } from 'constants/weekdays';
import { IWorkingHours, WeekDays } from 'store/slices/bookings/types';

const useStyles = createStyles({
  setDays: {
    fontSize: '0.8rem',
    opacity: '0.6',
    textDecoration: 'underline dotted',
    textUnderlineOffset: '0.15em',
  },
});

type Props = {
  getInputProps: any;
  handleApplyToAll: () => void;
  workingHours: IWorkingHours;
};

export const BookingsWorkingDaysInputs: FC<Props> = ({
  getInputProps,
  handleApplyToAll,
  workingHours,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  return (
    <>
      {weekdays.map((day) => (
        <Container key={day} px={0}>
          <Flex justify="space-between" mb="sm">
            <Checkbox
              label={t(`workingDays.${day}`)}
              size="sm"
              {...getInputProps(`workingHours.${day}.isAvailable`, { type: 'checkbox' })}
            />

            <Flex>
              <Select
                data={hours}
                disabled={!workingHours[day].isAvailable}
                dropdownPosition="flip"
                w={100}
                maxDropdownHeight={150}
                mr="xs"
                {...getInputProps(`workingHours.${day}.start`)}
              />
              -
              <Select
                data={hours}
                disabled={!workingHours[day].isAvailable}
                dropdownPosition="flip"
                maxDropdownHeight={150}
                w={100}
                ml="xs"
                {...getInputProps(`workingHours.${day}.finish`)}
              />
            </Flex>
          </Flex>
          {day === WeekDays.Mon && (
            <Text ta="right" mb="xs">
              <UnstyledButton className={classes.setDays} onClick={handleApplyToAll}>
                {t('address.applyToAll')}
              </UnstyledButton>
            </Text>
          )}
        </Container>
      ))}
    </>
  );
};
