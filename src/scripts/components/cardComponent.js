import svgIcons from '../utils/svgIcons';

/**
 * Renders a card element with specified properties
 * @param {Object} props - Card properties
 * @param {string} props.imgUrl - URL of the image
 * @param {string} [props.imgAlt="Card image"] - Alt text for the image
 * @param {string} [props.username="Alex Johnson"] - The user who created the card
 * @param {string} props.description - Card description
 * @param {string} [props.location="Malibu Beach, CA"] - Location information
 * @param {string} [props.date] - Date of the card (defaults to current date if not provided)
 * @returns {string} - HTML markup for the card
 */
export function renderCard({
  imgUrl,
  imgAlt = 'Card image',
  username = 'Alex Johnson',
  description,
  location = 'Malibu Beach, CA',
  timestamp,
  storyId,
}) {
  const maxLength = 100;

  // Input validation
  if (!imgUrl) {
    console.error('Image URL is required for card rendering');
    return '';
  }

  if (!description) {
    console.error('Description is required for card rendering');
    return '';
  }

  // Set default date to today if not provided
  const date = new Date(timestamp);
  // Extract individual components
  const year = date.getFullYear(); // 2025
  const month = date.getMonth() + 1; // 5 (Note: months are 0-indexed)
  const day = date.getDate(); // 12

  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  if (description.length > maxLength) {
    description = description.slice(0, maxLength).trim() + '...';
  }

  return `
    <div class="story-card" id="${storyId}">
      <img class="story-card__image" src="${imgUrl}" alt="${imgAlt}" this.alt="${imgAlt}";>
      <div class="story-card__content">
          <div class="story-card__author">
              <span class="story-card__icon-container">
                  ${svgIcons.avatar({ username: username, className: 'story-card__icon-avatar' })}
              </span>
              <p class="story-card__author-text">${username}</p>
          </div>
          <div class="story-card__text">
            <p>${description}</p>
          </div>
      </div>
      <div class="story-card__footer">
          <div class="story-card__location">
              ${svgIcons.location(16, 'story-card__location-icon')}
              <p class="story-card__location-text">${location}</p>
          </div>
          <div class="story-card__date">
              ${svgIcons.time(16, 'story-card__time-icon')} 
              <p class="story-card__time-text">${formattedDate}</p>
          </div>
      </div>
    </div>
  `;
}
