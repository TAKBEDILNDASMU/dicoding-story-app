import { routes } from '../routes/routes';
import { parseCurrentRoute } from '../routes/url-parser';

class App {
  constructor(rootElementId = 'root') {
    this.rootElement = document.getElementById(rootElementId);
    if (!this.rootElement) {
      throw new Error(`Root element with ID ${rootElementId} is not exist!`);
    }
  }

  async renderCurrentRoute() {
    const url = parseCurrentRoute();
    if (url == 'sectionStory') return;
    const route = routes[url];

    // get page instance and update the dom
    const page = route();
    await page.present(this.rootElement);
    await page.afterPresent();
  }
}

export default App;
