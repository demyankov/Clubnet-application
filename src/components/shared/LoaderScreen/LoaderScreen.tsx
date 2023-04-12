import { FC } from 'react';

import { Loader, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  loader: {
    position: 'absolute',
    backgroundColor: theme.colorScheme === 'dark' ? '#00000080' : '#ffffff80',
    zIndex: 10,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export const LoaderScreen: FC = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.loader}>
      <Loader size="xl" />
    </div>
  );
};
