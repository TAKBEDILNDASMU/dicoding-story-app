/**
 * Service for handling location-related functionality
 */
class LocationService {
  /**
   * Perform reverse geocoding to get a location name from coordinates
   * @param { number } lat - latitude
   * @param { number } lng - longitude
   */
  async reverseGeocode(lat, lng) {
    try {
      if (lat == null || lng == null) {
        lat = 0;
        lng = 0;
      }

      console.log(lat, lng);

      // Make request to the nomitanim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse.php?lat=${lat}&lon=${lng}&zoom=18&format=jsonv2`,
      );

      if (!response.ok) {
        throw new Error(`Geocoding API returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.address) {
        // Extract a meaningful location name using hieararchy of location component
        if (data.address.county) return data.address.county;
        if (data.address.city) return data.address.city;
        if (data.address.state) return data.address.state;
        if (data.address.country) return data.adress.country;
      }

      // If no meaningful data is returned
      return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    } catch (error) {
      console.error('Error in reverse geocoding', error);
      // Return coordinates as fallback
      return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    }
  }
}

export default LocationService;
