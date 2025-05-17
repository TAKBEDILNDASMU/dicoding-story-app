/**
 * Map Manager to handle map instances across the app
 * This prevents conflicts between map initializations
 */
class MapManager {
  constructor() {
    this.maps = {};
    this.counter = 0;
  }

  /**
   * Generate a unique map ID
   * @returns {string} Unique ID for map container
   */
  generateUniqueId() {
    return `map-container-${++this.counter}`;
  }

  /**
   * Create a new map instance
   * @param {string} containerId - ID of the container element
   * @param {Object} options - Map options
   * @param {number} options.lat - Latitude
   * @param {number} options.lng - Longitude
   * @param {number} options.zoom - Zoom level
   * @param {boolean} options.draggableMarker - Whether marker is draggable
   * @param {Function} options.onMapClick - Handler for map click events
   * @param {Function} options.onMarkerDrag - Handler for marker drag events
   * @returns {Object} Map instance
   */
  createMap(containerId, options = {}) {
    // Clean up existing map if there is one with this ID
    this.cleanupMap(containerId);

    const mapContainer = document.getElementById(containerId);
    if (!mapContainer) {
      console.warn(`Map container with ID ${containerId} not found`);
      return null;
    }

    try {
      // Default options
      const defaultOptions = {
        lat: -7.88289,
        lng: 111.45081,
        zoom: 12,
        draggableMarker: false,
        onMapClick: null,
        onMarkerDrag: null,
      };

      // Merge options
      const mapOptions = { ...defaultOptions, ...options };

      // Create map
      const map = L.map(containerId).setView([mapOptions.lat, mapOptions.lng], mapOptions.zoom);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add marker
      const marker = L.marker([mapOptions.lat, mapOptions.lng], {
        draggable: mapOptions.draggableMarker,
      }).addTo(map);

      // Set up event listeners
      if (mapOptions.onMarkerDrag && mapOptions.draggableMarker) {
        marker.on('dragend', () => {
          const position = marker.getLatLng();
          mapOptions.onMarkerDrag(position);
        });
      }

      if (mapOptions.onMapClick) {
        map.on('click', (event) => {
          mapOptions.onMapClick(event.latlng);
          // Update marker position on click
          marker.setLatLng(event.latlng);
        });
      }

      // Store map instance and marker for later reference
      this.maps[containerId] = {
        map,
        marker,
      };

      // Ensure map is properly sized
      setTimeout(() => {
        if (map) {
          map.invalidateSize();
        }
      }, 100);

      return this.maps[containerId];
    } catch (error) {
      console.error('Error creating map:', error);
      this.cleanupMap(containerId);
      return null;
    }
  }

  displayMultipleMarkers(containerId, options = {}) {
    // Clean up existing map if there is one with this ID
    this.cleanupMap(containerId);
    const mapContainer = document.getElementById(containerId);
    if (!mapContainer) {
      console.warn(`Map container with ID ${containerId} not found`);
      return null;
    }
    try {
      // Default options
      const defaultOptions = {
        coordinates: [], // Array of coordinates to display
        zoom: 12,
        center: null, // Optional center point, will auto-center if not provided
        fitBounds: true, // Whether to auto-fit bounds to show all markers
        markerOptions: {}, // Options to pass to L.marker
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      };
      // Merge options
      const mapOptions = { ...defaultOptions, ...options };
      // Ensure coordinates is always an array
      if (!Array.isArray(mapOptions.coordinates)) {
        if (mapOptions.coordinates && typeof mapOptions.coordinates === 'object') {
          // Single coordinate object
          mapOptions.coordinates = [mapOptions.coordinates];
        } else if (mapOptions.lat !== undefined && mapOptions.lng !== undefined) {
          // Legacy format with lat/lng at top level
          mapOptions.coordinates = [{ lat: mapOptions.lat, lng: mapOptions.lng }];
        } else {
          mapOptions.coordinates = [];
        }
      }

      // Filter out coordinates with null lat or lng values
      mapOptions.coordinates = mapOptions.coordinates.filter(
        (coord) => coord && coord.lat !== undefined && coord.lat !== null && coord.lng !== undefined && coord.lng !== null,
      );

      // Exit early if no valid coordinates exist
      if (mapOptions.coordinates.length === 0) {
        console.warn('No valid coordinates provided to display on map');
        return null;
      }

      // Determine center of map
      let centerPoint;
      if (mapOptions.center && mapOptions.center.lat !== null && mapOptions.center.lng !== null) {
        // Use provided center if it's not null
        centerPoint = [mapOptions.center.lat, mapOptions.center.lng];
      } else if (mapOptions.coordinates.length > 0) {
        // Use first valid coordinate as center
        centerPoint = [mapOptions.coordinates[0].lat, mapOptions.coordinates[0].lng];
      } else {
        // Default center if no coordinates provided
        centerPoint = [-7.88289, 111.45081];
      }

      // Create map
      const map = L.map(containerId).setView(centerPoint, mapOptions.zoom);

      // Add tile layer
      L.tileLayer(mapOptions.tileLayer, {
        attribution: mapOptions.attribution,
      }).addTo(map);

      // Track all markers
      const markers = [];

      // Add markers for each coordinate
      mapOptions.coordinates.forEach((coord) => {
        // This check is redundant now but keeping for robustness
        if (coord && coord.lat !== null && coord.lng !== null) {
          const marker = L.marker([coord.lat, coord.lng], mapOptions.markerOptions).addTo(map);
          // Add popup if content is provided
          if (coord.popupContent) {
            marker.bindPopup(coord.popupContent);
          }
          markers.push(marker);
        }
      });

      // Auto-fit bounds if there are multiple markers and fitBounds is true
      if (markers.length > 1 && mapOptions.fitBounds) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1)); // Add 10% padding around markers
      }

      // Store map instance and markers for later reference
      this.maps[containerId] = {
        map,
        markers,
      };

      // Ensure map is properly sized
      setTimeout(() => {
        if (map) {
          map.invalidateSize();
        }
      }, 100);

      return this.maps[containerId];
    } catch (error) {
      console.error('Error creating map with multiple markers:', error);
      this.cleanupMap(containerId);
      return null;
    }
  }

  /**
   * Get map instance by container ID
   * @param {string} containerId - ID of the container element
   * @returns {Object|null} Map instance or null if not found
   */
  getMap(containerId) {
    return this.maps[containerId] || null;
  }

  /**
   * Clean up and remove map instance
   * @param {string} containerId - ID of the container element
   */
  cleanupMap(containerId) {
    const mapInstance = this.maps[containerId];

    if (mapInstance) {
      try {
        const { map } = mapInstance;
        // Remove all event listeners
        map.off();
        // Remove all layers
        map.eachLayer((layer) => {
          map.removeLayer(layer);
        });
        // Remove the map
        map.remove();
      } catch (error) {
        console.warn(`Error cleaning up map ${containerId}:`, error);
      } finally {
        // Remove from maps object
        delete this.maps[containerId];
      }
    }
  }

  /**
   * Clean up all maps
   */
  cleanupAllMaps() {
    Object.keys(this.maps).forEach((id) => {
      this.cleanupMap(id);
    });
  }
}

// Export singleton instance
export default new MapManager();
