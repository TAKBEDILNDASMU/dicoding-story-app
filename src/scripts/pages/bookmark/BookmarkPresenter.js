class BookmarkPresenter {
  /** @private */
  #view;

  /** @private */
  #model;

  /** @private */
  #cachedStories = null;

  /**
   * Creates an instance of HomePresenter
   * @constructor
   * @param {Object} params - Constructor parameters
   * @param {Object} params.view - The view instance this presenter is associated with
   * @param {Object} params.model - The data model/API service
   */
  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  /**
   * Fetches all stories from the IndexedDB
   * @async
   * @returns {Promise<Object>} Object containing the list of stories
   * @throws {Error} If the API request fails
   */
  async getAllStories() {
    try {
      // Implement caching for better performance during transitions
      if (this.#cachedStories) {
        return this.#cachedStories;
      }

      const response = await this.#model.getAllStories();
      this.#cachedStories = response; // Cache the response
      return response;
    } catch (error) {
      console.error('Failed to fetch stories:', error.message);
      throw error; // Re-throw to allow the view to handle the error
    }
  }

  /**
   * Refreshes the story list and updates the view
   * @async
   * @returns {Promise<void>}
   */
  async refreshStories() {
    try {
      // Clear the cache to force a fresh fetch
      this.#cachedStories = null;

      // Fetch fresh data
      const response = await this.#model.getAllStories();

      // Update the cache
      this.#cachedStories = response;

      // Update the view if available
      if (this.#view && typeof this.#view.refreshStories === 'function') {
        this.#view.refreshStories(response.listStory);
      }

      return response;
    } catch (error) {
      console.error('Failed to refresh stories:', error.message);
      throw error;
    }
  }

  /**
   * Fetches details for a specific story
   * @async
   * @param {string} id - The ID of the story to fetch
   * @returns {Promise<Object>} The story details
   * @throws {Error} If the API request fails
   */
  async getStoryDetail(id) {
    if (!id) {
      throw new Error('Story ID is required');
    }

    try {
      const response = await this.#model.getDetailStory(id);
      return response;
    } catch (error) {
      console.error(`Failed to fetch story with ID ${id}:`, error.message);
      throw error; // Re-throw to allow the view to handle the error
    }
  }

  /**
   * Delete story from IndexedDB
   */
  async deleteStory() {}
}

export default BookmarkPresenter;
