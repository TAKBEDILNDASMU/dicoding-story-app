/**
 * Renders a button element with specified properties
 * @param { string } text - Button text content
 * @param { string } variant - Button variant
 * @param { string } className - Additional CSS classes
 * @param { string } type - Button type attributes
 * @param { Object } attributes - Additional HTML attributes as key value pairs
 * @returns { returnType } description
 */
export function renderButton(
  text,
  variant = '',
  className = '',
  type = 'button',
  attributes = {},
  svgBtn = '',
) {
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
