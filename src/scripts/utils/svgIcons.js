// svgIcons.js - A central place to store all SVG icons

/**
 * Collection of SVG icons used throughout the application
 * Each function returns the SVG markup for the corresponding icon
 */
const svgIcons = {
  /**
   * Close/X icon
   * @param {number} size - Width and height of the icon
   * @param {string} className - Additional CSS classes
   * @returns {string} SVG HTML markup
   */
  close: (size = 24, className = '') => `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class="icon-close ${className}"
    >
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  `,

  /**
   * Upload icon
   * @param {number} size - Width and height of the icon
   * @param {string} className - Additional CSS classes
   * @returns {string} SVG HTML markup
   */
  upload: (size = 24, className = '') => `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class="icon-upload ${className}"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" x2="12" y1="3" y2="15"></line>
    </svg>
  `,

  /**
   * Image icon
   * @param {number} size - Width and height of the icon
   * @param {string} className - Additional CSS classes
   * @returns {string} SVG HTML markup
   */
  image: (size = 24, className = '') => `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class="icon-image ${className}"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
      <circle cx="9" cy="9" r="2"></circle>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
    </svg>
  `,

  /**
   * Location/map pin icon
   * @param {number} size - Width and height of the icon
   * @param {string} className - Additional CSS classes
   * @returns {string} SVG HTML markup
   */
  location: (size = 24, className = '') => `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class="icon-location ${className}"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  `,

  /**
   * Time svg icon
   * @param {number} size - Width and height of the icon
   * @param {string} className - Additional CSS classes
   * @returns {string} SVG HTML markup
   */
  time: (size = 24, className = '') => `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      class="icon-time ${className}" 
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,

  bell: (size = 24, className = '') => `
    <svg 
      version="1.0" 
      id="Layer_1" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      width="${size}"
      height="${size}"
      class="${className}"
      viewBox="0 0 64 64" 
      enable-background="new 0 0 64 64" 
      xml:space="preserve" 
      fill="#ffffff">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier"> 
        <g> 
          <path fill="#ffffff" d="M56,44c-1.832,0-4-2.168-4-4V20C52,8.973,43.027,0,32,0S12,8.973,12,20v20c0,1.793-2.207,4-4,4 c-2.211,0-4,1.789-4,4s1.789,4,4,4h48c2.211,0,4-1.789,4-4S58.211,44,56,44z"></path> 
          <path fill="#ffffff" d="M32,64c4.418,0,8-3.582,8-8H24C24,60.418,27.582,64,32,64z"></path> 
        </g> 
      </g>
    </svg>
  `,

  bookmark: (size = 24, className = '') => `
  <svg 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    width="${size}"
    height="${size}"
    class="${className}">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier"> 
      <path d="M2 0H14V16H12L8 12L4 16H2V0Z" fill="#000000"></path> 
    </g>
  </svg>
`,

  avatar: ({ className = '', username = 'Alexa' }) => {
    // Get first letter of username for avatar
    const avatarLetter = username.split(' ')[0];
    return `<img class="${className}" src="https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarLetter}" alt="${avatarLetter}"/>`;
  },
};

export default svgIcons;
