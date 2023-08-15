import { FC, Suspense, useCallback, useEffect } from 'react';

import { AppShell } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Route, Routes } from 'react-router-dom';

import {
  HeaderMegaMenu,
  NavbarMegaMenu,
  LoaderScreen,
  RenderContentContainer,
} from 'components';
import { useRole } from 'hooks';
import { routes } from 'routes/routes';
import { useAuth, useShop } from 'store/store';

const App: FC = () => {
  const { getUser, isFetching, isAuthInitialized } = useAuth((state) => state);
  const { isCompletedRegistration } = useAuth((state) => state.signIn);
  const { getUsersAwaitConfirm } = useShop();

  const { isUser } = useRole();

  const fetchUserData = useCallback(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, isCompletedRegistration]);

  useEffect(() => {
    if (isUser) {
      return;
    }

    const unsubscribe = getUsersAwaitConfirm();

    return () => {
      unsubscribe();
    };
  }, [getUsersAwaitConfirm, isUser]);

  if (!isAuthInitialized) {
    return <LoaderScreen />;
  }

  return (
    <AppShell
      navbarOffsetBreakpoint="736"
      padding="md"
      navbar={<NavbarMegaMenu />}
      header={<HeaderMegaMenu />}
    >
      <RenderContentContainer isFetching={isFetching}>
        <Notifications autoClose={5000} position="top-center" />

        <div className="container">
          <Suspense fallback={<LoaderScreen />}>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Suspense>
        </div>
      </RenderContentContainer>
    </AppShell>
  );
};

export default App;
