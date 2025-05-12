/**
 * Parse the current URL hash and extract the normalized path
 * @returns {String} Normalized route path
 */
export function parseCurrentRoute() {
  const pathname = location.hash.replace("#", "") || "/";

  return pathname || "/";
}
