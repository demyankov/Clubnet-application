import { lazy, ReactElement } from 'react';

import { BookingsAddressInfo } from 'components';
import { ProtectedRoute } from 'components/shared';
import { Paths } from 'constants/paths';
import { Roles } from 'constants/userRoles';

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

const DEFAULT_ROLES = [Roles.USER, Roles.ADMIN];

interface IRoutes {
  path: string;
  element: ReactElement;
}

export const routes: IRoutes[] = [
  {
    path: Paths.home,
    element: <Home />,
  },
  {
    path: Paths.signin,
    element: (
      <ProtectedRoute roles={DEFAULT_ROLES}>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: Paths.tournaments,
    element: (
      <ProtectedRoute isPrivate roles={DEFAULT_ROLES}>
        <Tournaments />
      </ProtectedRoute>
    ),
  },
  {
    path: `${Paths.tournaments}/:id`,
    element: (
      <ProtectedRoute isPrivate roles={DEFAULT_ROLES}>
        <TournamentInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: `${Paths.teams}/:id`,
    element: (
      <ProtectedRoute isPrivate roles={DEFAULT_ROLES}>
        <TeamInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: Paths.bookings,
    element: (
      <ProtectedRoute isPrivate roles={DEFAULT_ROLES}>
        <Bookings />
      </ProtectedRoute>
    ),
  },
  {
    path: `${Paths.bookings}/:id`,
    element: (
      <ProtectedRoute isPrivate roles={DEFAULT_ROLES}>
        <BookingsAddressInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: Paths.profile,
    element: (
      <ProtectedRoute isPrivate roles={DEFAULT_ROLES}>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: Paths.clients,
    element: (
      <ProtectedRoute isPrivate roles={[Roles.ADMIN]}>
        <Clients />
      </ProtectedRoute>
    ),
  },
  {
    path: `${Paths.clients}/:nickname`,
    element: (
      <ProtectedRoute isPrivate roles={[Roles.ADMIN]}>
        <ClientInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: Paths.notFound,
    element: <NotFound />,
  },
];
