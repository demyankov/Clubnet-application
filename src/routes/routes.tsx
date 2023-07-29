import { lazy, ReactElement } from 'react';

import { BookingsAddress } from 'components';
import { ProtectedRoute } from 'components/shared';
import { Paths } from 'constants/paths';
import { Roles } from 'constants/userRoles';

const Home = lazy(() => import('pages/Home/Home'));
const Login = lazy(() => import('pages/Login/Login'));
const Tournaments = lazy(() => import('pages/Tournaments/Tournaments'));
const TournamentInfo = lazy(() => import('pages/TournamentInfo/TournamentInfo'));
const Profile = lazy(() => import('pages/Profile/Profile'));
const Player = lazy(() => import('pages/Player/Player'));
const Clients = lazy(() => import('pages/Clients/Clients'));
const ClientInfo = lazy(() => import('pages/ClientInfo/ClientInfo'));
const ClientEdit = lazy(() => import('pages/ClientEdit/ClientEdit'));
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
        <BookingsAddress />
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
    path: `${Paths.player}/:nickname`,
    element: (
      <ProtectedRoute isPrivate roles={DEFAULT_ROLES}>
        <Player />
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
    path: `${Paths.clients}/:nickname/edit`,
    element: (
      <ProtectedRoute isPrivate roles={[Roles.ADMIN]}>
        <ClientEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: Paths.notFound,
    element: <NotFound />,
  },
];
