import React, { FC, ReactElement, ReactNode } from 'react';

import { Center, Loader } from '@mantine/core';

type Props = {
  isFetching: boolean;
  children: ReactNode;
};

export const LoaderContainer: FC<Props> = ({ isFetching, children }) => {
  if (isFetching) {
    return (
      <Center>
        <Loader variant="dots" />
      </Center>
    );
  }

  return children as ReactElement;
};
