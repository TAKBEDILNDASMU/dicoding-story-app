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

      // Create an AbortController to manage timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 5000); // 5 seconds timeout

      try {
        // Make request to the Nominatim API with signal for abort
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse.php?lat=${lat}&lon=${lng}&zoom=18&format=jsonv2`, {
          signal: controller.signal,
        });

        // Clear timeout if request completes successfully
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Geocoding API returned status ${response.status}`);
        }

        const data = await response.json();

        if (data.address) {
          // Extract a meaningful location name using hierarchy of location component
          if (data.address.county) return data.address.county;
          if (data.address.city) return data.address.city;
          if (data.address.state) return data.address.state;
          if (data.address.country) return data.address.country; // Fixed typo: adress -> address
        }

        // If no meaningful data is returned
        return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      } catch (error) {
        console.error('Request timed out after 5 seconds');
      }
    } catch (error) {
      throw new Error(`Error reverse geocode: ${error.message}`);
    }
  }
}

export default LocationService;
