import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { usersApi } from './api/UsersApi';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ApiProvider api={usersApi}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApiProvider>
  </>
);
serviceWorkerRegistration.register();

reportWebVitals();
