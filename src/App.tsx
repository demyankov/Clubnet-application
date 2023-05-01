import { FC, lazy, Suspense, useCallback, useEffect } from 'react';

import { Notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';

import { FooterSocial, HeaderMegaMenu } from 'components';
import { LoaderScreen, ProtectedRoute, RenderContentContainer } from 'components/shared';
import { Paths } from 'constants/paths';
import { Roles } from 'constants/userRoles';
import { useAuth } from 'store/store';

const Home = lazy(() => import('pages/Home/Home'));
const Login = lazy(() => import('pages/Login/Login'));
const Tournaments = lazy(() => import('pages/Tournaments/Tournaments'));
const TournamentInfo = lazy(() => import('pages/TournamentInfo/TournamentInfo'));
const Profile = lazy(() => import('pages/Profile/Profile'));
const NotFound = lazy(() => import('pages/NotFound/NotFound'));

const App: FC = () => {
  const { t } = useTranslation();
  const { getUser, isFetching } = useAuth((state) => state);

  const fetchUserData = useCallback(async () => {
    await getUser(t);
  }, [getUser, t]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path={Paths.tournaments}
            element={
              <ProtectedRoute isPrivate roles={[Roles.USER, Roles.ADMIN]}>
                <Tournaments />
              </ProtectedRoute>
            }
          />
          <Route
            path={`${Paths.tournaments}/:id`}
            element={
              <ProtectedRoute isPrivate roles={[Roles.USER, Roles.ADMIN]}>
                <TournamentInfo />
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
