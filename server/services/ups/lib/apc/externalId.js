/**
 * @description Return name of device.
 * @param {object} node - The UPS node.
 * @param {object} node.UPSNAME - The UPS node UPSNAME.
 * @returns {string} Return name.
 * @example
 * getDeviceName(node);
 */
function getDeviceName({ UPSNAME }) {
  return `UPS APC ${UPSNAME}`;
}

/**
 * @description Return external id of device.
 * @param {object} node - The UPS node.
 * @param {object} node.UPSNAME - The UPS node UPSNAME.
 * @returns {string} Return external id.
 * @example
 * getDeviceExternalId(node);
 */
function getDeviceExternalId({ UPSNAME }) {
  return `ups:apc:${UPSNAME}`;
}

/**
 * @description Return name of device feature.
 * @param {object} node - The UPS node.
 * @param {object} property - The UPS property.
 * @returns {string} Return name.
 * @example
 * getDeviceFeatureName(node, property);
 */
function getDeviceFeatureName(node, property) {
  return `UPS APC ${node.name} - ${property.featureId}`;
}

/**
 * @description Return external id of deviceFeature.
 * @param {object} node - The UPS node.
 * @param {object} property - The UPS property.
 * @returns {string} Return external id.
 * @example
 * getDeviceFeatureExternalId(node, property);
 */
function getDeviceFeatureExternalId(node, property) {
  return `ups:apc:${node.name}:${property.featureId}`;
}

module.exports = {
  getDeviceName,
  getDeviceExternalId,
  getDeviceFeatureName,
  getDeviceFeatureExternalId,
};
