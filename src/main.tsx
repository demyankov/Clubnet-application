import React from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import App from 'App';
import { ThemeContextProvider } from 'context';

import 'integrations/firebase/firebase';

import 'main.css';
import 'integrations/i18n/i18n';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <Router>
        <App />
      </Router>
    </ThemeContextProvider>
  </React.StrictMode>,
);
