// File: pages/newCreate/imageUploadManager.js
import svgIcons from '../../utils/svgIcons';

/**
 * Manages image upload functionality for the create story page
 * Handles file uploads and image preview
 */
class ImageUploadManager {
  /**
   * Creates a new instance of the ImageUploadManager
   */
  constructor() {
    this.imageUploadDiv = null;
    this.fileInputElement = null;
    this.uploadedFile = null;
    this._handleImageUploadDivClick = this._handleImageUploadDivClick.bind(this);
  }

  /**
   * Initializes the image upload functionality
   * @returns {void}
   */
  initialize() {
    // Cache DOM elements
    this.imageUploadDiv = document.querySelector('.create-form__image-upload');
    this.fileInputElement = document.getElementById('imageUploadInput');

    if (!this.imageUploadDiv || !this.fileInputElement) {
      console.error('Required DOM elements for image upload not found');
      return;
    }

    this.initializeImageUpload();
  }

  /**
   * Handles click on the image upload area
   * @private
   */
  _handleImageUploadDivClick() {
    if (this.fileInputElement) {
      this.fileInputElement.click();
    } else {
      console.error('this.fileInputElement is not defined. Cannot trigger click.');
    }
  }

  /**
   * Initializes image upload event listeners
   */
  initializeImageUpload() {
    if (!this.imageUploadDiv || !this.fileInputElement) return;

    // Trigger file input on click
    this.imageUploadDiv.addEventListener('click', this._handleImageUploadDivClick);

    // Handle file selection
    this.fileInputElement.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        this.updateImageReview(file);
        this.uploadedFile = file;
      }
    });

    // Drag and drop event
    this.imageUploadDiv.addEventListener('dragover', (event) => {
      event.preventDefault();
      console.log('test');
      this.imageUploadDiv.classList.add('create-form__image-upload--dragover');
    });

    this.imageUploadDiv.addEventListener('dragleave', () => {
      this.imageUploadDiv.classList.remove('create-form__image-upload--dragover');
    });

    this.imageUploadDiv.addEventListener('drop', (event) => {
      event.preventDefault();
      this.imageUploadDiv.classList.remove('create-form__image-upload--dragover');
      const file = event.dataTransfer.files[0];
      if (file) {
        this.updateImageReview(file);
        this.uploadedFile = file;
      }
    });
  }

  /**
   * Updates the image preview with the selected file
   * @param {File} imageFile - The image file to preview
   */
  updateImageReview(imageFile) {
    const imageUploadDiv = this.imageUploadDiv;
    const imageUploadContainer = imageUploadDiv.querySelector('.create-form__image-container');

    if (!imageUploadContainer || !imageFile) return;

    const uploadText = imageUploadContainer.querySelector('.create-form__upload-text');
    const uploadHelp = imageUploadContainer.querySelector('.create-form__upload-help');
    const uploadSvg = imageUploadContainer.querySelector('svg');
    const cameraButton = document.getElementById('imageCameraUpload');
    let imgPreview = imageUploadContainer.querySelector('.create-form__image-preview');

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;

      if (!imgPreview) {
        imgPreview = document.createElement('img');
        imgPreview.className = 'create-form__image-preview';

        if (uploadText) {
          imageUploadContainer.insertBefore(imgPreview, uploadText);
        } else {
          imageUploadContainer.appendChild(imgPreview);
        }
      }

      imgPreview.src = imageDataUrl;

      // Hide upload elements
      this.hideUploadElements([uploadText, uploadHelp, uploadSvg, cameraButton]);

      // Add close button for removing the image and add styling when image is already uploaded
      this.addCloseButton();
      imageUploadDiv.classList.add('create-form__image-upload--dragover');
    };

    reader.readAsDataURL(imageFile);
  }

  /**
   * Hides multiple DOM elements
   * @param {Array|NodeList} elements - Elements to hide
   */
  hideUploadElements(elements) {
    if (elements) {
      if (Array.isArray(elements)) {
        elements.forEach((element) => {
          if (element) element.classList.add('hidden');
        });
      } else {
        // For NodeList
        elements.forEach((element) => element.classList.add('hidden'));
      }
    }
  }

  /**
   * Shows multiple DOM elements
   * @param {Array|NodeList} elements - Elements to show
   */
  showUploadElements(elements) {
    if (elements) {
      if (Array.isArray(elements)) {
        elements.forEach((element) => {
          if (element) element.classList.remove('hidden');
        });
      } else {
        // For NodeList
        elements.forEach((element) => element.classList.remove('hidden'));
      }
    }
  }

  /**
   * Adds a close button to remove the selected image
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
      this.clearImagePreview();
    });
  }

  /**
   * Removes the close button from the image preview
   */
  removeCloseButton() {
    const closeButton = document.querySelector('.create-form__close-img');
    if (closeButton) {
      closeButton.remove();
    }
  }

  /**
   * Clears the image preview and resets the upload area
   */
  clearImagePreview() {
    const imageUploadDiv = this.imageUploadDiv;
    if (!imageUploadDiv) return;

    const uploadElements = document.querySelectorAll(
      '.create-form__upload-text, .create-form__upload-help, svg:not(.create-form__close-icon), .create-form__camera-button',
    );
    const imgPreview = imageUploadDiv.querySelector('.create-form__image-preview');

    if (imgPreview) {
      imgPreview.remove();
    }

    // Show upload elements
    this.showUploadElements(uploadElements);

    // remove the close button and container styling
    this.removeCloseButton();
    imageUploadDiv.classList.remove('create-form__image-upload--dragover');

    // Clear the uploaded file reference
    this.uploadedFile = null;
  }

  /**
   * Gets the current uploaded file
   * @returns {File|null} The uploaded file or null if no file has been uploaded
   */
  getUploadedFile() {
    return this.uploadedFile;
  }

  /**
   * Removes click event listener when necessary
   */
  removeClickListener() {
    if (this.imageUploadDiv) {
      this.imageUploadDiv.removeEventListener('click', this._handleImageUploadDivClick);
    }
  }
}

export default ImageUploadManager;
