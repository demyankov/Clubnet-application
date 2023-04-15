import { FC, useEffect } from 'react';

import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';

import { mockData } from 'assets/mockData';
import {
  HeaderMegaMenu,
  FooterSocial,
  LoaderScreen,
  PrivateRoute,
  PublicRoute,
} from 'components';
import { Paths } from 'constants/paths';
import { errorNotification } from 'helpers';
import { Home, Register, Login, Dashboard, Profile, NotFound } from 'pages';
import { useStore } from 'store';

const App: FC = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'app-theme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });
  const { t } = useTranslation();

  const { isFetching, getUser } = useStore((state) => state);

  const toggleColorScheme = (value?: ColorScheme): void =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    const getIsError = async (): Promise<void> => {
      const isError = await getUser();

      if (isError) {
        const title = t('form.error-title').toString();
        const message = t('form.common-error').toString();

        errorNotification(title, message);
      }
    };

    getIsError();
  }, [getUser, t]);

  if (isFetching) return <LoaderScreen />;

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <Notifications position="top-right" />
        <HeaderMegaMenu />
        <Routes>
          <Route index element={<Home />} />
          <Route
            path={Paths.register}
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path={Paths.login}
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path={Paths.dashboard}
            element={
              <PrivateRoute>
                <Dashboard data={mockData.data} />
              </PrivateRoute>
            }
          />
          <Route
            path={Paths.profile}
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path={Paths.notFound} element={<NotFound />} />
        </Routes>
        <FooterSocial />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
