/**
 * Renders a header with navigation links
 * @param { string } title - The header title
 * @param { array } links - Array of links object with href, text, and active properties
 * @returns { string } The rendered header HTML
 */
export function renderHeader(title, links = []) {
  const navLinks = links
    .map(
      (link) => `
      <a href="${link.href}" class="header__button${link.active ? ' header__button--active' : ''}">
        ${link.text}
      </a>
  `,
    )
    .join('');

  return `
    <header class="header">
        <h1 class="header__title">${title}</h1>
        <div class="header__buttons">
          ${navLinks}
        </div>
    </header>
  `;
}
