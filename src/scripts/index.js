// CSS Imports
import './styles/styles.css';

import App from './pages/App';
import { initializeAuth } from './data/api';
import { registerServiceWorker } from './utils/serviceWorker';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize authentication before rendering the app
  await initializeAuth();

  const app = new App();
  await app.renderCurrentRoute();

  await registerServiceWorker();

  window.addEventListener('hashchange', async () => {
    await app.renderCurrentRoute();
  });
});
