import { ACCESS_TOKEN_KEY, BASE_URL } from '../config';
import mapManager from '../utils/mapManager';
import svgIcons from '../utils/svgIcons';

export const renderModal = (storyData) => {
  // Generate a unique ID for this modal's map container
  const uniqueMapId = mapManager.generateUniqueId();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  const date = new Date(storyData.timestamp).toLocaleString('en-US', options);
  console.log(date);

  return `
    <div class="modal" id="story-modal">
      <div class="modal-content">
        <span class="modal-content__close-button">${svgIcons.close(16, 'close-button-icon')}</span>
        <div class="modal-image">
          <img src="${storyData.imgUrl}" alt="${storyData.imgAlt}" class="modal-image">
        </div>
        <div class="modal-body">
          <div class="modal-body__info">
            <span class="modal-body__icon-avatar">
              ${svgIcons.avatar({ username: storyData.username, className: '' })}
            </span> 
            <div class="modal-body__info-user">
              <h3>${storyData.username}</h3>
              <span>${date}</span> 
            </div>
          </div>
          <div class="modal-body__info-location">
            <span class="modal-body__icon-location">
              ${svgIcons.location(16, 'modal-body__location-icon')} 
            </span>
            <span class="modal-body__location-text">${storyData.location}</span>
          </div>
          <div class="modal-description">
            <p class="modal-description__text">${storyData.description}</p>
          </div>
          <div id="${uniqueMapId}" class="modal-map"></div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Function for initialize the specific card if the user click it
 */
export const initializeModal = () => {
  const cards = document.querySelectorAll('.story-card');

  // Add click event to each card
  cards.forEach((card) => {
    card.addEventListener('click', async () => {
      // Fetch data from Dicoding API
      console.log(card);
      const urlGetStory = `${BASE_URL}/stories/${card.id}`;
      const response = await fetch(urlGetStory, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('HTTP request error');
      }

      const { story } = await response.json();

      // Extract data from the clicked card
      const location = card.querySelector('.story-card__location-text').textContent;

      // Create story data object
      const storyData = {
        imgUrl: story.photoUrl,
        imgAlt: story.name,
        username: story.name,
        location,
        description: story.description,
        timestamp: story.createdAt,
      };

      // Render and append modal
      const modalHTML = renderModal(storyData);
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      // Show modal
      const modal = document.getElementById('story-modal');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal

      // Find the map container ID
      const mapContainer = modal.querySelector('.modal-map');
      const mapContainerId = mapContainer.id;

      // Initialize map after modal is visible
      setTimeout(() => {
        mapManager.createMap(mapContainerId, {
          lat: story.lat,
          lng: story.lon,
          zoom: 12,
        });
      }, 300);

      // Add close button event
      const closeButton = modal.querySelector('.modal-content__close-button');
      closeButton.addEventListener('click', () => {
        modal.classList.remove('active');

        // Clean up map before removing the modal
        mapManager.cleanupMap(mapContainerId);

        setTimeout(() => {
          modal.remove();
          document.body.style.overflow = '';
        }, 300);
      });
    });
  });
};
