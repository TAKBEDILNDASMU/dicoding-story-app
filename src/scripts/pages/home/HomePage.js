import { renderCard } from '../../components/cardComponent';
import { renderHeader } from '../../components/headerComponent';
import { initializeModal } from '../../components/modalComponent';
import LocationService from '../../services/LocationService';
import './homePage.css';

class HomePage {
  /**
   * Render the home page with the provided data
   * @param {Array} data - Data provided by the presenter
   * @returns {Promise<string>} Rendered HTML content
   */

  constructor() {
    this.location = new LocationService();
  }

  async renderPage(data) {
    const initialHtml = `
      ${renderHeader('StoryFeed', [
        {
          href: '/#/',
          text: 'Feed',
          active: true,
        },
        {
          href: '/#/create',
          text: 'Create Story',
          active: false,
        },
      ])} 
        
        <main class="main">
            <div class="section__title">
                <h1 class="section__title-heading">Stories</h1>
            </div>
            <div class="story-grid">
              ${data
                .map((item) => {
                  return renderCard({
                    imgUrl: item.photoUrl,
                    username: item.name,
                    location: 'Loading location...',
                    description: item.description,
                    timestamp: item.createdAt,
                    storyId: item.id,
                  });
                })
                .join('')}
            </div>
        </main>
    `;

    // Start fetching locations after initial render
    setTimeout(() => {
      data.forEach(async (item) => {
        try {
          const location = await this.location.reverseGeocode(item.lat, item.lon);

          // Find and update just the location element
          const locationElement = document.querySelector(`#${item.id} .story-card__location-text`);
          if (locationElement) {
            locationElement.textContent = location;
          }
        } catch (error) {
          console.error('Error fetching location:', error);

          // Update with error message
          const locationElement = document.querySelector(
            `#story-card-${index} .story-card__location-text`,
          );
          if (locationElement) {
            locationElement.textContent = 'Location unavailable';
          }
        }
      });
    }, 0);

    return initialHtml;
  }

  /**
   * Method to be called after the page has been rendered to DOM
   * Used for initializing event listeners and other client-side functionality
   */
  afterRender() {
    // Initialize modal functionality for cards
    initializeModal();
  }
}

export default HomePage;
