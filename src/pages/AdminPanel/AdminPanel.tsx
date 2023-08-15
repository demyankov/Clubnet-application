import React, { FC, useEffect } from 'react';

import { Accordion, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { ConfirmProduct, ConfirmUser } from 'components/adminPanel';
import { RenderContentContainer } from 'components/shared';
import { LoaderContainer } from 'components/shared/LoaderContainer/LoaderContainer';
import { useShop } from 'store/store';

export const AdminPanel: FC = () => {
  const { t } = useTranslation();

  const {
    usersConfirm,
    productConfirm,
    getUsersAwaitConfirm,
    getConfirmProduct,
    isFetchingConfirmProduct,
    isFetchingUsersAwaitConfirm,
  } = useShop();

  useEffect(() => {
    getUsersAwaitConfirm();
  }, [getUsersAwaitConfirm]);

  return (
    <RenderContentContainer
      isFetching={isFetchingUsersAwaitConfirm}
      isEmpty={!usersConfirm.length}
      emptyTitle={t('adminPanel.isEmpty')}
    >
      <Text size={30} fw={600} p={10}>
        {t('adminPanel.awaitConfirm')}:
      </Text>

      <Accordion variant="separated" chevronPosition="left">
        {usersConfirm.map((user) => (
          <Accordion.Item
            value={user.id}
            key={user.id}
            onClick={() => getConfirmProduct(user.id)}
          >
            <Accordion.Control>
              <ConfirmUser user={user} />
            </Accordion.Control>
            <Accordion.Panel>
              <LoaderContainer isFetching={isFetchingConfirmProduct}>
                {productConfirm.map(({ product, id, userId }) => (
                  <ConfirmProduct
                    key={id}
                    product={product}
                    userId={userId}
                    orderConfirmationId={id}
                  />
                ))}
              </LoaderContainer>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </RenderContentContainer>
  );
};
