import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const env = (import.meta as any).env || {};
const auth0Domain = env.VITE_AUTH0_DOMAIN as string | undefined;
const auth0ClientId = env.VITE_AUTH0_CLIENT_ID as string | undefined;
const auth0Audience = env.VITE_AUTH0_AUDIENCE as string | undefined;

const onRedirectCallback = (appState?: any) => {
  const returnTo = appState?.returnTo;
  if (typeof returnTo === 'string' && returnTo.length > 0) {
    window.location.hash = returnTo.startsWith('#') ? returnTo : `#${returnTo}`;
  }
};

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

root.render(
  auth0Domain && auth0ClientId ? (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin + window.location.pathname,
        ...(auth0Audience ? { audience: auth0Audience } : {}),
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {app}
    </Auth0Provider>
  ) : (
    app
  )
);