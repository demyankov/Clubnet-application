import { notifications } from '@mantine/notifications';

import { TF } from 'types/translation';

export const successNotification = (t: TF, message: string = 'successCommon'): void => {
  notifications.show({
    title: t('notifications.successHeader'),
    message: t(`notifications.${message}`),
    color: 'teal',
  });
};

export const errorNotification = (t: TF, message: string = 'errorCommon'): void => {
  notifications.show({
    title: t('notifications.errorHeader'),
    message: t(`notifications.${message}`),
    color: 'red',
  });
};
