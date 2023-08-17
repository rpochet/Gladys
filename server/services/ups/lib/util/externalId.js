const { PARAM_NAMES } = require('../constants');

/**
 * @description Return name of device.
 * @param {object} node - The UPS node.
 * @returns {string} Return name.
 * @example getDeviceName(node);
 */
function getDeviceName(node) {
  return `${node[PARAM_NAMES.DEVICE_MODEL].trim()}`;
}

/**
 * @description Return external id of device.
 * @param {object} node - The UPS node.
 * @returns {string} Return external id.
 * @example getDeviceExternalId(node);
 */
function getDeviceExternalId(node) {
  return `ups:${node[PARAM_NAMES.DEVICE_SERIAL].trim()}`;
}

/**
 * @description Return name of device feature.
 * @param {object} node - The UPS node.
 * @param {object} property - The UPS property.
 * @returns {string} Return name.
 * @example getDeviceFeatureName(node, property);
 */
function getDeviceFeatureName(node, property) {
  return `UPS ${node[PARAM_NAMES.DEVICE_MODEL].trim()} - ${property}`;
}

/**
 * @description Return external id of deviceFeature.
 * @param {object} node - The UPS node.
 * @param {object} property - The UPS property.
 * @returns {string} Return external id.
 * @example getDeviceFeatureExternalId(node, property);
 */
function getDeviceFeatureExternalId(node, property) {
  return `ups:${node[PARAM_NAMES.DEVICE_SERIAL].trim()}:${property}`;
}

module.exports = {
  getDeviceName,
  getDeviceExternalId,
  getDeviceFeatureName,
  getDeviceFeatureExternalId,
};
