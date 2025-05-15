class CreatePresenter {
  view;
  model;
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }
  /**
   * Handles form submission to create a new story
   * @returns {Promise<Object>} The API response
   */
  async createStory() {
    try {
      // Get data from the view
      const image = this.view.getCapturedImage();
      const location = this.view.getSelectedLocation();

      // Add debugging to check element existence
      const descriptionElement = document.getElementById('descriptionInput');
      console.log('Description element found:', descriptionElement);

      // Get description either directly or through the view
      const description = descriptionElement ? descriptionElement.value : this.view.getDescription();
      console.log('Description value:', description);

      // Submit to API
      const response = await this.model.storeNewStory({ image, location, description });
      console.log(response);
    } catch (error) {
      console.error('Error in createStory:', error);
    }
  }
}
export default CreatePresenter;
