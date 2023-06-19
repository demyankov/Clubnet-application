import { FC, lazy, Suspense, useCallback, useEffect } from 'react';

import { Notifications } from '@mantine/notifications';
import { Route, Routes } from 'react-router-dom';

import { BookingsAddressInfo, HeaderMegaMenu } from 'components';
import { LoaderScreen, ProtectedRoute, RenderContentContainer } from 'components/shared';
import { Paths } from 'constants/paths';
import { Roles } from 'constants/userRoles';
import { useAuth } from 'store/store';

const Home = lazy(() => import('pages/Home/Home'));
const Login = lazy(() => import('pages/Login/Login'));
const Tournaments = lazy(() => import('pages/Tournaments/Tournaments'));
const TournamentInfo = lazy(() => import('pages/TournamentInfo/TournamentInfo'));
const Profile = lazy(() => import('pages/Profile/Profile'));
const Clients = lazy(() => import('pages/Clients/Clients'));
const ClientInfo = lazy(() => import('pages/ClientInfo/ClientInfo'));
const TeamInfo = lazy(() => import('pages/TeamInfo/TeamInfo'));
const Bookings = lazy(() => import('pages/Bookings/Bookings'));
const NotFound = lazy(() => import('pages/NotFound/NotFound'));

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

      <HeaderMegaMenu />

      <div className="container">
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
              path={`${Paths.teams}/:id`}
              element={
                <ProtectedRoute isPrivate roles={[Roles.USER, Roles.ADMIN]}>
                  <TeamInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.bookings}
              element={
                <ProtectedRoute isPrivate roles={[Roles.USER, Roles.ADMIN]}>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${Paths.bookings}/:id`}
              element={
                <ProtectedRoute isPrivate roles={[Roles.USER, Roles.ADMIN]}>
                  <BookingsAddressInfo />
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
            <Route
              path={Paths.clients}
              element={
                <ProtectedRoute isPrivate roles={[Roles.ADMIN]}>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${Paths.clients}/:nickname`}
              element={
                <ProtectedRoute isPrivate roles={[Roles.ADMIN]}>
                  <ClientInfo />
                </ProtectedRoute>
              }
            />
            <Route path={Paths.notFound} element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </RenderContentContainer>
  );
};

export default App;
