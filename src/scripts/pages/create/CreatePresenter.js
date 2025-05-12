import { ACCESS_TOKEN_KEY, BASE_URL } from '../../config';
import LocationService from '../../services/LocationService';
import CreatePage from './CreatePage';

class CreatePresenter {
  constructor() {
    this.view = new CreatePage();
    this.locationService = new LocationService();

    // Application State
    this.state = {
      selectedFile: null,
      imagePreviewUrl: null,
      description: '',
      selectedLocation: {
        name: 'Ponorogo',
        lat: -7.86838,
        lng: 111.472974,
      },
    };

    // Bind method to maintain 'this' context
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleRemoveImage = this.handleRemoveImage.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleMarkerDrag = this.handleMarkerDrag.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handlePublishButton = this.handlePublishButton.bind(this);
  }

  /**
   * Prepare the view with data and render it
   * @returns {Promise<string>} Rendered HTML content
   */
  async present() {
    // Pass data to the view and render
    return await this.view.renderPage(this.state);
  }

  /**
   * Set up event listeners and initialize components after view is rendered
   */
  async afterPresent() {
    // Initialize Map
    this.map = this.view.initMap(
      this.state.selectedLocation,
      this.handleMapClick,
      this.handleMarkerDrag,
    );

    // Set up event listener
    this.view.setupEventListener({
      onFileSelect: this.handleFileSelect,
      onRemoveImage: this.handleRemoveImage,
      onDropImage: this.handleDrop,
      onDescriptionChange: this.handleDescriptionChange,
      onPublish: this.handlePublish,
      onCancel: this.handleCancel,
      onPublishButton: this.handlePublishButton,
    });

    // Publish button State
    this.handlePublishButton();
  }

  /**
   * Handle file select from input or drag-and-drop
   * @param { File } file - The Selected File
   */
  handleFileSelect(file) {
    if (!file) return;

    const validationResult = this.validateFile(file);

    if (validationResult.valid) {
      this.state.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.state.imagePreviewUrl = e.target.result;
        this.view.updateImageReview(this.state.imagePreviewUrl);
        this.view.clearUploadError();
      };
      reader.readAsDataURL(file);
    } else {
      this.state.selectedFile = null;
      this.state.imagePreviewUrl = null;
      this.view.clearImagePreview();
      this.view.displayUploadError(validationResult.error);
    }
  }

  /**
   * Handle file drop event
   * @param { File } file - The dropped file
   */
  handleDrop(file) {
    this.handleFileSelect(file);
  }

  /**
   * Handle removing image
   */
  handleRemoveImage() {
    console.log('Removing the image');
    // Reset image state
    this.state.selectedFile = null;
    this.state.imagePreviewUrl = null;

    // clear image preview
    this.view.clearImagePreview();
  }

  /**
   * Handle description text change
   * @param { string } text - The new description text
   */
  handleDescriptionChange(text) {
    this.state.description = text;
  }

  /**
   * Handle map when clicked and update the location
   * @param { Object } position - The new marker position with lat/lng
   */
  handleMapClick({ lat, lng }) {
    this.state.selectedLocation.lat = lat;
    this.state.selectedLocation.lng = lng;

    // Update the location name and location marker
    this.view.updateMarkerLocation({ lat, lng });
    this.reverseGeocode(lat, lng);
  }

  /**
   * Handle marker drag to update location
   * @param { Object } position - The new marker position with lat/lng
   */
  handleMarkerDrag(position) {
    this.state.selectedLocation.lat = position.lat;
    this.state.selectedLocation.lng = position.lng;

    // Update the location name with reverse geocode
    this.reverseGeocode(position.lat, position.lng);
  }

  /**
   * Get location name from coordinates using reverse geocoding
   * @param { number } lat - latitude
   * @param { number } lng - longitude
   */
  async reverseGeocode(lat, lng) {
    this.view.showLocationLoading();

    try {
      const locationName = await this.locationService.reverseGeocode(lat, lng);
      this.state.selectedLocation.name = locationName;
      this.view.updateLocationDisplay(this.state.selectedLocation);
    } catch (error) {
      this.view.displayLocationError("Can't choose this area, try another!");
    }
  }

  /**
   * Validate file that meets requirements
   * @param { File } file - The file to validate
   * @returns { Object } Validation result with valid flag and error message
   */
  validateFile(file) {
    if (!file.type.startsWith('image/')) {
      return {
        valid: false,
        error: 'Invalid file type, Please select JPG, PNG, or GIF',
      };
    }

    // Limit 10MB
    if (file.size > 10 * 1024 * 1024) {
      return {
        valid: false,
        error: 'File is too large. Max 10MB',
      };
    }

    return { valid: true };
  }

  /**
   * Handle cancel button click
   */
  handleCancel() {
    // Reset state
    this.state.selectedFile = null;
    this.state.imagePreviewUrl = null;
    this.state.description = '';

    // Reset UI
    this.view.resetForm();
  }

  /**
   * Handle publish button click
   */
  async handlePublish() {
    this.view.showPublishingState();

    try {
      console.log('Publishing story with data: ', {
        image: this.state.selectedFile,
        description: this.state.description,
        location: this.state.selectedLocation,
      });

      const formData = new FormData();
      formData.append('photo', this.state.selectedFile);
      formData.append('description', this.state.description);
      formData.append('lat', this.state.selectedLocation.lat);
      formData.append('lon', this.state.selectedLocation.lng);

      // Simulate API call
      const createUrl = `${BASE_URL}/stories`;
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN_KEY}`,
        },
        body: formData,
      });

      console.log(await response.json());

      this.view.showPublishSuccess();
      this.handleCancel();
    } catch (error) {
      console.error('Error publishing story: ', error);
    } finally {
      this.view.hidePublishingState();
    }
  }

  /**
   * Handle publish button disable state
   */
  async handlePublishButton() {
    // Disabled the button if the image & description is empty
    if (!this.state.selectedFile || !this.state.description) {
      this.view.togglePublishButton(true);
    } else {
      this.view.togglePublishButton(false);
    }
  }

  /**
   * Handle map cleanup when the page onmount
   */
  handlePageUnmount() {
    this.view.cleanUpMap();
  }
}

export default CreatePresenter;
