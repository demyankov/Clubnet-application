import React from 'react';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from 'App';
import { store } from 'store';
import 'firebase';

import 'main.css';
import 'i18n/i18n';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <React.Suspense>
          <App />
        </React.Suspense>
      </Provider>
    </Router>
  </React.StrictMode>,
);
