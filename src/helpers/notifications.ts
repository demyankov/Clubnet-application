import { notifications } from '@mantine/notifications';
import { t } from 'i18next';

export const successNotification = (message: string = 'successCommon'): void => {
  notifications.show({
    title: t('notifications.successHeader'),
    message: t(`notifications.${message}`),
    color: 'teal',
  });
};
