const { CONFIGURATION } = require('./constants');

const updateOrDestroyVariable = async (variable, key, value, serviceId) => {
  if (value !== undefined && value !== null && (typeof value !== 'string' || value.length > 0)) {
    await variable.setValue(key, value, serviceId);
  } else {
    await variable.destroy(key, serviceId);
  }
};

/**
 * @description Save UPS configuration.
 * @param {object} configuration - UPS configuration.
 * @param {string} configuration.nutUrl - UPS NUT Url.
 * @returns {Promise} Resolve when configuration updated & connected.
 * @example saveConfiguration(configuration);
 */
async function saveConfiguration({nutUrl}) {
  await this.gladys.variable.setValue(CONFIGURATION.URL, nutUrl, this.serviceId);
}

module.exports = {
  saveConfiguration,
};
