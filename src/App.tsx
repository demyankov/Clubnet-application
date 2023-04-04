import { FC, useEffect, useState } from 'react';

import { Loader } from '@mantine/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import s from 'components/form.module.css';
import { HeaderMegaMenu } from 'components/Header';
import Dashboard from 'pages/Dashboard';
import Home from 'pages/Home';
import Login from 'pages/Login';
import NotFound from 'pages/NotFound';
import Profile from 'pages/Profile';
import Register from 'pages/Register';
import { setUser } from 'store/userSlice';

const App: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

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
    <>
      <HeaderMegaMenu />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  ) : (
    <div className={s.loader}>
      <Loader size="xl" />
    </div>
  );
};

export default App;
