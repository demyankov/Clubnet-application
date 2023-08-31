import React, { FC } from 'react';

import { Box, Button, Grid } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { useClients } from 'store/store';

export const ClientsItem: FC = () => {
  const { client } = useClients((state) => state);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClientClick = (nickName: Nullable<string> | undefined) => () => {
    navigate(`${Paths.clients}/${nickName}/edit`);
  };

  return (
    <Grid justify="space-between" align="center">
      <Box mr="xs" ml="xs" mt="xs">
        {client?.nickName}
      </Box>
      <Button mx="xs" mt="xs" onClick={handleClientClick(client?.nickName)}>
        {t('clients.btnEdit')}
      </Button>
    </Grid>
  );
};
