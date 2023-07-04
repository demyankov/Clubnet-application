import { FC, Suspense, useCallback, useEffect } from 'react';

import { AppShell } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Route, Routes } from 'react-router-dom';

import { HeaderMegaMenu, NavbarMegaMenu } from 'components';
import { LoaderScreen, RenderContentContainer } from 'components/shared';
import { routes } from 'routes/routes';
import { useAuth } from 'store/store';

const App: FC = () => {
  const { getUser, isFetching } = useAuth((state) => state);
  const { isCompletedRegistration } = useAuth((state) => state.signIn);

  const fetchUserData = useCallback(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, isCompletedRegistration]);

  return (
    <RenderContentContainer isFetching={isFetching}>
      <Notifications autoClose={5000} position="top-center" />

      <AppShell
        navbarOffsetBreakpoint="700"
        padding="md"
        navbar={<NavbarMegaMenu />}
        header={<HeaderMegaMenu />}
      >
        <div className="container">
          <Suspense fallback={<LoaderScreen />}>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Suspense>
        </div>
      </AppShell>
    </RenderContentContainer>
  );
};

export default App;
