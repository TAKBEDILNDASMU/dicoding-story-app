import { renderCard } from '../../components/cardComponent';
import HomePresenter from './HomePresenter';
import * as StoryApi from '../../data/api.js';
import { renderHeader } from '../../components/headerComponent.js';
import './homePage.css';
import { initializeModal } from '../../components/modalComponent.js';
import LocationManager from '../create/locationManager.js';

/**
 * HomePage class - manages the home page view of the StoryFeed application
 * @class
 */
class HomePage {
  /** @private */
  #presenter = null;

  /** @private */
  #transitionController = null;

  /**
   * Creates an instance of HomePage
   * @constructor
   */
  constructor() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryApi,
    });

    // Initialize transition controller if the browser supports it
    this.#initTransitionController();
    this.locationManager = null;
  }

  /**
   * Initializes the Transition API controller if supported by the browser
   * @private
   */
  #initTransitionController() {
    if ('ViewTransition' in window) {
      this.#transitionController = {
        // Check if a transition is currently in progress
        isTransitioning: false,

        // Start a transition
        start: async (updateCallback) => {
          if (this.#transitionController.isTransitioning) return;

          this.#transitionController.isTransitioning = true;

          try {
            // Use the document.startViewTransition API to create smooth transitions
            const transition = document.startViewTransition(async () => {
              // Wait for the DOM update function to complete
              await updateCallback();
            });

            // Wait for the transition to finish
            await transition.finished;
          } catch (error) {
            console.error('Transition failed:', error);
          } finally {
            this.#transitionController.isTransitioning = false;
          }
        },
      };

      console.log('View Transitions API is supported and initialized');
    } else {
      console.log('View Transitions API is not supported in this browser');
      // Fallback to regular DOM updates without transitions
      this.#transitionController = {
        isTransitioning: false,
        start: async (updateCallback) => {
          await updateCallback();
        },
      };
    }
  }

  /**
   * Renders the home page UI with stories from the API
   * @async
   * @returns {string} The HTML markup for the home page
   */
  async present() {
    const { listStory } = await this.#presenter.getAllStories();

    return `
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
          <div class="section__title"=>
              <h1 class="section__title-heading">Map Heat</h1>
          </div>
          <div id="mapHomeContainer" class="create-form__map"></div>
          <div class="section__title" id="sectionStory">
              <h1 class="section__title-heading">Stories</h1>
          </div>
          <div class="story-grid">
            ${this.#renderStoryGrid(listStory)}
          </div>
      </main>
    `;
  }

  /**
   * Renders the grid of story cards
   * @private
   * @param {Array} stories - Array of story objects
   * @returns {string} HTML markup for all story cards
   */
  #renderStoryGrid(stories) {
    if (!stories || !stories.length) {
      return '<p class="no-stories-message">No stories available</p>';
    }

    return stories
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
      .join('');
  }

  /**
   * Performs actions after the page is rendered in the DOM
   */
  async afterPresent() {
    // Initialize modal functionality for cards
    initializeModal();

    // Add event listeners for story interactions if needed
    this.#addEventListeners();

    // Get all location data and feed it to the map
    let { listStory } = await StoryApi.getAllStories();
    const coordinates = listStory.map((story) => {
      return { lat: story.lat, lng: story.lon, popupContent: story.name };
    });

    this.locationManager = new LocationManager();
    await this.locationManager.initialHomeMap(coordinates);
  }

  /**
   * Adds event listeners to the DOM elements
   * @private
   */
  #addEventListeners() {
    // Example: Add event delegation for story card clicks
    document.querySelector('.story-grid').addEventListener('click', (event) => {
      const storyCard = event.target.closest('.story-card');
      if (storyCard) {
        const storyId = storyCard.dataset.storyId;
        if (storyId) {
          this.#handleStoryClick(storyId);
        }
      }
    });

    // Handle navigation events with transitions
    document.addEventListener('click', (event) => {
      // Only handle clicks on links that should use transitions
      const link = event.target.closest('a[data-transition="true"]');
      if (link) {
        event.preventDefault();

        const href = link.getAttribute('href');
        this.#navigateWithTransition(href);
      }
    });
  }

  /**
   * Navigates to a new URL with a view transition
   * @private
   * @param {string} url - The URL to navigate to
   */
  #navigateWithTransition(url) {
    if (!url) return;

    this.#transitionController.start(async () => {
      // You might want to update the router or trigger a navigation event
      // For demonstration, we'll just update the URL
      window.history.pushState({}, '', url);

      // Here you'd typically trigger your router to render the new page
      // For example: app.router.navigate(url);

      // For demonstration purposes:
      console.log(`Navigated to ${url} with transition`);
    });
  }

  /**
   * Handles click events on story cards
   * @private
   * @param {string} storyId - ID of the clicked story
   */
  #handleStoryClick(storyId) {
    // Use transition API for loading story details
    this.#transitionController.start(async () => {
      try {
        const storyData = await this.#presenter.getStoryDetail(storyId);

        // Update DOM with story details
        // This could show a detailed view or update a modal
        const modal = document.getElementById('story-modal');
        if (modal) {
          const modalContent = modal.querySelector('.modal-content');
          if (modalContent) {
            modalContent.innerHTML = `
              <h2>${storyData.title || 'Story Details'}</h2>
              <img src="${storyData.photoUrl}" alt="${storyData.name}'s story" class="modal-image" />
              <p class="modal-description">${storyData.description}</p>
              <div class="modal-meta">
                <span class="modal-author">By ${storyData.name}</span>
                <span class="modal-date">${new Date(storyData.createdAt).toLocaleDateString()}</span>
              </div>
            `;

            // Show the modal
            modal.classList.add('show');
          }
        }
      } catch (error) {
        console.error('Error loading story details:', error);
      }
    });
  }

  /**
   * Refreshes the story grid with new data
   * @public
   * @param {Array} newStories - New story data to render
   */
  refreshStories(newStories) {
    if (!newStories) return;

    this.#transitionController.start(async () => {
      const storyGrid = document.querySelector('.story-grid');
      if (storyGrid) {
        storyGrid.innerHTML = this.#renderStoryGrid(newStories);
      }
    });
  }
}

export default HomePage;
