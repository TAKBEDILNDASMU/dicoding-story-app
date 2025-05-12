import { ACCESS_TOKEN_KEY, BASE_URL } from '../../config';
import HomePage from './HomePage';

class HomePresenter {
  constructor() {
    this.view = new HomePage();
    this.data = [];
  }

  /**
   * Initialize the presenter by fetching any required data
   * @returns {Promise<void>}
   */
  async init() {
    this.data = await this.fetchHomeData();
  }

  /**
   * Mock function to simulate data fetching
   * Replace with actual data fetching logic when needed
   */
  async fetchHomeData() {
    const urlGetStories = `${BASE_URL}/stories`;
    const response = await fetch(urlGetStories, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('HTTP request error');
    }

    const data = await response.json();
    return data.listStory;
  }

  /**
   * Prepare the view with data and render it
   * @returns {Promise<string>} Rendered HTML content
   */
  async present() {
    // Initialize the presenter to fetch data
    await this.init();

    // Pass data to the view and render
    return await this.view.renderPage(this.data);
  }

  async afterPresent() {
    this.view.afterRender();
  }
}

export default HomePresenter;
