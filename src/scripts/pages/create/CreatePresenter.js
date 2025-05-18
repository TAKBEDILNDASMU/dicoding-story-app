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
      const description = this.view.getDescription();

      const response = await this.model.storeNewStory({ image, location, description });
      console.log(response);
    } catch (error) {
      console.error('Error in createStory:', error);
    }
  }
}
export default CreatePresenter;
