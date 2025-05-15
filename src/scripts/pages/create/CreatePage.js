import { renderFormActions, renderImageUpload, renderLocationInput, renderTextarea } from '../../components/formComponent';
import { renderHeader } from '../../components/headerComponent';
import CreatePresenter from './CreatePresenter';
import * as StoryAPI from '../../data/api';
import ImageUploadManager from './imageUploadManager';
import CameraManager from './cameraManager';
import LocationManager from './locationManager';
import svgIcons from '../../utils/svgIcons';
import './createPage.css';

/**
 * CreatePage handles the UI for creating a new story with location functionality.
 * It manages the view layer and coordinates with a presenter for business logic.
 * Now enhanced with transitions for a smoother user experience.
 */
class CreatePage {
  /**
   * The presenter instance that handles business logic
   * @private
   */
  presenter = null;

  /**
   * Creates a new instance of the CreatePage
   */
  constructor() {
    this.imageUploadManager = null;
    this.cameraManager = null;
    this.locationManager = null;
    this.transitions = null;

    this.handlePublish = this.handlePublish.bind(this);
  }

  /**
   * Renders the page HTML structure
   * @returns {Promise<string>} The HTML markup for the page
   */
  async present() {
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
        <form class="create-form transition-element">
          <div class="create-form__title">
            <h3 class="create-form__title-heading transition-element">Create New Story</h3>
          </div>
          ${renderImageUpload()}
          ${renderTextarea('Description', 'Tell your story...', 'descriptionInput')}   
          ${renderLocationInput('Indonesia')}
          ${renderFormActions()}
        </form>
      </main>
    `;
  }

  /**
   * Set up all event listeners for the page
   */
  setupEventListeners() {
    const formPublish = document.querySelector('form');
    if (formPublish) {
      formPublish.addEventListener('submit', (event) => this.handlePublish(event));
    } else {
      console.error('Publish button not found in the DOM');
    }

    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        // Navigate back or clear form with transition
        this.animateFormClear();
      });
    }

    // Add transition listeners for image upload area
    const imageUploadArea = document.querySelector('.create-form__image-upload');
    if (imageUploadArea) {
      imageUploadArea.addEventListener('dragenter', () => {
        this.animateDragEnter(imageUploadArea);
      });

      imageUploadArea.addEventListener('dragleave', () => {
        this.animateDragLeave(imageUploadArea);
      });
    }

    // Add transition for textarea focus
    const textarea = document.getElementById('descriptionInput');
    if (textarea) {
      textarea.addEventListener('focus', () => {
        this.animateTextareaFocus(textarea);
      });

      textarea.addEventListener('blur', () => {
        this.animateTextareaBlur(textarea);
      });
    }

    // Add transition for buttons
    const buttons = document.querySelectorAll('.create-form__button');
    buttons.forEach((button) => {
      button.addEventListener('mouseenter', () => {
        this.animateButtonHover(button);
      });

      button.addEventListener('mouseleave', () => {
        this.animateButtonLeave(button);
      });
    });
  }

  /**
   * Initialize the page transitions
   */
  setupTransitions() {
    // Add initial page load animation
    this.animatePageLoad();

    // Setup CSS transition classes
    document.documentElement.style.setProperty('--transition-duration', '0.3s');
    document.documentElement.style.setProperty('--transition-timing', 'ease-in-out');

    // Apply transition classes to elements
    const transitionElements = document.querySelectorAll('.transition-element');
    transitionElements.forEach((element) => {
      element.style.transition = 'all var(--transition-duration) var(--transition-timing)';
    });
  }

  /**
   * Animate page loading with staggered element appearance
   */
  animatePageLoad() {
    const form = document.querySelector('.create-form');
    if (!form) return;

    // Use Web Animations API for the entrance animation
    form.animate(
      [
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      {
        duration: 600,
        easing: 'ease-out',
        fill: 'forwards',
      },
    );

    // Stagger child elements animation
    const elements = [
      document.querySelector('.create-form__title-heading'),
      document.querySelector('.create-form__image-upload'),
      document.querySelector('.create-form__group:nth-of-type(2)'),
      document.querySelector('.create-form__group:nth-of-type(3)'),
      document.querySelector('.create-form__actions'),
    ];

    elements.forEach((element, index) => {
      if (!element) return;

      element.style.opacity = '0';
      element.style.transform = 'translateY(15px)';

      setTimeout(
        () => {
          element.animate(
            [
              { opacity: 0, transform: 'translateY(15px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            {
              duration: 500,
              easing: 'ease-out',
              fill: 'forwards',
            },
          );
        },
        100 + index * 120,
      );
    });
  }

  /**
   * Animate drag enter for image upload area
   * @param {HTMLElement} element - The upload area element
   */
  animateDragEnter(element) {
    element.animate(
      [
        { borderColor: '#ccc', backgroundColor: '#f9f9f9' },
        { borderColor: '#3a86ff', backgroundColor: '#f0f4ff', transform: 'scale(1.02)' },
      ],
      {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards',
      },
    );
  }

  /**
   * Animate drag leave for image upload area
   * @param {HTMLElement} element - The upload area element
   */
  animateDragLeave(element) {
    element.animate(
      [
        { borderColor: '#3a86ff', backgroundColor: '#f0f4ff', transform: 'scale(1.02)' },
        { borderColor: '#ccc', backgroundColor: '#f9f9f9', transform: 'scale(1)' },
      ],
      {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards',
      },
    );
  }

  /**
   * Animate textarea focus
   * @param {HTMLElement} element - The textarea element
   */
  animateTextareaFocus(element) {
    element.animate([{ boxShadow: 'none' }, { boxShadow: '0 0 0 3px rgba(58, 134, 255, 0.2)' }], {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards',
    });
  }

  /**
   * Animate textarea blur
   * @param {HTMLElement} element - The textarea element
   */
  animateTextareaBlur(element) {
    element.animate([{ boxShadow: '0 0 0 3px rgba(58, 134, 255, 0.2)' }, { boxShadow: 'none' }], {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards',
    });
  }

  /**
   * Animate button hover
   * @param {HTMLElement} button - The button element
   */
  animateButtonHover(button) {
    const isPublish = button.id === 'publishButton';

    if (isPublish) {
      button.animate([{ backgroundColor: 'rgba(15, 23, 42, 1)' }, { backgroundColor: 'rgba(15, 23, 42, 0.8)', transform: 'translateY(-2px)' }], {
        duration: 200,
        easing: 'ease-out',
        fill: 'forwards',
      });
    } else {
      button.animate([{ backgroundColor: '#f0f0f0' }, { backgroundColor: '#e0e0e0', transform: 'translateY(-2px)' }], {
        duration: 200,
        easing: 'ease-out',
        fill: 'forwards',
      });
    }
  }

  /**
   * Animate button leave
   * @param {HTMLElement} button - The button element
   */
  animateButtonLeave(button) {
    const isPublish = button.id === 'publishButton';

    if (isPublish) {
      button.animate(
        [
          { backgroundColor: 'rgba(15, 23, 42, 0.8)', transform: 'translateY(-2px)' },
          { backgroundColor: 'rgba(15, 23, 42, 1)', transform: 'translateY(0)' },
        ],
        {
          duration: 200,
          easing: 'ease-out',
          fill: 'forwards',
        },
      );
    } else {
      button.animate(
        [
          { backgroundColor: '#e0e0e0', transform: 'translateY(-2px)' },
          { backgroundColor: '#f0f0f0', transform: 'translateY(0)' },
        ],
        {
          duration: 200,
          easing: 'ease-out',
          fill: 'forwards',
        },
      );
    }
  }

  /**
   * Animate form clearing with transitions
   */
  animateFormClear() {
    const descriptionInput = document.getElementById('descriptionInput');
    const imagePreview = document.querySelector('.create-form__image-preview');

    if (imagePreview && imagePreview.style.display !== 'none') {
      const animation = imagePreview.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.8)' },
        ],
        {
          duration: 300,
          easing: 'ease-in',
          fill: 'forwards',
        },
      );

      animation.onfinish = () => {
        this.imageUploadManager.clearImagePreview();
      };
    }

    if (descriptionInput && descriptionInput.value) {
      descriptionInput.animate([{ opacity: 1 }, { opacity: 0.5 }], {
        duration: 300,
        easing: 'ease-in',
        fill: 'forwards',
      }).onfinish = () => {
        descriptionInput.value = '';
        descriptionInput.animate([{ opacity: 0.5 }, { opacity: 1 }], {
          duration: 300,
          easing: 'ease-out',
          fill: 'forwards',
        });
      };
    }
  }

  /**
   * Apply a success animation after story publishing
   */
  animatePublishSuccess() {
    const form = document.querySelector('.create-form');
    if (!form) return;

    // Flash a success state
    form.animate(
      [
        { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' },
        { boxShadow: '0 0 20px rgba(72, 187, 120, 0.4)' },
        { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' },
      ],
      {
        duration: 1000,
        easing: 'ease-in-out',
      },
    );

    // Create and show a success message
    const successMsg = document.createElement('div');
    successMsg.className = 'create-form__success-message';
    successMsg.textContent = 'Story published successfully!';
    successMsg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #48bb78;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      opacity: 0;
      transform: translateX(30px);
      z-index: 1000;
    `;

    document.body.appendChild(successMsg);

    successMsg.animate(
      [
        { opacity: 0, transform: 'translateX(30px)' },
        { opacity: 1, transform: 'translateX(0)' },
      ],
      {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards',
      },
    );

    setTimeout(() => {
      successMsg.animate(
        [
          { opacity: 1, transform: 'translateX(0)' },
          { opacity: 0, transform: 'translateX(30px)' },
        ],
        {
          duration: 300,
          easing: 'ease-in',
          fill: 'forwards',
        },
      ).onfinish = () => successMsg.remove();
    }, 3000);
  }

  /**
   * Handles the publish button click
   */
  async handlePublish(event) {
    event.preventDefault();
    // Disable the button to prevent multiple clicks
    const publishButton = document.getElementById('publishButton');
    if (publishButton) {
      publishButton.disabled = true;

      // Animate the button text change
      const buttonTextAnimation = publishButton.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
        easing: 'ease-out',
        fill: 'forwards',
      });

      buttonTextAnimation.onfinish = () => {
        publishButton.textContent = 'Publishing...';
        publishButton.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 200,
          easing: 'ease-in',
          fill: 'forwards',
        });
      };
    }

    try {
      await this.presenter.createStory();
      // Success animation
      this.animatePublishSuccess();
    } catch (error) {
      console.error('Error publishing story:', error);
      // Show error message to user with animation
      this.showErrorMessage('Failed to publish story. Please try again.');
    } finally {
      // Re-enable the button with animation
      if (publishButton) {
        const buttonTextAnimation = publishButton.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 200,
          easing: 'ease-out',
          fill: 'forwards',
        });

        buttonTextAnimation.onfinish = () => {
          publishButton.disabled = false;
          publishButton.innerHTML = `${svgIcons.upload(16, 'icon-upload create-form__upload-icon')} Publish Story`;
          publishButton.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 200,
            easing: 'ease-in',
            fill: 'forwards',
          });
        };
      }

      // Clear form with animation
      this.animateFormClear();
    }
  }

  /**
   * Show an error message with animation
   * @param {string} message - The error message to display
   */
  showErrorMessage(message) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'create-form__error-message';
    errorMsg.textContent = message;
    errorMsg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #e53e3e;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      opacity: 0;
      transform: translateX(30px);
      z-index: 1000;
    `;

    document.body.appendChild(errorMsg);

    errorMsg.animate(
      [
        { opacity: 0, transform: 'translateX(30px)' },
        { opacity: 1, transform: 'translateX(0)' },
      ],
      {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards',
      },
    );

    setTimeout(() => {
      errorMsg.animate(
        [
          { opacity: 1, transform: 'translateX(0)' },
          { opacity: 0, transform: 'translateX(30px)' },
        ],
        {
          duration: 300,
          easing: 'ease-in',
          fill: 'forwards',
        },
      ).onfinish = () => errorMsg.remove();
    }, 4000);
  }

  /**
   * Initializes the page functionality after rendering
   * @returns {Promise<void>}
   */
  async afterPresent() {
    this.presenter = new CreatePresenter({
      view: this,
      model: StoryAPI,
    });

    // Initialize specialized managers
    this.imageUploadManager = new ImageUploadManager();
    this.cameraManager = new CameraManager();
    this.locationManager = new LocationManager();

    // Initialize components
    await this.locationManager.initialize();
    this.imageUploadManager.initialize();
    this.cameraManager.initialize();

    // Setup transitions after DOM is loaded
    this.setupTransitions();

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Gets the captured image from either file upload or camera
   * @returns {File|null} The captured image file
   */
  getCapturedImage() {
    return this.imageUploadManager.getUploadedFile() || this.cameraManager.getCapturedImage();
  }

  /**
   * Gets the selected location data
   * @returns {Object} Location data with lat, lng and name
   */
  getSelectedLocation() {
    return this.locationManager.getSelectedLocation();
  }

  /**
   * Gets the current description from the textarea
   * @returns {string} The description text
   */
  getDescription() {
    const textarea = document.getElementById('descriptionInput');
    if (!textarea) {
      console.error('Description textarea element not found');
      return '';
    }
    return textarea.value;
  }
}

export default CreatePage;
