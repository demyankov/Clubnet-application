import { FC, useEffect } from 'react';

import { ActionIcon, Indicator } from '@mantine/core';
import { IoCartSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { useAuth, useShop } from 'store/store';

export const HeaderBasket: FC = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { basketTotalCounter, getBasketTotalCounter } = useShop();

  const navigateToBasket = (): void => {
    navigate(Paths.basket);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getBasketTotalCounter(user.id);
  }, [user, getBasketTotalCounter]);

  return (
    <Indicator
      disabled={!basketTotalCounter}
      label={basketTotalCounter}
      size={16}
      offset={3}
      withBorder
    >
      <ActionIcon onClick={navigateToBasket}>
        <IoCartSharp size={40} />
      </ActionIcon>
    </Indicator>
  );
};
