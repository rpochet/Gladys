const {
  DEVICE_FEATURE_CATEGORIES,
  DEVICE_FEATURE_TYPES,
  DEVICE_FEATURE_UNITS,
} = require('../../../../utils/constants');

/**
 * @description Transforms Netatmo feature as Gladys feature. Current temperature.
 * @param {string} name - Name device from Netatmo.
 * @param {string} externalId - Gladys external ID.
 * @param {string} featureName - Gladys external ID.
 * @returns {object} Gladys feature or undefined.
 * @example
 * buildFeatureTemperature(device_name, 'netatmo:device_id', 'temperature');
 */
function buildFeatureTemperature(name, externalId, featureName) {
  return {
    name: `Temperature - ${name}`,
    external_id: `${externalId}:${featureName}`,
    selector: `${externalId}:${featureName}`,
    category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
    type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
    unit: DEVICE_FEATURE_UNITS.CELSIUS,
    read_only: true,
    keep_history: true,
    has_feedback: false,
    min: -10,
    max: 50,
  };
}

/**
 * @description Transforms Netatmo feature as Gladys feature.
 * @param {string} name - Name device from Netatmo.
 * @param {string} externalId - Gladys external ID.
 * @returns {object} Gladys feature or undefined.
 * @example
 * buildFeatureOpenWindow(device_name, 'netatmo:device_id');
 */
function buildFeatureOpenWindow(name, externalId) {
  return {
    name: `Detecting open window - ${name}`,
    external_id: `${externalId}:open_window`,
    selector: `${externalId}:open_window`,
    category: DEVICE_FEATURE_CATEGORIES.OPENING_SENSOR,
    type: DEVICE_FEATURE_TYPES.SENSOR.BINARY,
    read_only: true,
    keep_history: true,
    has_feedback: false,
    min: 0,
    max: 1,
  };
}

module.exports = {
  buildFeatureTemperature,
  buildFeatureOpenWindow,
};
