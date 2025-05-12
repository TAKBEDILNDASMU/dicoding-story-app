import {
  renderFormActions,
  renderImageUpload,
  renderLocationInput,
  renderTextarea,
} from '../../components/formComponent';
import { renderHeader } from '../../components/headerComponent';
import mapManager from '../../utils/mapManager';
import svgIcons from '../../utils/svgIcons';
import './createPage.css';

class CreatePage {
  constructor() {
    this.mapContainerId = 'mapContainer';
  }

  /**
   * Render the page HTML
   * @param { Object } state - The current application state
   * @returns { Promise<string> } The rendered HTML
   */
  async renderPage(state = {}) {
    const { selectedLocation } = state;

    return `
      ${renderHeader('StoryCreate', [
        {
          href: '/#/',
          text: 'Feed',
          active: false,
        },
        {
          href: '/#/create',
          text: 'Create Story',
          active: true,
        },
      ])} 
      <main class="main">
        <form class="create-form">
          <div class="create-form__title">
            <h3 class="create-form__title-heading">Create New Story</h3>
          </div>
          ${renderImageUpload()}
          ${renderTextarea('Description', 'Tell your story...')}   
          ${renderLocationInput(selectedLocation.name)}
          ${renderFormActions()}
        </form>
      </main>
    `;
  }

  /**
   * Set up all event listener for the page
   * @param { Object } handlers - Object containing event handler function
   */
  setupEventListener(handlers) {
    const {
      onFileSelect,
      onRemoveImage,
      onDropImage,
      onDescriptionChange,
      onCancel,
      onPublish,
      onPublishButton,
    } = handlers;

    // Store the remove image handler
    this.onRemoveImage = onRemoveImage;

    // Image upload area
    const imageUploadDiv = document.querySelector('.create-form__image-upload');
    const fileInputElement = document.getElementById('imageUploadInput');

    if (imageUploadDiv && fileInputElement) {
      // Trigger file input on click
      imageUploadDiv.addEventListener('click', () => {
        fileInputElement.click();
      });

      // Handle file selection
      fileInputElement.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          onFileSelect(file);
          onPublishButton();
        }
      });

      // Drag and drop event
      imageUploadDiv.addEventListener('dragover', (event) => {
        event.preventDefault();
        imageUploadDiv.classList.add('create-form__image-upload--dragover');
      });

      imageUploadDiv.addEventListener('dragleave', () => {
        imageUploadDiv.classList.remove('create-form__image-upload--dragover');
      });

      imageUploadDiv.addEventListener('drop', (event) => {
        event.preventDefault();
        imageUploadDiv.classList.remove('create-form__image-upload--dragover');
        const file = event.dataTransfer.files[0];
        if (file) {
          onDropImage(file);
        }
      });

      // Description textarea
      const descriptionTextarea = document.getElementById('descriptionInput');
      if (descriptionTextarea && onDescriptionChange) {
        descriptionTextarea.addEventListener('input', (event) => {
          onDescriptionChange(event.target.value);
          onPublishButton();
        });
      }
    }

    // Cancel button
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton && onCancel) {
      cancelButton.addEventListener('click', () => {
        onCancel();
      });
    }

    // Submit form
    const form = document.querySelector('form');
    if (form && onPublish) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        onPublish();
      });
    }
  }

  /**
   * Update the image preview with a new image url
   *
   * @param { string } imageUrl - Data URL of the image
   */
  updateImageReview(imageUrl) {
    const imageUploadDiv = document.querySelector('.create-form__image-upload');
    const imageUploadContainer = document.querySelector('.create-form__image-container');
    if (!imageUploadContainer) return;

    const uploadText = imageUploadContainer.querySelector('.create-form__upload-text');
    const uploadHelp = imageUploadContainer.querySelector('.create-form__upload-help');
    const uploadSvg = imageUploadContainer.querySelector('svg');
    let imgPreview = imageUploadContainer.querySelector('.create-form__image-preview');

    if (imageUrl) {
      if (!imgPreview) {
        imgPreview = document.createElement('img');
        imgPreview.className = 'create-form__image-preview';

        if (uploadText) {
          imageUploadContainer.insertBefore(imgPreview, uploadText);
        } else {
          imageUploadContainer.appendChild(imgPreview);
        }
      }

      imgPreview.src = imageUrl;

      if (uploadText) uploadText.style.display = 'none';
      if (uploadHelp) uploadHelp.style.display = 'none';
      if (uploadSvg) uploadSvg.style.display = 'none';

      // Add close button for removing the image and add styling when image is already uploaded
      this.addCloseButton();
      imageUploadDiv.classList.add('create-form__image-upload--dragover');
    }
  }

  /**
   * Add close button to remove the image preview
   *
   * @param { type } paramName - description
   * @returns { returnType } description
   */
  addCloseButton() {
    const uploadContainer = document.getElementById('imageUploadArea');
    if (!uploadContainer) return;

    // Skip if button already exists
    if (uploadContainer.querySelector('.create-form__close-img')) return;

    const buttonClose = document.createElement('button');
    buttonClose.innerHTML = svgIcons.close(16, 'create-form__close-icon');
    buttonClose.className = 'create-form__close-img';
    buttonClose.setAttribute('title', 'Remove Image');
    buttonClose.setAttribute('type', 'button');

    uploadContainer.appendChild(buttonClose);

    // Add event listener for the close button
    buttonClose.addEventListener('click', (event) => {
      event.stopPropagation();
      if (this.onRemoveImage) {
        this.onRemoveImage();
      }
    });
  }

  /**
   * Remove close button if exist
   */
  removeCloseButton() {
    const closeButton = document.querySelector('.create-form__close-img');
    if (closeButton) {
      closeButton.remove();
    }
  }

  /**
   * Clear the image preview
   */
  clearImagePreview() {
    const imageUploadDiv = document.querySelector('.create-form__image-upload');
    if (!imageUploadDiv) return;

    const uploadText = imageUploadDiv.querySelector('.create-form__upload-text');
    const uploadHelp = imageUploadDiv.querySelector('.create-form__upload-help');
    const uploadSvg = imageUploadDiv.querySelector('svg');
    const imgPreview = imageUploadDiv.querySelector('.create-form__image-preview');

    if (imgPreview) {
      imgPreview.remove();
    }

    if (uploadText) uploadText.style.display = 'block';
    if (uploadHelp) uploadHelp.style.display = 'block';
    if (uploadSvg) uploadSvg.style.display = 'block';

    // remove the close button and container styling
    this.removeCloseButton();
    imageUploadDiv.classList.remove('create-form__image-upload--dragover');
  }

  /**
   * Clear any upload error messages
   */
  clearUploadError() {
    const errorElement = document.querySelector('.create-form__upload-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Display an error message for file uploads
   *
   * @param { string } errorMessage - The error message to display
   */
  displayUploadError(errorMessage) {
    this.clearUploadError();

    const uploadContainer = document.querySelector('.create-form__image-upload');
    if (!uploadContainer) return;

    const errorElement = document.createElement('p');
    errorElement.className = 'create-form__upload-error';
    errorElement.style.color = '#e74c3c';
    errorElement.style.margin = '8px 0 0';
    errorElement.style.fontSize = '14px';
    errorElement.textContent = errorMessage;

    uploadContainer.appendChild(errorElement);
  }

  /**
   * Initialize map component
   * @param { Object } initialLocation - Initial location with lat/lng
   * @param { Function } onMapClick - Handler for map click events
   * @param { Function } onMarkerDrag - Handler for marker drag events
   * @returns { Object } Leaflet map Instance
   */
  initMap(initialLocation, onMapClick, onMarkerDrag) {
    // Check map container exist or not
    const mapContainer = document.getElementById(this.mapContainerId);
    if (!mapContainer) return null;

    // Initialize the map centered on the initial location
    const mapInstance = mapManager.createMap(this.mapContainerId, {
      lat: initialLocation.lat,
      lng: initialLocation.lng,
      zoom: 12,
      draggableMarker: true,
      onMapClick,
      onMarkerDrag,
    });

    return mapInstance;
  }

  /**
   * Clean up map when leaving the page
   */
  cleanUpMap() {
    mapManager.cleanupMap(this.mapContainerId);
  }

  /**
   * Update the location display wity new location info
   * @param { Object } location - Location object with name, lat, lng
   */
  updateLocationDisplay(location) {
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
      locationInput.value = location.name;
      locationInput.disabled = false;
    }
  }

  /**
   * Show loading state in location input
   */
  showLocationLoading() {
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
      locationInput.value = 'Finding location name...';
      locationInput.disabled = true;
    }
  }

  /**
   * Give alert to user if there are errors
   */
  displayLocationError(error) {
    alert(error);
  }

  /**
   * Update marker position on the map
   * @param { Object } position - New position with lat/lng
   */
  updateMarkerLocation(position) {
    if (this.marker) {
      this.marker.setLatLng(position);
    }
  }

  /**
   * Reset the form to its initial state
   */
  resetForm() {
    // Reset file input
    const fileInput = document.getElementById('imageUploadInput');
    if (fileInput) {
      fileInput.value = '';
    }

    // Clear image preview
    this.clearImagePreview();

    // Clear error messages
    this.clearUploadError();

    // Reset description
    const descriptionArea = document.getElementById('descriptionInput');
    if (descriptionArea) {
      descriptionArea.value = '';
    }
  }

  /**
   * Show publishing in progress state
   */
  showPublishingState() {
    const publishButton = document.getElementById('publishButton');
    if (publishButton) {
      publishButton.disabled = true;
      publishButton.textContent = 'Publishing...';
    }
  }

  /**
   * Hide Publishing in progress state
   */
  hidePublishingState() {
    const publishButton = document.getElementById('publishButton');
    if (publishButton) {
      const svgUpload = svgIcons.upload(16, 'create-form__upload-icon');

      publishButton.disabled = false;
      publishButton.innerHTML = `${svgUpload} Publish Story`;
      this.togglePublishButton(true);
    }
  }

  /**
   * Show success message after publishing
   */
  showPublishSuccess() {
    alert('Story published successfully!!');
  }

  /**
   * Toggle publish button whether it disable or not
   * @param { Boolean } disabled - Button attribute
   */
  togglePublishButton(disabled) {
    const publishButton = document.getElementById('publishButton');
    if (publishButton) {
      if (disabled) {
        publishButton.disabled = true;
      } else {
        publishButton.disabled = false;
      }
    }
  }
}

export default CreatePage;
