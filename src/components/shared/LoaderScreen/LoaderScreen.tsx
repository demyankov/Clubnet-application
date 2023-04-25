import { FC } from 'react';

import { Loader, createStyles } from '@mantine/core';

const useStyles = createStyles({
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

export const LoaderScreen: FC = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.loader}>
      <Loader size="xl" />
    </div>
  );
};
