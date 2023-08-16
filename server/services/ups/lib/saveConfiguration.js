const { CONFIGURATION } = require('./constants');

/**
 * @description Save UPS configuration.
 * @param {object} configuration - UPS configuration.
 * @param {string} configuration.nutUrl - UPS NUT Url.
 * @returns {Promise} Resolve when configuration updated & connected.
 * @example saveConfiguration(configuration);
 */
async function saveConfiguration({ nutUrl }) {
  await this.gladys.variable.setValue(CONFIGURATION.URL, nutUrl, this.serviceId);
}

module.exports = {
  saveConfiguration,
};
