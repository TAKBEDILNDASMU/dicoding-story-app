// CSS Imports
import "./styles/styles.css";

import App from "./pages/App";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App();

  await app.renderCurrentRoute();

  window.addEventListener("hashchange", async () => {
    await app.renderCurrentRoute();
  });
});
