import svgIcons from '../utils/svgIcons';

/**
 * Renders a button element with specified properties
 * @param { string } text - Button text content
 * @param { string } variant - Button variant
 * @param { string } className - Additional CSS classes
 * @param { string } type - Button type attributes
 * @param { Object } attributes - Additional HTML attributes as key value pairs
 * @returns { returnType } description
 */
export function renderButton(text, variant = '', className = '', type = 'button', attributes = {}, svgBtn = '') {
  const variantClass = variant ? ` create-form__button--${variant}` : '';
  const buttonClass = `create-form__button${variantClass} ${className}`.trim();

  // Build attributes string
  const attributesStr = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  return `
    <button class="${buttonClass}" type="${type}" ${attributesStr}> 
      ${svgBtn ? `${svgBtn}` : ''}
      ${text}
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="section__title-subscribe-button">
      Unsubscribe ${svgIcons.bell(20)}
    </button>
  `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="section__title-subscribe-button">
      Subscribe ${svgIcons.bell(20)}
    </button>
  `;
}

export function generateSaveStoryButtonTemplate() {
  return `
    <button id="bookmark-story" class="modal-description__bookmark-button">
      Save Story 
    </button>
  `;
}

export function generateRemoveStoryButtonTemplate() {
  return `
    <button id="unbookmark-story" class="modal-description__unbookmark-button">
      Remove Story
    </button>
  `;
}
