import HomePresenter from '../pages/home/HomePresenter';
import mapManager from '../utils/mapManager';
import * as StoryApi from '../data/api.js';
import svgIcons from '../utils/svgIcons';
import LocationService from '../services/LocationService';
import { generateRemoveStoryButtonTemplate, generateSaveStoryButtonTemplate } from './buttonComponent.js';
// Make sure to import deleteStory and that isReportSaved is async
import Database, { isReportSaved } from '../data/database.js'; // Assuming deleteStory is exported

export const renderModal = async (storyData) => {
  // Make renderModal async if setupBookmarkButton becomes async
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

  // setupBookmarkButton will now also be async
  const bookmarkButtonHTML = await setupBookmarkButton(storyData.id);

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
            <div class="bookmark-button-container">
              ${bookmarkButtonHTML}
            </div>
            <p class="modal-description__text">${storyData.description}</p>
          </div>
          <div id="${uniqueMapId}" class="modal-map"></div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Function to handle bookmark button logic (save/remove) and update its display.
 */
const handleBookmarkAction = async (story, modalElement) => {
  const storyId = story.id;
  const buttonContainer = modalElement.querySelector('.bookmark-button-container');

  if (!buttonContainer) {
    console.error('Bookmark button container not found');
    return;
  }

  // Check current saved state
  const currentlySaved = await isReportSaved(storyId);

  if (currentlySaved) {
    await Database.removeStory(storyId);
    console.log('Story removed from database');
  } else {
    await Database.putStory(story);
    console.log('Story saved in database');
  }

  // Update the button's appearance
  const newButtonHTML = await setupBookmarkButton(storyId); // Re-evaluate button state
  buttonContainer.innerHTML = newButtonHTML; // Replace the button

  // Re-attach the event listener to the new button
  // (The old one is removed when innerHTML is replaced)
  const newButton = buttonContainer.querySelector('button'); // Get the new button element
  if (newButton) {
    newButton.addEventListener('click', () => handleBookmarkAction(story, modalElement));
  }
};

export const initializeModal = () => {
  const cards = document.querySelectorAll('.story-card');

  cards.forEach((card) => {
    card.addEventListener('click', async () => {
      const presenter = new HomePresenter({
        view: this, // 'this' might be problematic depending on where initializeModal is called.
        // Consider passing a proper view reference if needed.
        model: StoryApi,
      });

      const locationService = new LocationService();
      const { story } = await presenter.getStoryDetail(card.id);

      const storyData = {
        id: story.id,
        imgUrl: story.photoUrl,
        imgAlt: story.name,
        username: story.name,
        location: 'Loading Location...',
        description: story.description,
        timestamp: story.createdAt,
        // Pass the full story object if needed by putStory
        // Or ensure putStory can work with just storyData
      };

      const modalHTML = await renderModal(storyData); // await if renderModal is async
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      const modal = document.getElementById('story-modal');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      const mapContainer = modal.querySelector('.modal-map');
      const mapContainerId = mapContainer.id;
      const locationDom = modal.querySelector('.modal-body__location-text');

      setTimeout(async () => {
        mapManager.createMap(mapContainerId, {
          lat: story.lat,
          lng: story.lon,
          zoom: 12,
        });
        const locationName = await locationService.reverseGeocode(story.lat, story.lon);
        locationDom.textContent = locationName || `Location: (Lat: ${story.lat.toFixed(4)}, Long: ${story.lon.toFixed(4)})`;
      }, 300);

      const closeButton = modal.querySelector('.modal-content__close-button');
      closeButton.addEventListener('click', () => {
        modal.classList.remove('active');
        mapManager.cleanupMap(mapContainerId);
        setTimeout(() => {
          modal.remove();
          document.body.style.overflow = '';
        }, 300);
      });

      // Initial setup for the bookmark button listener
      const bookmarkButtonContainer = modal.querySelector('.bookmark-button-container');
      const initialBookmarkButton = bookmarkButtonContainer.querySelector('button'); // Assumes buttonComponent renders a <button>
      if (initialBookmarkButton) {
        initialBookmarkButton.addEventListener('click', () => handleBookmarkAction(story, modal));
      }
    });
  });
};

// setupBookmarkButton should now also be async if isReportSaved is async
export const setupBookmarkButton = async (id) => {
  console.log('Setting up bookmark button for id:', id);
  if (await isReportSaved(id)) {
    // Await the check
    return generateRemoveStoryButtonTemplate();
  }
  return generateSaveStoryButtonTemplate();
};
