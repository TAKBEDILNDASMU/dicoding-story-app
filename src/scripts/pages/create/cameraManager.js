/**
 * Manages camera functionality for capturing photos on the create story page
 */
class CameraManager {
  /**
   * Creates a new instance of the CameraManager
   */
  constructor() {
    this.videoElement = null;
    this.captureButton = null;
    this.canvas = null;
    this.cameraButton = null;
    this.imageUploadDiv = null;
    this.capturedImage = null;
    this.streamRef = null;
  }

  /**
   * Initializes camera-related components
   * @returns {void}
   */
  initialize() {
    // Cache DOM elements
    this.videoElement = document.getElementById('cameraPreview');
    this.captureButton = document.getElementById('captureButton');
    this.canvas = document.getElementById('captureCanvas');
    this.cameraButton = document.getElementById('imageCameraUpload');
    this.imageUploadDiv = document.querySelector('.create-form__image-upload');

    if (!this.cameraButton || !this.videoElement || !this.captureButton || !this.canvas) {
      console.error('Required camera DOM elements not found');
      return;
    }

    this.initializeCamera();
  }

  /**
   * Sets up camera button click event listener
   */
  initializeCamera() {
    if (!this.cameraButton) return;

    // Initialize camera when clicked
    this.cameraButton.addEventListener('click', async (event) => {
      event.stopPropagation();

      try {
        await this.startCamera();
        // Notify the image upload manager to remove its click listener if needed
        if (this.imageUploadDiv && typeof this.imageUploadDiv.dispatchEvent === 'function') {
          // Create and dispatch a custom event that the ImageUploadManager can listen for
          const event = new CustomEvent('cameraStarted');
          this.imageUploadDiv.dispatchEvent(event);
        }
      } catch (error) {
        console.error('Failed to start camera:', error.message);
      }
    });
  }

  /**
   * Starts the camera stream
   * @returns {Promise<void>}
   * @throws {Error} If camera access fails
   */
  async startCamera() {
    const videoElement = this.videoElement;
    const captureButton = this.captureButton;
    const uploadElements = document.querySelectorAll(
      '.create-form__camera-button, .create-form__upload-text, .create-form__upload-help, svg:not(.create-form__close-icon)',
    );

    try {
      // Get camera access
      const constraints = {
        video: {
          facingMode: 'user', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.streamRef = stream;

      // Show video element and capture button
      videoElement.srcObject = stream;
      videoElement.classList.remove('hidden');
      captureButton.classList.remove('hidden');

      captureButton.addEventListener('click', (event) => {
        event.stopPropagation();
        this.capturePhoto();
      });

      // Hide upload elements
      this.hideElements(uploadElements);

      // Wait for video to start playing before showing
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          resolve();
        };
      });
    } catch (error) {
      console.error('Camera access error:', error);
      throw new Error('Could not access camera. Please check permissions.');
    }
  }

  /**
   * Stops the camera stream and hides related elements
   */
  stopCamera() {
    if (this.streamRef) {
      const tracks = this.streamRef.getTracks();
      tracks.forEach((track) => track.stop());
      this.streamRef = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement.classList.add('hidden');
    }

    if (this.captureButton) {
      this.captureButton.classList.add('hidden');
    }
  }

  /**
   * Captures a photo from the video stream
   */
  capturePhoto() {
    if (!this.videoElement || !this.canvas || !this.streamRef) return;

    // Set canvas dimensions to match video
    this.canvas.width = this.videoElement.videoWidth;
    this.canvas.height = this.videoElement.videoHeight;

    // Draw the video frame to the canvas
    const context = this.canvas.getContext('2d');
    context.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);

    // Convert to data URL
    const imageDataUrl = this.canvas.toDataURL('image/jpeg');

    // Create a blob from data URL for form submission
    this.dataUrlToBlob(imageDataUrl).then((blob) => {
      this.capturedImage = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });

      // Stop the camera
      this.stopCamera();

      // Show the captured image
      this.showCapturedImage(imageDataUrl);

      // Hide the camera button
      if (this.cameraButton) this.cameraButton.classList.add('hidden');
    });
  }

  /**
   * Converts a data URL to a Blob object
   * @param {string} dataUrl - The data URL to convert
   * @returns {Promise<Blob>} A promise that resolves to a Blob
   */
  async dataUrlToBlob(dataUrl) {
    return fetch(dataUrl).then((res) => res.blob());
  }

  /**
   * Displays the captured image in the image upload area
   * @param {string} imageDataUrl - The data URL of the captured image
   */
  showCapturedImage(imageDataUrl) {
    const imageUploadDiv = this.imageUploadDiv;
    if (!imageUploadDiv) return;

    const imageUploadContainer = imageUploadDiv.querySelector('.create-form__image-container');
    if (!imageUploadContainer) return;

    let imgPreview = imageUploadContainer.querySelector('.create-form__image-preview');

    // Create image element if it doesn't exist
    if (!imgPreview) {
      imgPreview = document.createElement('img');
      imgPreview.className = 'create-form__image-preview';
      imageUploadContainer.appendChild(imgPreview);
    }

    // Set the image source and show it
    imgPreview.src = imageDataUrl;
    imgPreview.classList.remove('hidden');

    // Add close button
    this.addCloseButton();

    // Add styling
    imageUploadDiv.classList.add('create-form__image-upload--has-image');
  }

  /**
   * Adds a close button to remove the captured image
   */
  addCloseButton() {
    const uploadContainer = document.getElementById('imageUploadArea');
    if (!uploadContainer) return;

    // Skip if button already exists
    if (uploadContainer.querySelector('.create-form__close-img')) return;

    // Import svgIcons dynamically to avoid circular dependencies
    import('../../utils/svgIcons').then((svgIcons) => {
      const buttonClose = document.createElement('button');
      buttonClose.innerHTML = svgIcons.default.close(16, 'create-form__close-icon');
      buttonClose.className = 'create-form__close-img';
      buttonClose.setAttribute('title', 'Remove Image');
      buttonClose.setAttribute('type', 'button');

      uploadContainer.appendChild(buttonClose);

      // Add event listener for the close button
      buttonClose.addEventListener('click', (event) => {
        event.stopPropagation();
        this.clearCapturedImage();
      });
    });
  }

  /**
   * Clears the captured image and resets related elements
   */
  clearCapturedImage() {
    this.capturedImage = null;

    const imageUploadDiv = this.imageUploadDiv;
    if (!imageUploadDiv) return;

    const imgPreview = imageUploadDiv.querySelector('.create-form__image-preview');
    if (imgPreview) {
      imgPreview.remove();
    }

    // Show upload elements
    const uploadElements = document.querySelectorAll(
      '.create-form__upload-text, .create-form__upload-help, svg:not(.create-form__close-icon), .create-form__camera-button',
    );
    this.showElements(uploadElements);

    // Remove close button and styling
    this.removeCloseButton();
    imageUploadDiv.classList.remove('create-form__image-upload--has-image');
  }

  /**
   * Removes the close button
   */
  removeCloseButton() {
    const closeButton = document.querySelector('.create-form__close-img');
    if (closeButton) {
      closeButton.remove();
    }
  }

  /**
   * Hides multiple DOM elements
   * @param {NodeList} elements - Elements to hide
   */
  hideElements(elements) {
    if (elements) {
      elements.forEach((element) => element.classList.add('hidden'));
    }
  }

  /**
   * Shows multiple DOM elements
   * @param {NodeList} elements - Elements to show
   */
  showElements(elements) {
    if (elements) {
      elements.forEach((element) => element.classList.remove('hidden'));
    }
  }

  /**
   * Gets the captured image if any
   * @returns {File|null} The captured image File or null if no image was captured
   */
  getCapturedImage() {
    return this.capturedImage;
  }
}

export default CameraManager;
