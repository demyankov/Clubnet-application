import { FC } from 'react';

import { Routes, Route } from 'react-router-dom';

import { HeaderMegaMenu } from 'components/Header';
import Dashboard from 'pages/Dashboard';
import Home from 'pages/Home';
import Login from 'pages/Login';
import NotFound from 'pages/NotFound';
import Profile from 'pages/Profile';
import Register from 'pages/Register';

const App: FC = () => {
  return (
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
  );
};

export default App;
