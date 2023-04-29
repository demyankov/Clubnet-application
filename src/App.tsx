import { FC, lazy, Suspense, useEffect } from 'react';

import { Notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';

import { FooterSocial, HeaderMegaMenu, RenderContentContainer } from 'components';
import { LoaderScreen, ProtectedRoute } from 'components/shared';
import { Paths } from 'constants/paths';
import { Roles } from 'constants/userRoles';
import { useAuth } from 'store/store';

const Home = lazy(() => import('pages/Home/Home'));
const SignIn = lazy(() => import('pages/SignIn/SignIn'));
const Dashboard = lazy(() => import('pages/Dashboard/Dashboard'));
const Profile = lazy(() => import('pages/Profile/Profile'));
const NotFound = lazy(() => import('pages/NotFound/NotFound'));

const App: FC = () => {
  const { getUser, isFetching } = useAuth((state) => state);
  const { t } = useTranslation();

  useEffect(() => {
    getUser(t);
  }, [getUser, t]);

  return (
    <RenderContentContainer isFetching={isFetching}>
      <Notifications autoClose={5000} position="top-right" />

      <HeaderMegaMenu />

      <Suspense fallback={<LoaderScreen />}>
        <Routes>
          <Route path={Paths.home} element={<Home />} />
          <Route
            path={Paths.signin}
            element={
              <ProtectedRoute roles={[Roles.USER, Roles.ADMIN]}>
                <SignIn />
              </ProtectedRoute>
            }
          />
          <Route
            path={Paths.dashboard}
            element={
              <ProtectedRoute isPrivate roles={[Roles.ADMIN]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={Paths.profile}
            element={
              <ProtectedRoute isPrivate roles={[Roles.USER, Roles.ADMIN]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path={Paths.notFound} element={<NotFound />} />
        </Routes>
      </Suspense>

      <FooterSocial />
    </RenderContentContainer>
  );
};

export default App;
