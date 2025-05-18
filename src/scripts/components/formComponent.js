import svgIcons from '../utils/svgIcons';
import { renderButton } from './buttonComponent';

/**
 * Renders a form input group with label and content
 * @param { string } labelText - The label text
 * @param { string } content - The HTML content for the input group
 * @param { id } id - Optional ID for the form group
 * @returns { string } The rendered form group HTML
 */
export function renderFormGroup(labelText, content, id = '') {
  return `
    <div class="create-form__group" >
      <label class="create-form__label" ${id ? `for=${id}` : ''}>${labelText}</label>
      ${content}
    </div>
  `;
}

/**
 * Renders and image upload area
 * @returns { string } The rendered image upload HTML
 */
export function renderImageUpload() {
  const content = `
    <div class="create-form__image-upload" id="imageUploadArea">
      <div class="create-form__image-container">
        <video id="cameraPreview" class="camera-preview hidden" autoplay></video>
        <button type="button" id="captureButton" class="capture-button hidden">Capture Photo</button>
        <canvas id="captureCanvas" class="hidden"></canvas>
        <input type="file" id="imageUploadInput" accept="image/jpeg, image/png, image/gif" style="display: none;">
        ${svgIcons.image(24, 'create-form__image-icon')}
        <p class="create-form__upload-text">Drag and drop an image here, or click to select</p>
        <small class="create-form__upload-help">JPG, PNG, GIF up to 10MB</small>
      </div>
         <!-- Camera button will be rendered here via JavaScript -->
      <button id="imageCameraUpload" type="button" class="create-form__camera-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-camera">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
          <circle cx="12" cy="13" r="3"></circle>
        </svg>
        <span>Take Photo Instead</span>
      </button>

    </div>
  `;
  return renderFormGroup('Image', content, 'imageUploadInput');
}

/**
 * Renders a textarea input
 *
 * @param { string } label - The label text
 * @param { string } placeholder - Placeholder text
 * @param { number } rows - Number of rows
 * @param { string } value - Default value
 * @returns { string } The rendered textarea HTML
 */

export function renderTextarea(label, placeholder = '', rows = 4, value = '') {
  const content = `
    <textarea 
      class="create-form__textarea" 
      id="descriptionInput"
      rows="${rows}" 
      placeholder="${placeholder}"
    >${value}</textarea>
  `;
  return renderFormGroup(label, content, 'descriptionInput');
}

export function renderLocationInput(defaultLocation = 'Jakarta') {
  const content = `
   <div id="mapContainer" class="create-form__map"></div>
   <div class="create-form__location-input">
    ${svgIcons.location(24, 'create-form__location-icon')}
    <input disabled id="locationInput" class="create-form__location-field" type="text" value="${defaultLocation}">
   </div>
  `;

  return renderFormGroup('Location', content);
}

/**
 * Renders form action button
 * @returns { string } The rendered buttons HTML
 */

export function renderFormActions() {
  const svgUpload = svgIcons.upload(16, 'create-form__upload-icon');

  const buttons = [
    { text: 'Cancel', variant: 'cancel', type: 'button', id: 'cancelButton' },
    {
      text: 'Publish Story',
      variant: 'publish',
      type: 'submit',
      id: 'publishButton',
      svgBtn: svgUpload,
    },
  ];

  const buttonHtml = buttons.map((btn) => renderButton(btn.text, btn.variant, '', btn.type, { id: btn.id }, btn.svgBtn)).join('');

  return `
    <div class="create-form__actions">
      ${buttonHtml}
    </div>
  `;
}
