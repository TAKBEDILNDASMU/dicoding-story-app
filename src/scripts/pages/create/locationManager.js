import mapManager from '../../utils/mapManager';
import LocationService from '../../services/LocationService';

/**
 * Manages location functionality for the create story page
 * Handles map interactions and geocoding
 */
class LocationManager {
  /**
   * Creates a new instance of the LocationManager
   */
  constructor() {
    this.selectedLocation = {
      lat: -3.04628,
      lng: 119.79492,
    };
    this.locationService = new LocationService();
    this.map = null;

    // Bind methods to preserve 'this' context
    this.onMapEvent = this.onMapEvent.bind(this);
  }

  /**
   * Initializes the location manager and map
   * @returns {Promise<void>}
   */
  async initialize() {
    this.map = this.initialMap();
  }

  /**
   * Initializes the map with the default location
   * @returns {Object} The map instance
   */
  initialMap() {
    // Initialize the map centered on the initial location
    const mapInstance = mapManager.createMap('mapContainer', {
      lat: this.selectedLocation.lat,
      lng: this.selectedLocation.lng,
      zoom: 4,
      draggableMarker: true,
      onMapClick: this.onMapEvent,
      onMarkerDrag: this.onMapEvent,
    });

    return mapInstance;
  }

  /**
   * Handles map click or marker drag events
   * @param {Object} position - Contains latitude and longitude of the selected position
   * @param {number} position.lat - Latitude
   * @param {number} position.lng - Longitude
   * @returns {Promise<void>}
   */
  async onMapEvent({ lat, lng }) {
    // Update the location state
    this.selectedLocation.lat = lat;
    this.selectedLocation.lng = lng;
    this.showLocationLoading();

    try {
      await this.reverseGeocode(lat, lng);
      this.updateLocationDisplay(this.selectedLocation.locationName);
    } catch (error) {
      console.error(error.message);
      this.updateLocationDisplay(`Location (${this.selectedLocation.lat.toFixed(4)}, ${this.selectedLocation.lng.toFixed(4)})`);
    }
  }

  /**
   * Updates the marker position on the map
   * @param {string} location - Location name to display
   */
  updateLocationDisplay(location) {
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
      locationInput.value = location;
      locationInput.style.color = 'black';
    }
  }

  /**
   * Performs reverse geocoding to get a location name from coordinates
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<void>}
   * @throws {Error} If geocoding fails
   */
  async reverseGeocode(lat, lng) {
    try {
      const locationName = await this.locationService.reverseGeocode(lat, lng);
      this.selectedLocation.locationName = locationName || 'Unknown location';
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   * Shows a loading indicator in the location input while geocoding
   */
  showLocationLoading() {
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
      locationInput.value = 'Finding location name...';
      locationInput.style.color = 'black';
    }
  }

  /**
   * Displays an error message related to location selection
   * @param {string} message - The error message
   */
  displayLocationError(message) {
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
      locationInput.value = message;
      locationInput.style.color = 'red';
    }
  }

  /**
   * Gets the currently selected location
   * @returns {Object} Location data with lat, lng and locationName
   */
  getSelectedLocation() {
    return {
      lat: this.selectedLocation.lat,
      lng: this.selectedLocation.lng,
    };
  }

  /**
   * Updates the map to a new location
   * @param {Object} position - New map position
   * @param {number} position.lat - Latitude
   * @param {number} position.lng - Longitude
   */
  updateMapPosition({ lat, lng }) {
    if (this.map) {
      mapManager.setMapCenter(this.map, { lat, lng });
      mapManager.setMarkerPosition(this.map, { lat, lng });
    }
  }
}

export default LocationManager;
