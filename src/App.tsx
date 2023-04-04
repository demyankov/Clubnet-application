import { FC, useEffect, useState } from 'react';

import {
  Loader,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  createStyles,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { mockData } from 'assets/mockData';
import { FooterSocial } from 'components/Footer';
import { HeaderMegaMenu } from 'components/Header';
import Dashboard from 'pages/Dashboard';
import Home from 'pages/Home';
import Login from 'pages/Login';
import NotFound from 'pages/NotFound';
import Profile from 'pages/Profile';
import Register from 'pages/Register';
import { setUser } from 'store/slices/userSlice';

const useStyles = createStyles((theme) => ({
  loader: {
    position: 'absolute',
    backgroundColor: theme.colorScheme === 'dark' ? '#00000080' : '#ffffff80',
    zIndex: 10,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const App: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'app-theme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });
  const { classes } = useStyles();

  const dispatch = useDispatch();
  const toggleColorScheme = (value?: ColorScheme): void =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    setIsLoading(true);
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: await user.getIdToken(),
          }),
        );
        setIsLoading(false);
      } else {
        dispatch(
          setUser({
            email: null,
            id: null,
            token: null,
          }),
        );
        setIsLoading(false);
      }
    });
  }, [dispatch]);

  return !isLoading ? (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <HeaderMegaMenu />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard data={mockData.data} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FooterSocial />
      </MantineProvider>
    </ColorSchemeProvider>
  ) : (
    <div className={classes.loader}>
      <Loader size="xl" />
    </div>
  );
};

export default App;
