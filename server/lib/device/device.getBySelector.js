const { NotFoundError } = require('../../utils/coreErrors');

/**
 * @description Get a device by selector.
 * @param {string} selector - Device selector.
 * @returns {Promise<object>} Resolve with device.
 * @example
 * device.getBySelector('test-devivce');
 */
function getBySelector(selector) {
  const device = this.stateManager.get('device', selector);

  if (device === null) {
    throw new NotFoundError('Device not found');
  }

  return device;
}

/**
 * @description Get a device feature by selector.
 * @param {string} selector - Device feature selector.
 * @returns {Promise<object>} Resolve with device feature.
 * @example
 * device.getFeatureBySelector('test-devivce-feature');
 */
function getFeatureBySelector(selector) {
  const deviceFeature = this.stateManager.get('deviceFeature', selector);
  if (deviceFeature === null) {
    throw new NotFoundError('DeviceFeature not found');
  }

  return deviceFeature;
}

module.exports = {
  getBySelector,
  getFeatureBySelector,
};
